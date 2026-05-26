# Ideas de Diseño — La Matriz · Liceo O'Higgins

<response>
<probability>0.07</probability>
<idea>
**Design Movement:** Cyberpunk Académico — estética de terminal futurista con toques de neón sobre fondo oscuro profundo.

**Core Principles:**
1. Contraste extremo: fondos casi negros con acentos neón (cian, verde lima, magenta)
2. Tipografía monoespaciada para datos/código + sans-serif bold para títulos
3. Bordes con glow pulsante, scanlines sutiles en fondos
4. Partículas animadas flotando en el hero

**Color Philosophy:** Fondo `#0a0a14` (azul-negro), primario `#00f5d4` (cian neón), acento `#f72585` (magenta), éxito `#7fff00`. Evoca laboratorio de física y tecnología de punta.

**Layout Paradigm:** Asimétrico con panel lateral izquierdo fijo de navegación tipo "terminal", contenido principal a la derecha con scroll. Cards con bordes brillantes.

**Signature Elements:**
1. Líneas de escaneo horizontales sutiles en el fondo del hero
2. Texto que "se escribe" solo (typewriter effect) en el subtítulo
3. Barras de progreso con glow animado para la escala de decibeles

**Interaction Philosophy:** Todo responde con micro-animaciones de "glitch" al hover. Los botones tienen efecto de presión con partículas.

**Animation:** Entrada de elementos con slide-in desde abajo + fade (200ms ease-out). Partículas flotantes en el hero. Efecto typewriter en el subtítulo.

**Typography System:** `Space Grotesk` (títulos, bold 700) + `JetBrains Mono` (datos, valores numéricos). Jerarquía marcada por tamaño y color neón.
</idea>
</response>

<response>
<probability>0.06</probability>
<idea>
**Design Movement:** Brutalismo Educativo — diseño crudo, honesto, con tipografía oversized y colores primarios saturados.

**Core Principles:**
1. Tipografía como elemento visual dominante (titulares enormes)
2. Colores primarios puros sin suavizar: amarillo, rojo, azul cobalto
3. Bordes gruesos negros, sombras offset (box-shadow desplazado)
4. Asimetría intencional, sin padding excesivo

**Color Philosophy:** Fondo blanco crudo `#f5f0e8`, texto negro `#111`, acento amarillo `#FFD600`, rojo `#FF2D00`, azul `#0057FF`. Energía y urgencia visual.

**Layout Paradigm:** Grid roto con elementos que se superponen. Cards con bordes negros gruesos y sombra offset. Navegación horizontal con fondo amarillo.

**Signature Elements:**
1. Números enormes como decoración de fondo (ej: "01", "02" en los temas)
2. Stickers/badges con rotación leve en las tarjetas
3. Líneas divisorias gruesas negras entre secciones

**Interaction Philosophy:** Hover levanta las cards (translateY -4px) con sombra más pronunciada. Botones con efecto de "sello".

**Animation:** Entrada escalonada de cards (stagger 60ms). Hover en cards: translateY(-6px) + sombra más grande, 150ms ease-out.

**Typography System:** `Bebas Neue` (títulos display) + `DM Sans` (cuerpo, 400/600). Contraste extremo de tamaños.
</idea>
</response>

<response>
<probability>0.08</probability>
<idea>
**Design Movement:** Neomorfismo Vibrante — superficies suaves con profundidad táctil y paleta de colores energéticos para adolescentes.

**Core Principles:**
1. Fondo oscuro azul-marino profundo con cards elevadas con glow de color
2. Gradientes vibrantes en acentos: naranja→rosa, cian→verde
3. Tipografía bold y redonda, amigable pero moderna
4. Iconografía grande y expresiva

**Color Philosophy:** Fondo `#0f172a` (slate-900), cards `#1e293b`, primario gradiente `from-cyan-400 to-blue-500`, acento `from-orange-400 to-pink-500`. Energía juvenil con sofisticación.

**Layout Paradigm:** Grid asimétrico con hero de pantalla completa, cards flotantes con glassmorphism, secciones con fondo alternado.

**Signature Elements:**
1. Glassmorphism en cards: `backdrop-blur` + borde semitransparente
2. Gradientes de texto en los títulos principales
3. Indicadores de "nivel" o "energía" animados para los temas

**Interaction Philosophy:** Cards con hover que intensifica el glow. Sliders con thumb personalizado brillante. Transiciones fluidas entre secciones.

**Animation:** Hero con partículas o gradiente animado. Cards entran con scale(0.95)→1 + opacity. Osciloscopio con canvas animado.

**Typography System:** `Outfit` (títulos, 700-900) + `Inter` (cuerpo, 400/500). Gradientes de texto en h1/h2.
</idea>
</response>

---

## Decisión Final

**Elegido: Cyberpunk Académico** — La combinación de fondo oscuro profundo con acentos neón cian/magenta crea una atmósfera de laboratorio futurista que conecta perfectamente con adolescentes. La tipografía `Space Grotesk` da modernidad sin perder legibilidad, y los efectos de glow en la escala de decibeles y el osciloscopio refuerzan el contenido de Física de manera visualmente impactante.
