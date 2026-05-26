/**
 * La Matriz — Liceo O'Higgins
 * Google Apps Script: Recepción de respuestas de cuestionarios
 * 
 * INSTRUCCIONES DE USO:
 * 1. Abre tu Google Sheet en el navegador
 * 2. Extensiones → Apps Script
 * 3. Borra el contenido de "Código.gs" y pega TODO este archivo
 * 4. Guarda (Ctrl+S)
 * 5. Haz clic en "Implementar" → "Nueva implementación"
 * 6. Tipo: "Aplicación web"
 *    - Ejecutar como: Yo (tu cuenta del liceo)
 *    - Quién tiene acceso: Cualquier persona
 * 7. Copia la URL que aparece → pégala en QuizOrientacion.tsx
 *    (donde dice APPS_SCRIPT_URL = "PEGA_TU_URL_AQUI")
 *
 * NOTA: Cada vez que modifiques el script, debes hacer
 * "Nueva implementación" → no "Administrar implementaciones".
 */

// ─── CONFIGURACIÓN ──────────────────────────────────────────
// Nombre de las hojas (pestañas) en tu Google Sheet.
// Se crean automáticamente si no existen.
const SHEET_NAMES = {
  resumen:      "📊 Resumen",
  holland:      "🧭 Holland RIASEC",
  rosenberg:    "🪞 Autoestima",
  bieps:        "🧠 BIEPS-J",
  vark:         "🎯 VARK",
  fortalezas:   "⚡ Fortalezas",
  sel:          "💡 SEL",
  sociometrico: "👥 Sociométrico",
  estres:       "🌊 Estrés",
};

// Encabezados de la hoja Resumen
const RESUMEN_HEADERS = [
  "Fecha", "Hora", "Nombre", "Curso",
  "Cuestionario", "Resultado", "Nivel", "Detalles"
];

// Encabezados para hojas individuales por cuestionario
const QUIZ_HEADERS = [
  "Fecha", "Hora", "Nombre", "Curso", "Resultado", "Nivel", "Detalles"
];

// ─── FUNCIÓN PRINCIPAL ──────────────────────────────────────
function doPost(e) {
  try {
    const params = e.parameter;

    // Validación mínima
    if (!params.nombre || !params.curso || !params.cuestionario) {
      return jsonResponse({ ok: false, error: "Faltan campos obligatorios" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const row = {
      fecha:         params.fecha        || Utilities.formatDate(new Date(), "America/Santiago", "dd/MM/yyyy"),
      hora:          params.hora         || Utilities.formatDate(new Date(), "America/Santiago", "HH:mm:ss"),
      nombre:        params.nombre.trim(),
      curso:         params.curso.trim(),
      cuestionario:  params.cuestionario,
      resultado:     params.resultado    || "",
      nivel:         params.nivel        || "",
      detalles:      params.detalles     || "",
    };

    // 1. Escribir en hoja Resumen
    escribirFila(ss, SHEET_NAMES.resumen, RESUMEN_HEADERS, [
      row.fecha, row.hora, row.nombre, row.curso,
      row.cuestionario, row.resultado, row.nivel, row.detalles
    ]);

    // 2. Escribir en hoja específica del cuestionario
    const quizSheetKey = detectarQuiz(row.cuestionario);
    if (quizSheetKey && SHEET_NAMES[quizSheetKey]) {
      escribirFila(ss, SHEET_NAMES[quizSheetKey], QUIZ_HEADERS, [
        row.fecha, row.hora, row.nombre, row.curso,
        row.resultado, row.nivel, row.detalles
      ]);
    }

    return jsonResponse({ ok: true, sheet: quizSheetKey || "resumen" });

  } catch (err) {
    Logger.log("Error en doPost: " + err.toString());
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// Necesario para que Apps Script responda a pre-flight requests
function doGet(e) {
  return jsonResponse({ ok: true, status: "La Matriz — API activa" });
}

// ─── HELPERS ────────────────────────────────────────────────
function escribirFila(ss, sheetName, headers, rowData) {
  let sheet = ss.getSheetByName(sheetName);

  // Crear la hoja si no existe y añadir encabezados
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);

    // Formato de encabezados
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1a1a2e");
    headerRange.setFontColor("#00f5d4");
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);

    // Ancho de columnas
    sheet.setColumnWidth(1, 100); // Fecha
    sheet.setColumnWidth(2, 80);  // Hora
    sheet.setColumnWidth(3, 180); // Nombre
    sheet.setColumnWidth(4, 60);  // Curso
    sheet.setColumnWidth(5, 200); // Resultado / Cuestionario
    sheet.setColumnWidth(6, 80);  // Nivel
    if (rowData.length > 6) sheet.setColumnWidth(7, 400); // Detalles
  }

  // Añadir fila de datos
  const lastRow = Math.max(sheet.getLastRow(), 1);
  const newRow = sheet.getRange(lastRow + 1, 1, 1, rowData.length);
  newRow.setValues([rowData]);

  // Color de fila alternado
  if ((lastRow + 1) % 2 === 0) {
    newRow.setBackground("#0d1b2a");
  }

  // Color de la columna "Nivel" (si existe)
  const nivelCol = headers.indexOf("Nivel") + 1;
  if (nivelCol > 0) {
    const nivelCell = sheet.getRange(lastRow + 1, nivelCol);
    const nivel = rowData[nivelCol - 1];
    if (nivel === "alto")    nivelCell.setBackground("#1a3a1a").setFontColor("#7fff00");
    if (nivel === "medio")   nivelCell.setBackground("#3a2e0a").setFontColor("#ffd60a");
    if (nivel === "bajo")    nivelCell.setBackground("#0a0a2a").setFontColor("#4361ee");
    if (nivel === "info")    nivelCell.setBackground("#0a1a2a").setFontColor("#00f5d4");
  }
}

function detectarQuiz(titulo) {
  const t = titulo.toLowerCase();
  if (t.includes("holland") || t.includes("riasec") || t.includes("técnico"))   return "holland";
  if (t.includes("rosenberg") || t.includes("autoestima"))                        return "rosenberg";
  if (t.includes("bieps") || t.includes("bienestar"))                             return "bieps";
  if (t.includes("vark") || t.includes("aprendizaje"))                            return "vark";
  if (t.includes("fortaleza"))                                                     return "fortalezas";
  if (t.includes("sel") || t.includes("socioemocional"))                          return "sel";
  if (t.includes("sociométrico") || t.includes("relaciones"))                     return "sociometrico";
  if (t.includes("estrés") || t.includes("estres") || t.includes("afrontamiento")) return "estres";
  return null;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
