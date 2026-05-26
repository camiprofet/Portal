/* ============================================================
   QuizOrientacion — Batería completa de cuestionarios
   8 instrumentos + envío a Google Sheets vía Apps Script

   CONFIGURACIÓN REQUERIDA:
   Reemplaza APPS_SCRIPT_URL con la URL de tu Web App.
   Ver guía: GUIA_CONFIGURACION_GOOGLE.md incluida en el proyecto.
   ============================================================ */
import { useState, useCallback } from "react";
import {
  ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  Download, X, Database, AlertCircle, Wifi, WifiOff, Loader2
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// TIPOS
// ──────────────────────────────────────────────────────────────
type OptionValue = string | number;

interface QuizOption {
  value: OptionValue;
  label: string;
}

interface QuizItem {
  id: number;
  text: string;
  options: QuizOption[];
  reversed?: boolean; // para ítems de escala invertida
}

interface QuizResult {
  title: string;
  desc: string;
  tags: string[];
  color: string;
  level?: "alto" | "medio" | "bajo" | "info";
  extra?: { label: string; value: string; color: string }[];
  csvSummary: string; // resumen compacto para CSV
}

interface Quiz {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  fullDesc: string;
  color: string;
  time: string;
  items: QuizItem[];
  calcResult: (answers: Record<number, OptionValue>) => QuizResult;
  isSociometric?: boolean;
}

interface StudentRecord {
  nombre: string;
  curso: string;
  fecha: string;
  quizId: string;
  quizTitle: string;
  resultado: string;
  nivel: string;
  detalles: string;
}

// ──────────────────────────────────────────────────────────────
// CONFIGURACIÓN GOOGLE SHEETS
// Reemplaza esta URL con la de tu Web App de Apps Script
// ──────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = "PEGA_TU_URL_AQUI";

const isConfigured = () =>
  APPS_SCRIPT_URL !== "PEGA_TU_URL_AQUI" && APPS_SCRIPT_URL.startsWith("https://");

// Caché de sesión local (backup y para el panel docente)
const sessionRecords: StudentRecord[] = [];

async function sendToSheets(record: StudentRecord): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) {
    // Sin configurar: solo guarda localmente
    return { ok: false, error: "no_configured" };
  }
  try {
    const params = new URLSearchParams({
      nombre: record.nombre,
      curso: record.curso,
      fecha: record.fecha,
      hora: new Date().toLocaleTimeString("es-CL"),
      cuestionario: record.quizTitle,
      resultado: record.resultado,
      nivel: record.nivel,
      detalles: record.detalles,
    });
    // Apps Script requiere no-cors en portales estáticos sin servidor
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    // no-cors no devuelve respuesta legible, asumimos éxito si no lanzó error
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function addToLocalCache(record: StudentRecord) {
  const idx = sessionRecords.findIndex(
    r => r.nombre === record.nombre && r.curso === record.curso && r.quizId === record.quizId
  );
  if (idx >= 0) sessionRecords[idx] = record;
  else sessionRecords.push(record);
}

function exportCSV() {
  if (sessionRecords.length === 0) return;
  const headers = ["Nombre", "Curso", "Fecha", "Cuestionario", "Resultado", "Nivel", "Detalles"];
  const rows = sessionRecords.map(r => [
    r.nombre, r.curso, r.fecha, r.quizTitle, r.resultado, r.nivel, r.detalles
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orientacion_resultados_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ──────────────────────────────────────────────────────────────
// 1. HOLLAND RIASEC
// ──────────────────────────────────────────────────────────────
const hollandItems: QuizItem[] = [
  { id: 1, text: "Me gusta arreglar o construir cosas con mis manos", options: [{ value: "R", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 2, text: "Prefiero trabajar al aire libre o con herramientas/máquinas", options: [{ value: "R", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 3, text: "Disfruto resolver problemas matemáticos o científicos", options: [{ value: "I", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 4, text: "Me gusta investigar y buscar explicaciones a los fenómenos", options: [{ value: "I", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 5, text: "Tengo facilidad para expresarme con arte, música, escritura o actuación", options: [{ value: "A", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 6, text: "Me gustan las actividades creativas sin reglas rígidas", options: [{ value: "A", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 7, text: "Disfruto ayudar a otras personas o enseñarles algo que sé", options: [{ value: "S", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 8, text: "Me siento bien escuchando y apoyando a compañeros/as con problemas", options: [{ value: "S", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 9, text: "Me gusta convencer a otros, liderar grupos o proponer ideas", options: [{ value: "E", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 10, text: "Me atrae emprender, organizar proyectos y tomar decisiones", options: [{ value: "E", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 11, text: "Prefiero trabajos ordenados, con pasos claros y normas definidas", options: [{ value: "C", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
  { id: 12, text: "Me gusta organizar información, archivar datos o llevar registros", options: [{ value: "C", label: "Sí, me gusta" }, { value: "0", label: "No tanto" }] },
];

const hollandPerfiles: Record<string, { name: string; emoji: string; desc: string; ejemplos: string; color: string; orient: string }> = {
  R: { name: "Realista", emoji: "🔧", desc: "Te gustan las actividades físicas y técnicas. Disfrutas trabajar con herramientas, máquinas o la naturaleza.", ejemplos: "Mecánica automotriz, electricidad, construcción, agricultura, tecnología, deportes.", color: "#00f5d4", orient: "Técnica" },
  I: { name: "Investigador", emoji: "🔬", desc: "Eres analítico/a y curioso/a. Disfrutas explorar ideas complejas y aprender cómo funciona el mundo.", ejemplos: "Ciencias, medicina, ingeniería, matemáticas, laboratorio, computación.", color: "#4361ee", orient: "Científica" },
  A: { name: "Artístico/a", emoji: "🎨", desc: "Valoras la creatividad y la expresión original. Te sientes bien en entornos sin reglas rígidas.", ejemplos: "Diseño, música, teatro, arquitectura, comunicaciones, fotografía.", color: "#f72585", orient: "Artística" },
  S: { name: "Social", emoji: "🤝", desc: "Disfrutas trabajar con y para personas. Tienes habilidades para comunicarte, enseñar y apoyar.", ejemplos: "Educación, salud, trabajo social, psicología, orientación vocacional.", color: "#7fff00", orient: "Humanista" },
  E: { name: "Emprendedor/a", emoji: "🚀", desc: "Te motiva el liderazgo, la persuasión y los desafíos. Disfrutas dirigir y tomar decisiones.", ejemplos: "Administración, marketing, derecho, política, ventas, emprendimiento.", color: "#ffd60a", orient: "Humanista" },
  C: { name: "Convencional", emoji: "📋", desc: "Prefieres el orden, la precisión y las instrucciones claras. Eres organizado/a y confiable.", ejemplos: "Contabilidad, secretariado, programación, archivo, banca, logística.", color: "#ff9f1c", orient: "Técnica/Adm." },
};

function calcHolland(answers: Record<number, OptionValue>): QuizResult {
  const counts: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  Object.values(answers).forEach(v => { if (v !== "0" && counts[v as string] !== undefined) counts[v as string]++; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [top, second, third] = sorted.map(s => s[0]);
  const p = hollandPerfiles[top];
  const p2 = hollandPerfiles[second];
  const code = `${top}${second}${third}`;
  return {
    title: `Perfil ${p.emoji} ${p.name}`,
    desc: `${p.desc}\n\nTu código Holland es **${code}** — combinas rasgos de ${p.name}, ${hollandPerfiles[second].name} y ${hollandPerfiles[third].name}.\n\nOrientación sugerida: **${p.orient}**\n\nEjemplos de carreras: ${p.ejemplos}`,
    tags: [`Código: ${code}`, `Orientación: ${p.orient}`],
    color: p.color,
    level: "info",
    extra: sorted.map(([tipo, cnt]) => ({
      label: `${hollandPerfiles[tipo].emoji} ${hollandPerfiles[tipo].name}`,
      value: `${cnt}/2`,
      color: hollandPerfiles[tipo].color,
    })),
    csvSummary: `Perfil=${p.name}|Código=${code}|Orientación=${p.orient}|Puntuaciones=${sorted.map(([t,c])=>`${t}:${c}`).join(";")}`,
  };
}

// ──────────────────────────────────────────────────────────────
// 2. ROSENBERG (Autoestima) — Escala validada 10 ítems
// ──────────────────────────────────────────────────────────────
const rosenbergItems: QuizItem[] = [
  { id: 1, text: "Siento que soy una persona que vale, al menos igual que las demás", options: [{ value: 4, label: "Muy de acuerdo" }, { value: 3, label: "De acuerdo" }, { value: 2, label: "En desacuerdo" }, { value: 1, label: "Muy en desacuerdo" }] },
  { id: 2, text: "Creo que tengo varias cualidades buenas", options: [{ value: 4, label: "Muy de acuerdo" }, { value: 3, label: "De acuerdo" }, { value: 2, label: "En desacuerdo" }, { value: 1, label: "Muy en desacuerdo" }] },
  { id: 3, text: "En general, tiendo a pensar que soy un fracaso/a", options: [{ value: 1, label: "Muy de acuerdo" }, { value: 2, label: "De acuerdo" }, { value: 3, label: "En desacuerdo" }, { value: 4, label: "Muy en desacuerdo" }], reversed: true },
  { id: 4, text: "Soy capaz de hacer cosas tan bien como la mayoría de las personas", options: [{ value: 4, label: "Muy de acuerdo" }, { value: 3, label: "De acuerdo" }, { value: 2, label: "En desacuerdo" }, { value: 1, label: "Muy en desacuerdo" }] },
  { id: 5, text: "Siento que no tengo muchas cosas de las que estar orgulloso/a", options: [{ value: 1, label: "Muy de acuerdo" }, { value: 2, label: "De acuerdo" }, { value: 3, label: "En desacuerdo" }, { value: 4, label: "Muy en desacuerdo" }], reversed: true },
  { id: 6, text: "Tengo una actitud positiva hacia mí mismo/a", options: [{ value: 4, label: "Muy de acuerdo" }, { value: 3, label: "De acuerdo" }, { value: 2, label: "En desacuerdo" }, { value: 1, label: "Muy en desacuerdo" }] },
  { id: 7, text: "En general estoy satisfecho/a conmigo mismo/a", options: [{ value: 4, label: "Muy de acuerdo" }, { value: 3, label: "De acuerdo" }, { value: 2, label: "En desacuerdo" }, { value: 1, label: "Muy en desacuerdo" }] },
  { id: 8, text: "Desearía tener más respeto por mí mismo/a", options: [{ value: 1, label: "Muy de acuerdo" }, { value: 2, label: "De acuerdo" }, { value: 3, label: "En desacuerdo" }, { value: 4, label: "Muy en desacuerdo" }], reversed: true },
  { id: 9, text: "A veces me siento inútil", options: [{ value: 1, label: "Muy de acuerdo" }, { value: 2, label: "De acuerdo" }, { value: 3, label: "En desacuerdo" }, { value: 4, label: "Muy en desacuerdo" }], reversed: true },
  { id: 10, text: "Hay veces que pienso que no sirvo para nada", options: [{ value: 1, label: "Muy de acuerdo" }, { value: 2, label: "De acuerdo" }, { value: 3, label: "En desacuerdo" }, { value: 4, label: "Muy en desacuerdo" }], reversed: true },
];

function calcRosenberg(answers: Record<number, OptionValue>): QuizResult {
  const total = Object.values(answers).reduce((a, b) => (a as number) + (b as number), 0) as number;
  let nivel: string, color: string, desc: string, level: "alto" | "medio" | "bajo";
  if (total >= 30) {
    nivel = "Autoestima Alta"; color = "#7fff00"; level = "alto";
    desc = "Tienes una visión positiva y sólida de ti mismo/a. Te aceptas tal como eres y confías en tus capacidades. Sigue cultivando esta fortaleza — es una base poderosa para tu bienestar.";
  } else if (total >= 20) {
    nivel = "Autoestima Media"; color = "#ffd60a"; level = "medio";
    desc = "Tu autoestima está en un nivel estable, aunque con momentos de duda. Es normal — la mayoría de los adolescentes oscilan entre la confianza y la inseguridad. Enfócate en reconocer tus logros cotidianos.";
  } else {
    nivel = "Autoestima Baja"; color = "#4361ee"; level = "bajo";
    desc = "Parece que estás siendo muy crítico/a contigo mismo/a ahora. Esto puede cambiar con apoyo y práctica. Te invito a conversar con alguien de confianza o con orientación. Recuerda: pedir ayuda es valentía.";
  }
  return {
    title: `${nivel} (${total}/40)`,
    desc,
    tags: [`Puntaje: ${total}/40`, nivel],
    color,
    level,
    extra: [
      { label: "Puntaje total", value: `${total} / 40`, color },
      { label: "Percentil aprox.", value: total >= 30 ? "Top 33%" : total >= 20 ? "Medio 50%" : "Bottom 17%", color },
    ],
    csvSummary: `Puntaje=${total}/40|Nivel=${nivel}`,
  };
}

// ──────────────────────────────────────────────────────────────
// 3. BIEPS-J (Bienestar Psicológico Juvenil)
// ──────────────────────────────────────────────────────────────
const biepsItems: QuizItem[] = [
  { id: 1, text: "Creo que sé lo que quiero hacer con mi vida", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 2, text: "Si algo me sale mal, puedo aceptarlo y seguir adelante", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 3, text: "Me importa pensar qué haré en el futuro", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 4, text: "Puedo decir lo que pienso sin mayores problemas", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 5, text: "Generalmente le caigo bien a la gente", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 6, text: "Siento que puedo manejar las situaciones que me pasan", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 7, text: "Son pocas las veces en que me siento solo/a o aislado/a", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 8, text: "Mis amigos/as pueden confiar en mí cuando me necesitan", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 9, text: "Creo que tengo buenas posibilidades de ser feliz en mi vida", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 10, text: "Estoy bastante contento/a con cómo vivo mi día a día", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 11, text: "Sé cómo se sienten mis amigos/as en la mayoría de las situaciones", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 12, text: "Cuando tengo que tomar decisiones, pienso bien antes de actuar", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
  { id: 13, text: "Me siento apoyado/a por las personas que me rodean", options: [{ value: 3, label: "De acuerdo" }, { value: 2, label: "Ni de acuerdo ni en desacuerdo" }, { value: 1, label: "En desacuerdo" }] },
];

const biesDims = [
  { label: "Control del entorno", items: [2, 6, 12], icon: "🎮" },
  { label: "Vínculos positivos", items: [5, 7, 8, 11, 13], icon: "💜" },
  { label: "Propósito de vida", items: [1, 3, 9], icon: "🎯" },
  { label: "Aceptación de sí mismo", items: [4, 10], icon: "🌟" },
];

function calcBIEPS(answers: Record<number, OptionValue>): QuizResult {
  const total = Object.values(answers).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const max = biepsItems.length * 3;
  const pct = Math.round((total / max) * 100);
  let nivel: string, color: string, desc: string, level: "alto" | "medio" | "bajo";
  if (pct >= 75) {
    nivel = "Bienestar Alto"; color = "#7fff00"; level = "alto";
    desc = "Tienes un buen nivel de bienestar psicológico. Te sientes capaz de manejar desafíos, tienes vínculos positivos y claridad sobre tu futuro. ¡Sigue cultivando esas fortalezas!";
  } else if (pct >= 50) {
    nivel = "Bienestar Moderado"; color = "#ffd60a"; level = "medio";
    desc = "Tu bienestar es estable pero hay áreas que puedes potenciar. Revisa qué dimensión puntúa más bajo y trabájala conscientemente. Apóyate en tus vínculos cercanos.";
  } else {
    nivel = "Bienestar en Construcción"; color = "#4361ee"; level = "bajo";
    desc = "Puede que estés en un momento difícil. Recuerda que el bienestar fluctúa y que buscar apoyo —con la profe, un familiar, un amigo/a— es lo más inteligente que puedes hacer.";
  }
  const dimScores = biesDims.map(d => ({
    ...d,
    score: d.items.reduce((acc, id) => acc + ((answers[id] as number) || 0), 0),
    max: d.items.length * 3,
  }));
  return {
    title: `${nivel} · ${pct}%`,
    desc,
    tags: [`${pct}% de bienestar`, nivel],
    color,
    level,
    extra: dimScores.map(d => ({
      label: `${d.icon} ${d.label}`,
      value: `${d.score}/${d.max}`,
      color: d.score / d.max >= 0.75 ? "#7fff00" : d.score / d.max >= 0.5 ? "#ffd60a" : "#4361ee",
    })),
    csvSummary: `Puntaje=${total}/${max}|Porcentaje=${pct}%|Nivel=${nivel}|${dimScores.map(d=>`${d.label}:${d.score}/${d.max}`).join(";")}`,
  };
}

// ──────────────────────────────────────────────────────────────
// 4. VARK (Estilos de Aprendizaje)
// ──────────────────────────────────────────────────────────────
const varkItems: QuizItem[] = [
  { id: 1, text: "Cuando aprendo algo nuevo, me resulta más fácil si:", options: [{ value: "V", label: "Veo diagramas, mapas o imágenes" }, { value: "A", label: "Escucho una explicación o podcast" }, { value: "R", label: "Leo o tomo apuntes detallados" }, { value: "K", label: "Lo practico o hago un experimento" }] },
  { id: 2, text: "Para recordar el camino a un lugar nuevo, yo:", options: [{ value: "V", label: "Recuerdo los puntos de referencia visuales" }, { value: "A", label: "Repito las instrucciones en voz alta" }, { value: "R", label: "Anoto el camino paso a paso" }, { value: "K", label: "Necesito ir físicamente para aprenderlo" }] },
  { id: 3, text: "Cuando estudio para una prueba, prefiero:", options: [{ value: "V", label: "Hacer esquemas, mapas conceptuales o líneas de tiempo" }, { value: "A", label: "Leer en voz alta o pedir que me pregunten" }, { value: "R", label: "Hacer resúmenes y fichas de definiciones" }, { value: "K", label: "Resolver ejercicios y problemas prácticos" }] },
  { id: 4, text: "Si tengo que aprender a usar una app nueva:", options: [{ value: "V", label: "Prefiero ver un video tutorial" }, { value: "A", label: "Que alguien me lo explique verbalmente" }, { value: "R", label: "Leer el manual o las instrucciones" }, { value: "K", label: "Probar directamente tocando todo" }] },
  { id: 5, text: "En clases, aprendo mejor cuando:", options: [{ value: "V", label: "El profe/a usa pizarra, PPT o imágenes" }, { value: "A", label: "Hay debate, discusión o exposición oral" }, { value: "R", label: "Hay lectura y se trabaja con texto" }, { value: "K", label: "Hay laboratorio, taller o salida a terreno" }] },
  { id: 6, text: "Cuando explico algo a alguien, tiendo a:", options: [{ value: "V", label: "Dibujar, usar gestos o mostrar algo" }, { value: "A", label: "Hablar y dar muchos ejemplos orales" }, { value: "R", label: "Escribirlo o mostrar un texto" }, { value: "K", label: "Demostrarlo haciendo la acción" }] },
  { id: 7, text: "¿Qué tipo de tarea disfrutas más?", options: [{ value: "V", label: "Infografías, afiches o presentaciones visuales" }, { value: "A", label: "Exposiciones orales, debates o podcasts" }, { value: "R", label: "Ensayos, informes o resúmenes escritos" }, { value: "K", label: "Proyectos, maquetas o experimentos" }] },
  { id: 8, text: "Cuando cometes un error, lo corriges mejor si:", options: [{ value: "V", label: "Te muestran visualmente qué estuvo mal" }, { value: "A", label: "Te explican verbalmente qué salió mal" }, { value: "R", label: "Te entregan retroalimentación escrita" }, { value: "K", label: "Vuelves a intentarlo de inmediato" }] },
];

const varkPerfiles: Record<string, { name: string; emoji: string; desc: string; tips: string; color: string }> = {
  V: { name: "Visual", emoji: "👁️", desc: "Aprendes mejor cuando la información se presenta en forma visual: gráficos, mapas conceptuales, colores y diagramas.", tips: "Usa mapas mentales, resalta con colores, mira tutoriales en video, organiza la info en esquemas o líneas de tiempo.", color: "#00f5d4" },
  A: { name: "Auditivo/a", emoji: "🎧", desc: "Procesas mejor la información cuando la escuchas. Aprendes bien en discusiones, debates y explicaciones orales.", tips: "Lee en voz alta, grábate repasando, trabaja en grupo conversando, pide que te pregunten el contenido.", color: "#f72585" },
  R: { name: "Lector/a-Escritor/a", emoji: "📝", desc: "Aprendes mejor cuando lees y escribes. Disfrutas los apuntes detallados, los resúmenes y los textos explicativos.", tips: "Haz fichas, reescribe tus apuntes con tus propias palabras, usa listas numeradas y definiciones.", color: "#4361ee" },
  K: { name: "Kinestésico/a", emoji: "⚡", desc: "Necesitas la experiencia concreta para aprender: practicar, manipular objetos y moverte mientras estudias.", tips: "Estudia haciendo ejercicios, usa simuladores, haz maquetas o experimentos, toma descansos activos cada 25 min.", color: "#ffd60a" },
};

function calcVARK(answers: Record<number, OptionValue>): QuizResult {
  const counts: Record<string, number> = { V: 0, A: 0, R: 0, K: 0 };
  Object.values(answers).forEach(v => { if (counts[v as string] !== undefined) counts[v as string]++; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const e = varkPerfiles[top];
  return {
    title: `Estilo ${e.emoji} ${e.name}`,
    desc: `${e.desc}\n\n**Estrategia recomendada:**\n${e.tips}`,
    tags: [`Predominante: ${e.name}`, sorted[0][1] === sorted[1][1] ? "Multimodal (empate)" : `2° estilo: ${varkPerfiles[sorted[1][0]].name}`],
    color: e.color,
    level: "info",
    extra: sorted.map(([tipo, cnt]) => ({
      label: `${varkPerfiles[tipo].emoji} ${varkPerfiles[tipo].name}`,
      value: `${cnt}/${varkItems.length}`,
      color: varkPerfiles[tipo].color,
    })),
    csvSummary: `Estilo=${e.name}|Puntuaciones=${sorted.map(([t,c])=>`${t}:${c}`).join(";")}`,
  };
}

// ──────────────────────────────────────────────────────────────
// 5. FORTALEZAS (VIA simplificado)
// ──────────────────────────────────────────────────────────────
const fortItems: QuizItem[] = [
  { id: 1, text: "Soy honesto/a y auténtico/a — digo lo que pienso aunque sea difícil", options: [{ value: "honestidad", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 2, text: "Me entusiasmo fácilmente con cosas nuevas y actúo con energía", options: [{ value: "vitalidad", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 3, text: "Me esfuerzo por entender cómo se sienten las personas que me rodean", options: [{ value: "empatia", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 4, text: "Si algo me cuesta, insisto hasta lograrlo — no me rindo fácil", options: [{ value: "perseverancia", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 5, text: "Me gusta aprender cosas nuevas solo porque sí — sin que me lo pidan", options: [{ value: "amor_saber", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 6, text: "Incluso en situaciones difíciles, confío en que las cosas pueden mejorar", options: [{ value: "esperanza", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 7, text: "En un grupo, tiendo a organizar, proponer ideas y guiar a los demás", options: [{ value: "liderazgo", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 8, text: "Cuando alguien me falla, puedo perdonar y seguir sin rencor", options: [{ value: "perdon", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 9, text: "Ayudar a otros me genera satisfacción genuina, aunque no me beneficie", options: [{ value: "bondad", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 10, text: "Me hago preguntas sobre casi todo lo que observo — soy muy curioso/a", options: [{ value: "curiosidad", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 11, text: "Me importa mucho que todos sean tratados con justicia e igualdad", options: [{ value: "justicia", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
  { id: 12, text: "Encuentro soluciones creativas e inesperadas a los problemas", options: [{ value: "creatividad", label: "Muy de acuerdo" }, { value: "0", label: "Poco de acuerdo" }] },
];

const fortInfo: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  honestidad: { label: "Honestidad", emoji: "💎", desc: "Eres genuino/a y transparente. Las personas confían en tu palabra.", color: "#00f5d4" },
  vitalidad: { label: "Vitalidad", emoji: "⚡", desc: "Tu energía y entusiasmo son contagiosos.", color: "#ffd60a" },
  empatia: { label: "Empatía", emoji: "💜", desc: "Comprendes a los demás con facilidad y eres sensible a sus necesidades.", color: "#f72585" },
  perseverancia: { label: "Perseverancia", emoji: "🔥", desc: "Completas lo que empiezas aunque sea difícil.", color: "#ff9f1c" },
  amor_saber: { label: "Amor al Saber", emoji: "📚", desc: "Disfrutas aprender por el solo placer de conocer más.", color: "#4361ee" },
  esperanza: { label: "Esperanza", emoji: "🌟", desc: "Confías en que el futuro puede ser mejor y actúas para lograrlo.", color: "#7fff00" },
  liderazgo: { label: "Liderazgo", emoji: "🦁", desc: "Organizas y motivas a grupos de manera natural.", color: "#00f5d4" },
  perdon: { label: "Perdón", emoji: "🕊️", desc: "Tienes la capacidad de soltar el rencor y dar segundas oportunidades.", color: "#7209b7" },
  bondad: { label: "Bondad", emoji: "💚", desc: "Ayudar a otros te genera satisfacción genuina.", color: "#7fff00" },
  curiosidad: { label: "Curiosidad", emoji: "🔍", desc: "Haces preguntas, exploras y no das nada por sentado.", color: "#00f5d4" },
  justicia: { label: "Justicia", emoji: "⚖️", desc: "Te importa que todos sean tratados de manera equitativa.", color: "#4361ee" },
  creatividad: { label: "Creatividad", emoji: "🎨", desc: "Encuentras soluciones originales y ves ángulos que otros no ven.", color: "#f72585" },
};

function calcFortalezas(answers: Record<number, OptionValue>): QuizResult {
  const activas = Object.values(answers).filter(v => v !== "0") as string[];
  const top3 = activas.slice(0, Math.min(3, activas.length));
  const color = top3.length > 0 ? (fortInfo[top3[0]]?.color || "#00f5d4") : "#00f5d4";
  return {
    title: top3.length > 0 ? `Tus fortalezas: ${top3.map(f => fortInfo[f]?.emoji || "").join(" ")}` : "Fortalezas en exploración",
    desc: top3.length > 0
      ? `Tus principales fortalezas son:\n\n${top3.map(f => `**${fortInfo[f]?.label}** ${fortInfo[f]?.emoji} — ${fortInfo[f]?.desc}`).join("\n\n")}\n\nEstas son tus anclas naturales. Úsalas conscientemente en lo académico, en tus relaciones y en tu proyecto de vida.`
      : "Estás descubriendo tus fortalezas. Ese proceso ya es valioso en sí mismo.",
    tags: top3.map(f => fortInfo[f]?.label || f),
    color,
    level: "info",
    extra: top3.map(f => ({ label: `${fortInfo[f]?.emoji} ${fortInfo[f]?.label}`, value: "Fortaleza activa", color: fortInfo[f]?.color || "#00f5d4" })),
    csvSummary: `Top3=${top3.map(f => fortInfo[f]?.label || f).join(";")}|TotalActivas=${activas.length}/12`,
  };
}

// ──────────────────────────────────────────────────────────────
// 6. SEL — Habilidades Socioemocionales (CASEL)
// ──────────────────────────────────────────────────────────────
const selItems: QuizItem[] = [
  { id: 1, text: "Reconozco cuándo estoy enojado/a, triste o ansioso/a antes de actuar", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 2, text: "Cuando algo me frustró, puedo calmarme y pensar antes de reaccionar", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 3, text: "Puedo establecer metas y trabajar hacia ellas aunque sea difícil", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 4, text: "Entiendo cómo pueden sentirse los demás aunque no lo digan", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 5, text: "Puedo trabajar en equipo respetando opiniones distintas a la mía", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 6, text: "Cuando hay un conflicto, busco resolverlo sin agredir ni ignorar", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 7, text: "Pienso en las consecuencias de mis decisiones antes de actuar", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 8, text: "Me siento seguro/a de pedir ayuda cuando la necesito", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 9, text: "Reconozco cuando cometí un error y asumo mi responsabilidad", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
  { id: 10, text: "Puedo expresar lo que siento o necesito con claridad y sin herir", options: [{ value: 3, label: "✅ Siempre lo hago" }, { value: 2, label: "🔄 A veces lo logro" }, { value: 1, label: "🌱 Me cuesta mucho" }] },
];

const selDims = [
  { label: "Autoconsciencia", items: [1, 2], icon: "🔍" },
  { label: "Autorregulación", items: [3, 8], icon: "🎯" },
  { label: "Conciencia Social", items: [4, 5], icon: "🤝" },
  { label: "Resolución de conflictos", items: [6, 7], icon: "⚖️" },
  { label: "Comunicación asertiva", items: [9, 10], icon: "💬" },
];

function calcSEL(answers: Record<number, OptionValue>): QuizResult {
  const total = Object.values(answers).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const max = selItems.length * 3;
  const pct = Math.round((total / max) * 100);
  let nivel: string, color: string, desc: string, level: "alto" | "medio" | "bajo";
  if (pct >= 80) {
    nivel = "Consolidadas ✅"; color = "#7fff00"; level = "alto";
    desc = "Tus habilidades socioemocionales están bien desarrolladas. Las aplicas de forma autónoma en distintas situaciones. Puedes ser un/a referente positivo para tu entorno.";
  } else if (pct >= 55) {
    nivel = "En Progreso 🔄"; color = "#ffd60a"; level = "medio";
    desc = "Tienes buenas bases y estás desarrollando tus habilidades SEL. Identifica qué dimensión necesita más práctica y búscala en situaciones cotidianas.";
  } else {
    nivel = "En Desarrollo 🌱"; color = "#4361ee"; level = "bajo";
    desc = "Estás comenzando a trabajar estas habilidades. Es normal en la adolescencia — el cerebro emocional sigue madurando hasta los 25 años. Con reflexión y práctica crecerás mucho.";
  }
  const dimScores = selDims.map(d => ({
    ...d,
    score: d.items.reduce((acc, id) => acc + ((answers[id] as number) || 0), 0),
    max: d.items.length * 3,
  }));
  return {
    title: `SEL: ${nivel}`,
    desc,
    tags: [`${pct}% global`, "Marco CASEL"],
    color,
    level,
    extra: dimScores.map(d => ({
      label: `${d.icon} ${d.label}`,
      value: `${d.score}/${d.max}`,
      color: d.score === d.max ? "#7fff00" : d.score >= Math.ceil(d.max * 0.6) ? "#ffd60a" : "#4361ee",
    })),
    csvSummary: `Porcentaje=${pct}%|Nivel=${nivel.replace(/[✅🔄🌱]/g, "").trim()}|${dimScores.map(d=>`${d.label}:${d.score}/${d.max}`).join(";")}`,
  };
}

// ──────────────────────────────────────────────────────────────
// 7. SOCIOMÉTRICO (Relaciones de curso)
// ──────────────────────────────────────────────────────────────
const sociItems: QuizItem[] = [
  { id: 1, text: "¿Con quién del curso preferirías trabajar en un proyecto importante?", options: [{ value: "text", label: "Escribe el/los nombres" }] },
  { id: 2, text: "¿A quién invitarías a una actividad fuera del colegio (cumpleaños, etc.)?", options: [{ value: "text", label: "Escribe el/los nombres" }] },
  { id: 3, text: "¿Quién crees que es más respetado/a o escuchado/a en el curso?", options: [{ value: "text", label: "Escribe el/los nombres" }] },
  { id: 4, text: "¿Con quién te cuesta más relacionarte o trabajar? (opcional — confidencial)", options: [{ value: "text", label: "Escribe el/los nombres (opcional)" }] },
  { id: 5, text: "¿Quién crees que podría necesitar más apoyo o integración en el curso?", options: [{ value: "text", label: "Escribe el/los nombres (opcional)" }] },
];

function calcSociometrico(answers: Record<number, OptionValue>): QuizResult {
  const resps = [answers[1], answers[2], answers[3]].filter(Boolean).map(v => String(v).trim()).filter(v => v.length > 0);
  return {
    title: "Sociométrico completado ✓",
    desc: "Tus respuestas fueron registradas de forma confidencial. Solo la Prof. Camila tendrá acceso a estos datos para mejorar el clima de curso y detectar necesidades de integración.\n\nGracias por tu honestidad.",
    tags: ["Confidencial", "Solo para uso docente"],
    color: "#f72585",
    level: "info",
    extra: [{ label: "Respuestas registradas", value: `${resps.length}/3 completadas`, color: "#00f5d4" }],
    csvSummary: `ColabProyecto=${String(answers[1] || "").replace(/,/g, ";")}|Amistad=${String(answers[2] || "").replace(/,/g, ";")}|Líder=${String(answers[3] || "").replace(/,/g, ";")}|Dificultad=${String(answers[4] || "").replace(/,/g, ";")}|NecesitaApoyo=${String(answers[5] || "").replace(/,/g, ";")}`,
  };
}

// ──────────────────────────────────────────────────────────────
// 8. MANEJO DEL ESTRÉS
// ──────────────────────────────────────────────────────────────
const estresItems: QuizItem[] = [
  { id: 1, text: "Cuando tengo muchas tareas, me organizo y las voy haciendo de a poco", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 2, text: "Cuando algo me preocupa, busco hablar con alguien de confianza", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 3, text: "Hago actividades que me relajan: deporte, música, arte, naturaleza", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 4, text: "Cuando me siento muy estresado/a, puedo hacer pausas y respirar", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 5, text: "Duermo al menos 7-8 horas la mayoría de los días escolares", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 6, text: "Cuando algo salió mal, puedo aprender del error sin castigarme", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 7, text: "Soy capaz de decir 'no' cuando ya tengo demasiado encima", options: [{ value: 3, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 1, label: "Rara vez" }] },
  { id: 8, text: "El estrés de la escuela interfiere con mi ánimo fuera del liceo", options: [{ value: 1, label: "Siempre" }, { value: 2, label: "A veces" }, { value: 3, label: "Rara vez" }], reversed: true },
];

function calcEstres(answers: Record<number, OptionValue>): QuizResult {
  const total = Object.values(answers).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const max = estresItems.length * 3;
  const pct = Math.round((total / max) * 100);
  let nivel: string, color: string, desc: string, level: "alto" | "medio" | "bajo";
  if (pct >= 75) {
    nivel = "Manejo Saludable"; color = "#7fff00"; level = "alto";
    desc = "Tienes buenas estrategias para manejar el estrés. Usas el descanso, el apoyo social y las pausas activas de forma efectiva. ¡Sigue así!";
  } else if (pct >= 50) {
    nivel = "Manejo Moderado"; color = "#ffd60a"; level = "medio";
    desc = "Tienes algunas herramientas, pero hay áreas que puedes fortalecer. Revisa cuáles estrategias usas menos y prueba incorporarlas poco a poco.";
  } else {
    nivel = "Estrés Elevado"; color = "#f72585"; level = "bajo";
    desc = "Parece que el estrés está afectando bastante tu día a día. Es importante buscar apoyo — habla con alguien de confianza, con orientación o con un adulto que te escuche. No tienes que cargarlo solo/a.";
  }
  return {
    title: `${nivel} (${pct}%)`,
    desc,
    tags: [`${pct}% de recursos`, nivel],
    color,
    level,
    extra: [
      { label: "Organización", value: `${answers[1] || 0}/3`, color: (answers[1] as number) === 3 ? "#7fff00" : (answers[1] as number) === 2 ? "#ffd60a" : "#4361ee" },
      { label: "Apoyo social", value: `${answers[2] || 0}/3`, color: (answers[2] as number) === 3 ? "#7fff00" : (answers[2] as number) === 2 ? "#ffd60a" : "#4361ee" },
      { label: "Autocuidado", value: `${answers[3] || 0}/3`, color: (answers[3] as number) === 3 ? "#7fff00" : (answers[3] as number) === 2 ? "#ffd60a" : "#4361ee" },
      { label: "Descanso", value: `${answers[5] || 0}/3`, color: (answers[5] as number) === 3 ? "#7fff00" : (answers[5] as number) === 2 ? "#ffd60a" : "#4361ee" },
    ],
    csvSummary: `Puntaje=${total}/${max}|Porcentaje=${pct}%|Nivel=${nivel}`,
  };
}

// ──────────────────────────────────────────────────────────────
// REGISTRO COMPLETO DE QUIZZES
// ──────────────────────────────────────────────────────────────
const quizzes: Quiz[] = [
  {
    id: "holland", icon: "🧭", color: "#ffd60a", time: "~5 min · 12 preguntas",
    title: "¿Técnico o Humanista?",
    subtitle: "Test Vocacional · Holland RIASEC",
    shortDesc: "Descubre qué tipo de actividades y ambientes de trabajo se alinean con tu personalidad.",
    fullDesc: "Clasifica tu perfil vocacional en 6 tipos: Realista, Investigador, Artístico, Social, Emprendedor y Convencional. Útil para explorar si te inclinás más hacia áreas técnicas, científicas, artísticas, sociales o administrativas.",
    items: hollandItems, calcResult: calcHolland,
  },
  {
    id: "rosenberg", icon: "🪞", color: "#00f5d4", time: "~3 min · 10 preguntas",
    title: "¿Cómo está tu autoestima?",
    subtitle: "Escala de Rosenberg",
    shortDesc: "Evalúa tu nivel de autoestima global con una escala validada internacionalmente.",
    fullDesc: "La Escala de Autoestima de Rosenberg es el instrumento más usado en el mundo para medir la valoración que una persona tiene de sí misma. Tiene 10 preguntas, algunas directas y algunas inversas.",
    items: rosenbergItems, calcResult: calcRosenberg,
  },
  {
    id: "bieps", icon: "🧠", color: "#4361ee", time: "~4 min · 13 preguntas",
    title: "¿Cómo está tu bienestar?",
    subtitle: "BIEPS-J · Bienestar Psicológico",
    shortDesc: "Mide tu bienestar emocional en 4 dimensiones: propósito, vínculos, control y aceptación.",
    fullDesc: "El BIEPS-J (Casullo) es un instrumento validado para adolescentes latinoamericanos. Evalúa qué tan bien te sientes contigo mismo/a, con tus relaciones y con tu capacidad de manejar el entorno.",
    items: biepsItems, calcResult: calcBIEPS,
  },
  {
    id: "vark", icon: "🎯", color: "#00f5d4", time: "~4 min · 8 preguntas",
    title: "¿Cómo aprendes mejor?",
    subtitle: "VARK · Estilos de Aprendizaje",
    shortDesc: "Identifica si aprendes mejor de forma visual, auditiva, leyendo/escribiendo o kinestésica.",
    fullDesc: "El modelo VARK (Fleming) identifica tu canal de aprendizaje preferido. Con esta información puedes adaptar tus técnicas de estudio para que sean más efectivas y disfrutar más del proceso.",
    items: varkItems, calcResult: calcVARK,
  },
  {
    id: "fortalezas", icon: "⚡", color: "#f72585", time: "~3 min · 12 preguntas",
    title: "¿Cuáles son tus fortalezas?",
    subtitle: "Inventario de Fortalezas · VIA",
    shortDesc: "Identifica tus 3 principales fortalezas de carácter entre 12 posibles.",
    fullDesc: "Inspirado en el inventario VIA (Peterson & Seligman), este cuestionario identifica tus fortalezas naturales — esas capacidades positivas que cuando usas te hacen sentir auténtico/a y comprometido/a.",
    items: fortItems, calcResult: calcFortalezas,
  },
  {
    id: "sel", icon: "💡", color: "#7fff00", time: "~5 min · 10 preguntas",
    title: "¿Cómo están tus habilidades SEL?",
    subtitle: "Autoevaluación Socioemocional · CASEL",
    shortDesc: "Evalúa tus habilidades socioemocionales en 5 dimensiones del marco CASEL.",
    fullDesc: "Basado en el marco CASEL (Collaborative for Academic, Social, and Emotional Learning), este cuestionario evalúa autoconsciencia, autorregulación, conciencia social, resolución de conflictos y comunicación.",
    items: selItems, calcResult: calcSEL,
  },
  {
    id: "sociometrico", icon: "👥", color: "#f72585", time: "~3 min · 5 preguntas", isSociometric: true,
    title: "Relaciones de Curso",
    subtitle: "Cuestionario Sociométrico",
    shortDesc: "Confidencial. Ayuda a la Prof. Camila a comprender las dinámicas del curso.",
    fullDesc: "Este instrumento es confidencial y solo lo verá la profesora. Sus datos permiten identificar líderes naturales, estudiantes que necesitan integración y el clima relacional del curso. Responde con honestidad.",
    items: sociItems, calcResult: calcSociometrico,
  },
  {
    id: "estres", icon: "🌊", color: "#ff9f1c", time: "~3 min · 8 preguntas",
    title: "¿Cómo manejas el estrés?",
    subtitle: "Estrategias de Afrontamiento",
    shortDesc: "Evalúa qué tan efectivas son tus estrategias para manejar la presión y el estrés escolar.",
    fullDesc: "Este cuestionario explora si usas estrategias saludables de afrontamiento: organización, apoyo social, autocuidado, descanso y regulación emocional. Útil para prevenir el agotamiento escolar.",
    items: estresItems, calcResult: calcEstres,
  },
];

// ──────────────────────────────────────────────────────────────
// COMPONENTE: REGISTRO DE ESTUDIANTE
// ──────────────────────────────────────────────────────────────
function StudentForm({ quiz, onStart }: { quiz: Quiz; onStart: (nombre: string, curso: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [curso, setCurso] = useState("");
  const cursos = ["1°A", "1°B", "1°C", "1°D", "1°E", "1°F", "2°A", "2°B", "2°C", "2°D", "2°E", "2°F", "2°G", "3°A", "3°B", "3°C", "4°A", "4°B", "4°C", "Electivo"];
  const ready = nombre.trim().length >= 3 && curso.length > 0;

  return (
    <div>
      <div className="text-5xl mb-4 text-center">{quiz.icon}</div>
      <p className="text-xs font-medium uppercase tracking-widest mb-1 text-center"
        style={{ color: quiz.color, fontFamily: "'JetBrains Mono', monospace" }}>
        {quiz.subtitle}
      </p>
      <h2 className="text-2xl font-black text-white mb-2 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {quiz.title}
      </h2>
      <p className="text-sm leading-relaxed mb-6 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        {quiz.fullDesc}
      </p>

      <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-xs font-semibold text-white mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          // registro previo
        </p>
        <div className="mb-3">
          <label className="text-xs text-white mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre y apellido"
            className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
            Curso
          </label>
          <select
            value={curso}
            onChange={e => setCurso(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
            style={{
              background: "rgba(13,27,42,0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <option value="">Selecciona tu curso</option>
            {cursos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="text-xs" style={{ color: quiz.color, fontFamily: "'JetBrains Mono', monospace" }}>⏱</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{quiz.time}</span>
        {quiz.isSociometric && (
          <>
            <span className="mx-1" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
            <span className="text-xs" style={{ color: "#f72585", fontFamily: "'JetBrains Mono', monospace" }}>🔒 Confidencial</span>
          </>
        )}
      </div>

      <button
        onClick={() => ready && onStart(nombre.trim(), curso)}
        disabled={!ready}
        className="w-full py-4 rounded-xl font-bold text-base transition-all"
        style={{
          background: ready ? `${quiz.color}18` : "rgba(255,255,255,0.04)",
          border: `1px solid ${ready ? quiz.color + "60" : "rgba(255,255,255,0.1)"}`,
          color: ready ? quiz.color : "rgba(255,255,255,0.3)",
          fontFamily: "'Space Grotesk', sans-serif",
          cursor: ready ? "pointer" : "not-allowed",
        }}
      >
        {ready ? "Comenzar →" : "Completa tu nombre y curso"}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE: ÍTEM SOCIOMÉTRICO (texto libre)
// ──────────────────────────────────────────────────────────────
function TextItem({ item, onAnswer }: { item: QuizItem; onAnswer: (val: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div>
      <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
        {item.id === 4 || item.id === 5 ? "Respuesta opcional" : "Responde con nombres completos"}
      </p>
      <h3 className="text-xl font-bold text-white mb-6 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {item.text}
      </h3>
      <textarea
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={(item.id === 4 || item.id === 5) ? "Opcional — puedes dejar en blanco" : "Escribe uno o más nombres..."}
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none mb-4"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      />
      <button
        onClick={() => onAnswer(val || "(sin respuesta)")}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
        style={{
          background: "rgba(247, 37, 133, 0.12)",
          border: "1px solid rgba(247, 37, 133, 0.4)",
          color: "#f72585",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {(item.id === 4 || item.id === 5) ? "Continuar →" : (val.trim() ? "Confirmar →" : "Omitir →")}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE: RUNNER PRINCIPAL DEL QUIZ
// ──────────────────────────────────────────────────────────────
function QuizRunner({ quiz, onBack }: { quiz: Quiz; onBack: () => void }) {
  const [phase, setPhase] = useState<"register" | "questions" | "result">("register");
  const [studentInfo, setStudentInfo] = useState({ nombre: "", curso: "" });
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, OptionValue>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error" | "local">("idle");

  const total = quiz.items.length;
  const progress = phase === "result" ? 100 : Math.round(((step - 1) / total) * 100);
  const currentItem = phase === "questions" ? quiz.items[step - 1] : null;

  const handleStart = useCallback((nombre: string, curso: string) => {
    setStudentInfo({ nombre, curso });
    setPhase("questions");
  }, []);

  const handleAnswer = useCallback((val: OptionValue) => {
    if (!currentItem) return;
    const newAnswers = { ...answers, [currentItem.id]: val };
    setAnswers(newAnswers);
    if (step < total) {
      setStep(s => s + 1);
    } else {
      const res = quiz.calcResult(newAnswers);
      setResult(res);
      setPhase("result");
      // Guardar localmente y enviar a Google Sheets
      const record: StudentRecord = {
        nombre: studentInfo.nombre,
        curso: studentInfo.curso,
        fecha: new Date().toLocaleDateString("es-CL"),
        quizId: quiz.id,
        quizTitle: quiz.title,
        resultado: res.title.replace(/[✅🔄🌱✓]/g, "").trim(),
        nivel: res.level || "info",
        detalles: res.csvSummary,
      };
      addToLocalCache(record);
      setSendStatus("sending");
      sendToSheets(record).then(({ ok, error }) => {
        if (error === "no_configured") setSendStatus("local");
        else setSendStatus(ok ? "sent" : "error");
      });
    }
  }, [currentItem, answers, step, total, quiz, studentInfo]);

  const reset = () => { setPhase("register"); setStep(1); setAnswers({}); setResult(null); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(5, 9, 20, 0.98)", backdropFilter: "blur(24px)" }}>
      <div className="w-full max-w-lg my-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={phase === "result" ? reset : onBack}
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
            style={{ color: "rgba(0, 245, 212, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
            <ChevronLeft size={14} />
            {phase === "result" ? "repetir" : "salir"}
          </button>
          {phase === "questions" && (
            <button onClick={onBack}
              className="p-1.5 rounded hover:opacity-70 transition-opacity"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Progress */}
        {phase !== "register" && (
          <div className="h-0.5 rounded-full mb-7 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: quiz.color }} />
          </div>
        )}

        {/* FASE 1: Registro */}
        {phase === "register" && (
          <StudentForm quiz={quiz} onStart={handleStart} />
        )}

        {/* FASE 2: Pregunta */}
        {phase === "questions" && currentItem && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs px-2 py-0.5 rounded"
                style={{ background: `${quiz.color}15`, color: quiz.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${quiz.color}25` }}>
                {step}/{total}
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>{studentInfo.nombre}</span>
            </div>

            {quiz.isSociometric ? (
              <TextItem item={currentItem} onAnswer={handleAnswer} />
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-7 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {currentItem.text}
                  {currentItem.reversed && (
                    <span className="block text-xs mt-2 font-normal" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>
                      ↩ ítem inverso
                    </span>
                  )}
                </h3>
                <div className="flex flex-col gap-3">
                  {currentItem.options.map((opt, idx) => (
                    <button key={String(opt.value)} onClick={() => handleAnswer(opt.value)}
                      className="px-5 py-4 rounded-xl text-left text-sm font-medium transition-all"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.8)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget;
                        el.style.background = `${quiz.color}12`;
                        el.style.borderColor = `${quiz.color}45`;
                        el.style.color = "#fff";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget;
                        el.style.background = "rgba(255,255,255,0.03)";
                        el.style.borderColor = "rgba(255,255,255,0.08)";
                        el.style.color = "rgba(255,255,255,0.8)";
                      }}>
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{ background: `${quiz.color}12`, color: quiz.color }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="mt-5 flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                    style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>
                    <ChevronLeft size={12} /> anterior
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* FASE 3: Resultado */}
        {phase === "result" && result && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} style={{ color: result.color }} />
              <span className="text-xs" style={{ color: result.color, fontFamily: "'JetBrains Mono', monospace" }}>
                // resultado · {studentInfo.nombre}
              </span>
            </div>

            <h2 className="text-2xl font-black mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: result.color }}>
              {result.title}
            </h2>

            <div className="p-4 rounded-xl mb-4 text-sm leading-relaxed"
              style={{ background: `${result.color}08`, border: `1px solid ${result.color}20`, color: "rgba(255,255,255,0.75)" }}>
              {result.desc.replace(/\*\*(.*?)\*\*/g, "$1")}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {result.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-xs"
                  style={{ background: `${result.color}10`, border: `1px solid ${result.color}25`, color: result.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {tag}
                </span>
              ))}
            </div>

            {result.extra && result.extra.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-5">
                {result.extra.map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Estado envío a Google Sheets */}
            <div className="p-3 rounded-lg mb-5 flex items-center gap-2 transition-all"
              style={{
                background: sendStatus === "sent" ? "rgba(127, 255, 0, 0.06)"
                  : sendStatus === "sending" ? "rgba(0, 245, 212, 0.06)"
                  : sendStatus === "error" ? "rgba(247, 37, 133, 0.06)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${sendStatus === "sent" ? "rgba(127, 255, 0, 0.2)"
                  : sendStatus === "sending" ? "rgba(0, 245, 212, 0.2)"
                  : sendStatus === "error" ? "rgba(247, 37, 133, 0.2)"
                  : "rgba(255,255,255,0.08)"}`,
              }}>
              {sendStatus === "sending" && <Loader2 size={12} className="animate-spin" style={{ color: "#00f5d4", flexShrink: 0 }} />}
              {sendStatus === "sent" && <Wifi size={12} style={{ color: "#7fff00", flexShrink: 0 }} />}
              {sendStatus === "error" && <WifiOff size={12} style={{ color: "#f72585", flexShrink: 0 }} />}
              {(sendStatus === "local" || sendStatus === "idle") && <Database size={12} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />}
              <p className="text-xs" style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: sendStatus === "sent" ? "rgba(127, 255, 0, 0.7)"
                  : sendStatus === "sending" ? "rgba(0, 245, 212, 0.6)"
                  : sendStatus === "error" ? "rgba(247, 37, 133, 0.7)"
                  : "rgba(255,255,255,0.3)",
              }}>
                {sendStatus === "sending" && "Enviando a Google Sheets..."}
                {sendStatus === "sent" && "✓ Guardado en Google Sheets de la Prof. Camila"}
                {sendStatus === "error" && "Sin conexión — guardado solo localmente"}
                {sendStatus === "local" && "Guardado localmente (configurar Google Sheets)"}
                {sendStatus === "idle" && "Procesando..."}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>
                <RotateCcw size={13} /> Repetir
              </button>
              <button onClick={onBack}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: `${result.color}15`, border: `1px solid ${result.color}40`, color: result.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                Volver →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// PANEL DE DATOS (para la profe)
// ──────────────────────────────────────────────────────────────
function DataPanel({ onClose, recordCount }: { onClose: () => void; recordCount: number }) {
  const byQuiz = quizzes.map(q => ({
    ...q,
    records: sessionRecords.filter(r => r.quizId === q.id),
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5, 9, 20, 0.97)", backdropFilter: "blur(20px)" }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // panel docente
            </p>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Datos de la Sesión
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:opacity-70 transition-opacity"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl flex-1 text-center"
            style={{ background: "rgba(0, 245, 212, 0.08)", border: "1px solid rgba(0, 245, 212, 0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>{recordCount}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>respuestas guardadas</p>
          </div>
          <div className="p-3 rounded-xl flex-1 text-center"
            style={{ background: "rgba(0, 245, 212, 0.08)", border: "1px solid rgba(0, 245, 212, 0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>
              {new Set(sessionRecords.map(r => r.nombre)).size}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>estudiantes únicos</p>
          </div>
          <button onClick={exportCSV}
            className="p-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
            style={{ background: "rgba(0, 245, 212, 0.12)", border: "1px solid rgba(0, 245, 212, 0.35)", color: "#00f5d4", fontFamily: "'Space Grotesk', sans-serif" }}>
            <Download size={16} /> Exportar CSV
          </button>
        </div>

        {recordCount === 0 ? (
          <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.3)" }}>
            <AlertCircle size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aún no hay respuestas en esta sesión.</p>
            <p className="text-xs mt-1">Los datos se acumulan mientras la página esté abierta.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {byQuiz.filter(q => q.records.length > 0).map(q => (
              <div key={q.id} className="cyber-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{q.icon}</span>
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{q.title}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded"
                    style={{ background: `${q.color}15`, color: q.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {q.records.length} resp.
                  </span>
                </div>
                <div className="space-y-1.5">
                  {q.records.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      <span className="text-xs font-medium text-white" style={{ minWidth: "120px" }}>{r.nombre}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {r.curso}
                      </span>
                      <span className="text-xs ml-auto"
                        style={{
                          color: r.nivel === "alto" ? "#7fff00" : r.nivel === "medio" ? "#ffd60a" : r.nivel === "bajo" ? "#4361ee" : "rgba(255,255,255,0.5)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                        {r.resultado.length > 30 ? r.resultado.slice(0, 28) + "…" : r.resultado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Config status */}
        <div className="mt-6 p-3 rounded-xl flex items-center gap-3"
          style={{
            background: isConfigured() ? "rgba(127, 255, 0, 0.06)" : "rgba(255, 214, 10, 0.06)",
            border: `1px solid ${isConfigured() ? "rgba(127, 255, 0, 0.2)" : "rgba(255, 214, 10, 0.2)"}`,
          }}>
          {isConfigured()
            ? <Wifi size={14} style={{ color: "#7fff00", flexShrink: 0 }} />
            : <WifiOff size={14} style={{ color: "#ffd60a", flexShrink: 0 }} />}
          <p className="text-xs" style={{
            color: isConfigured() ? "rgba(127, 255, 0, 0.7)" : "rgba(255, 214, 10, 0.7)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {isConfigured()
              ? "Google Sheets configurado — datos enviados en tiempo real"
              : "Google Sheets no configurado — solo datos locales (exportar CSV antes de cerrar)"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL EXPORTADO
// ──────────────────────────────────────────────────────────────
export default function QuizOrientacion() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [showData, setShowData] = useState(false);
  const [recordCount, setRecordCount] = useState(0);

  // Actualiza el contador cada vez que se cierra un quiz
  const handleClose = () => {
    setActiveQuiz(null);
    setRecordCount(sessionRecords.length);
  };

  return (
    <section className="py-16">
      <div className="container">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-2"
              style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // instrumentos de autoconocimiento
            </p>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cuestionarios Interactivos
            </h2>
            <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.45)" }}>
              Herramientas para que te conozcas mejor. Responde con honestidad — no hay respuestas correctas ni incorrectas. Tus datos quedan guardados para que la Prof. Camila pueda apoyarte mejor.
            </p>
          </div>

          {/* Botón panel docente */}
          <button onClick={() => setShowData(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
            style={{
              background: recordCount > 0 ? "rgba(0, 245, 212, 0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${recordCount > 0 ? "rgba(0, 245, 212, 0.3)" : "rgba(255,255,255,0.1)"}`,
              color: recordCount > 0 ? "#00f5d4" : "rgba(255,255,255,0.3)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
            <Database size={14} />
            Panel docente
            {recordCount > 0 && (
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center"
                style={{ background: "#00f5d4", color: "#050914", fontWeight: "bold" }}>
                {recordCount}
              </span>
            )}
          </button>
        </div>

        {/* Grid de cuestionarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quizzes.map((quiz) => (
            <button key={quiz.id} onClick={() => setActiveQuiz(quiz)}
              className="cyber-card rounded-xl p-5 text-left group relative overflow-hidden"
              style={{ cursor: "pointer" }}>

              {/* Glow de fondo al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${quiz.color}08 0%, transparent 70%)` }} />

              <div className="relative">
                <span className="text-2xl block mb-3">{quiz.icon}</span>
                <p className="text-xs mb-1" style={{ color: quiz.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {quiz.subtitle}
                </p>
                <h3 className="font-bold text-white text-sm leading-snug mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {quiz.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {quiz.shortDesc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {quiz.time}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold transition-all duration-200 group-hover:gap-1.5"
                    style={{ color: quiz.color }}>
                    Iniciar <ChevronRight size={11} />
                  </span>
                </div>
              </div>

              {/* Línea inferior de color */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, transparent, ${quiz.color}, transparent)` }} />
            </button>
          ))}
        </div>

        {/* Aviso pie de página */}
        <div className="flex items-start gap-2 mt-8 p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <AlertCircle size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: "1px" }} />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", lineHeight: "1.5" }}>
            Estos cuestionarios son orientativos, no diagnósticos clínicos. Para orientación más profunda, conversa con la Prof. Camila o con el equipo de orientación del liceo. Los datos se almacenan solo en la sesión actual del navegador.
          </p>
        </div>
      </div>

      {/* Modales */}
      {activeQuiz && <QuizRunner quiz={activeQuiz} onBack={handleClose} />}
      {showData && <DataPanel onClose={() => setShowData(false)} recordCount={recordCount} />}
    </section>
  );
}
