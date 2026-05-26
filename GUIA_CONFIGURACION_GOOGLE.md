# 🔧 Guía de Configuración — Google Sheets + La Matriz

**Prof. Camila Tapia Cisternas · Liceo O'Higgins**

Esta guía te explica cómo conectar el portal de cuestionarios con tu Google Drive del liceo, para que cada estudiante que responda desde su celular envíe sus datos directamente a tu planilla.

---

## ¿Cómo funciona?

```
Celular estudiante → Portal La Matriz → Apps Script → Google Sheet (tu Drive)
```

El "Apps Script" es un pequeño programa que vive dentro de tu Google Sheet y actúa como intermediario. No necesitas saber programar — solo copiar y pegar.

---

## PASO 1 — Crear la Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com) con tu cuenta del **liceo**
2. Clic en **+ En blanco** para crear una nueva hoja
3. Nómbrala algo como: `La Matriz — Cuestionarios Orientación 2025`
4. Deja la primera pestaña como está (se configurará automáticamente)

---

## PASO 2 — Abrir el editor de Apps Script

1. Con la planilla abierta, haz clic en el menú **Extensiones**
2. Selecciona **Apps Script**
3. Se abrirá una nueva pestaña con el editor de código

---

## PASO 3 — Pegar el script

1. En el editor verás un archivo llamado `Código.gs` con algo como:
   ```
   function myFunction() {
   }
   ```
2. **Selecciona todo** ese contenido y **bórralo**
3. Abre el archivo `APPS_SCRIPT.gs` que viene junto a esta guía
4. **Copia todo** su contenido y **pégalo** en el editor
5. Haz clic en el ícono 💾 (guardar) o presiona **Ctrl+S**
6. Nómbralo algo como `LaMatriz_Cuestionarios` si te pide nombre

---

## PASO 4 — Publicar como Aplicación Web

1. Haz clic en el botón azul **"Implementar"** (arriba a la derecha)
2. Selecciona **"Nueva implementación"**
3. Haz clic en el ícono de engranaje ⚙️ junto a "Seleccionar tipo" y elige **Aplicación web**
4. Completa así:
   - **Descripción:** `La Matriz v1`
   - **Ejecutar como:** `Yo (tu-correo@liceo.cl)`
   - **Quién tiene acceso:** `Cualquier persona`
5. Haz clic en **"Implementar"**
6. Si pide autorización:
   - Clic en **"Autorizar acceso"**
   - Selecciona tu cuenta del liceo
   - Si aparece "Esta app no está verificada", haz clic en **"Opciones avanzadas"** → **"Ir a LaMatriz_Cuestionarios"**
   - Haz clic en **"Permitir"**
7. Se mostrará una **URL** que empieza con:
   ```
   https://script.google.com/macros/s/...../exec
   ```
8. **Copia esa URL completa** — la necesitas en el siguiente paso

---

## PASO 5 — Conectar el portal

1. Abre el archivo:
   ```
   client/src/components/QuizOrientacion.tsx
   ```
2. Busca esta línea cerca del principio (línea ~25):
   ```typescript
   const APPS_SCRIPT_URL = "PEGA_TU_URL_AQUI";
   ```
3. Reemplaza `"PEGA_TU_URL_AQUI"` con la URL que copiaste:
   ```typescript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/TU_ID/exec";
   ```
4. Guarda el archivo
5. Si el portal está desplegado, vuelve a hacer el deploy

---

## PASO 6 — Probar

1. Abre el portal en tu celular o computador
2. Ve a Orientación → elige cualquier cuestionario
3. Completa nombre, curso y responde todas las preguntas
4. En el resultado, fíjate en el indicador de estado:
   - 🔄 **"Enviando a Google Sheets..."** — está enviando
   - ✅ **"Guardado en Google Sheets de la Prof. Camila"** — éxito
   - ❌ **"Sin conexión — guardado solo localmente"** — error

5. Ve a tu Google Sheet — deberían aparecer nuevas pestañas automáticamente:
   - 📊 Resumen (todas las respuestas)
   - 🧭 Holland RIASEC
   - 🪞 Autoestima
   - (y una por cada cuestionario respondido)

---

## Estructura de la planilla

Cada cuestionario tiene su propia pestaña. La pestaña **📊 Resumen** consolida todo:

| Fecha | Hora | Nombre | Curso | Cuestionario | Resultado | Nivel | Detalles |
|-------|------|--------|-------|--------------|-----------|-------|----------|
| 26/05/2025 | 10:32 | Ana García | 2°C | ¿Cómo está tu autoestima? | Autoestima Media (25/40) | medio | Puntaje=25/40\|... |
| 26/05/2025 | 10:35 | Luis Pérez | 2°C | ¿Técnico o Humanista? | Perfil 🔬 Investigador | info | Perfil=Investigador\|Código=IRS\|... |

La columna **Nivel** está coloreada automáticamente:
- 🟢 Verde → alto
- 🟡 Amarillo → medio  
- 🔵 Azul → bajo
- 🩵 Cyan → info (vocacional, estilos, fortalezas)

---

## ⚠️ Puntos importantes

### ¿Los datos del sociométrico son realmente privados?
Sí. El sociométrico envía los nombres que el estudiante escribió, pero en la hoja aparece en la columna "Detalles" como texto plano. Solo tú (dueña del Sheet) tienes acceso.

### ¿Qué pasa si un estudiante responde dos veces el mismo cuestionario?
Cada envío crea una nueva fila. Podrás ver ambas respuestas con la marca de tiempo.

### ¿Funciona sin internet?
No. El envío a Google Sheets requiere conexión. Si el celular no tiene wifi, el resultado igual se muestra al estudiante, pero aparece el mensaje "Sin conexión — guardado solo localmente" y los datos no llegan al Sheet.
Solución: asegúrate de que los celulares tengan wifi o datos en el momento del cuestionario.

### ¿Puedo usar la exportación CSV además de Google Sheets?
Sí. El botón "Exportar CSV" en el Panel Docente sigue funcionando y descarga todos los datos de la sesión actual, aunque ya estén en el Sheet. Útil como respaldo.

### ¿Cada cuánto se actualiza el Sheet?
Instantáneamente al terminar cada cuestionario. No hay que esperar.

---

## Si algo no funciona

**Error "No autorizado":** repite el Paso 4 asegurándote de elegir "Cualquier persona" en acceso.

**El Sheet no recibe datos:** verifica que la URL en `QuizOrientacion.tsx` esté exactamente igual a la que copiaste, sin espacios extra.

**Aparece "sin conexión" en todos los celulares:** puede ser un problema de CORS. Verifica en Apps Script → Ejecuciones si hay errores registrados.

**Necesitas actualizar el script:** si modificas `APPS_SCRIPT.gs`, debes hacer **"Nueva implementación"** (no "Administrar implementaciones existentes") — de lo contrario los cambios no se aplican.

---

## Contacto

Preparado para el portal **La Matriz · Liceo Emblemático Bernardo O'Higgins · Iquique**  
Prof. Camila Tapia Cisternas · Departamento de Ciencias y Tecnología
