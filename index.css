/* ============================================================
   DESIGN SYSTEM — Cyberpunk Académico
   Liceo O'Higgins · La Matriz
   
   Philosophy: Dark deep-space background with neon cyan/magenta
   accents. Space Grotesk for display, JetBrains Mono for data.
   Glow effects on interactive elements. Particle-like details.
   ============================================================ */

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  
  /* Custom cyberpunk tokens */
  --color-neon-cyan: #00f5d4;
  --color-neon-magenta: #f72585;
  --color-neon-blue: #4361ee;
  --color-neon-yellow: #ffd60a;
  --color-deep-space: #050914;
  --color-space-card: #0d1b2a;
  --color-space-border: rgba(0, 245, 212, 0.15);
}

:root {
  --radius: 0.5rem;
  --background: oklch(0.06 0.02 240);
  --foreground: oklch(0.95 0.01 200);
  --card: oklch(0.1 0.025 240);
  --card-foreground: oklch(0.95 0.01 200);
  --popover: oklch(0.1 0.025 240);
  --popover-foreground: oklch(0.95 0.01 200);
  --primary: oklch(0.85 0.18 175);
  --primary-foreground: oklch(0.06 0.02 240);
  --secondary: oklch(0.14 0.03 240);
  --secondary-foreground: oklch(0.85 0.18 175);
  --muted: oklch(0.14 0.02 240);
  --muted-foreground: oklch(0.6 0.05 220);
  --accent: oklch(0.55 0.28 330);
  --accent-foreground: oklch(0.98 0.01 0);
  --destructive: oklch(0.65 0.25 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.85 0.18 175 / 0.15);
  --input: oklch(0.14 0.03 240);
  --ring: oklch(0.85 0.18 175 / 0.5);
  --chart-1: oklch(0.85 0.18 175);
  --chart-2: oklch(0.55 0.28 330);
  --chart-3: oklch(0.65 0.2 260);
  --chart-4: oklch(0.85 0.2 80);
  --chart-5: oklch(0.7 0.22 200);
  --sidebar: oklch(0.08 0.02 240);
  --sidebar-foreground: oklch(0.95 0.01 200);
  --sidebar-primary: oklch(0.85 0.18 175);
  --sidebar-primary-foreground: oklch(0.06 0.02 240);
  --sidebar-accent: oklch(0.14 0.03 240);
  --sidebar-accent-foreground: oklch(0.85 0.18 175);
  --sidebar-border: oklch(0.85 0.18 175 / 0.1);
  --sidebar-ring: oklch(0.85 0.18 175 / 0.5);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Space Grotesk', sans-serif;
    background-color: #050914;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
  }
  .font-mono, code, .mono {
    font-family: 'JetBrains Mono', monospace;
  }
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]),
  [type="button"]:not(:disabled),
  [type="submit"]:not(:disabled),
  a[href],
  select:not(:disabled) {
    @apply cursor-pointer;
  }
}

@layer components {
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .flex {
    min-height: 0;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .container {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding-left: 2rem;
      padding-right: 2rem;
      max-width: 1280px;
    }
  }

  /* Neon glow utilities */
  .glow-cyan {
    box-shadow: 0 0 20px rgba(0, 245, 212, 0.3), 0 0 40px rgba(0, 245, 212, 0.1);
  }
  .glow-magenta {
    box-shadow: 0 0 20px rgba(247, 37, 133, 0.3), 0 0 40px rgba(247, 37, 133, 0.1);
  }
  .text-glow-cyan {
    text-shadow: 0 0 20px rgba(0, 245, 212, 0.8), 0 0 40px rgba(0, 245, 212, 0.4);
  }
  .text-glow-magenta {
    text-shadow: 0 0 20px rgba(247, 37, 133, 0.8), 0 0 40px rgba(247, 37, 133, 0.4);
  }
  
  /* Cyberpunk card */
  .cyber-card {
    background: rgba(13, 27, 42, 0.8);
    border: 1px solid rgba(0, 245, 212, 0.15);
    backdrop-filter: blur(12px);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .cyber-card:hover {
    border-color: rgba(0, 245, 212, 0.4);
    box-shadow: 0 0 30px rgba(0, 245, 212, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4);
    transform: translateY(-4px);
  }
  
  /* Scanline overlay */
  .scanlines::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Neon button */
  .btn-neon-cyan {
    background: transparent;
    border: 1px solid #00f5d4;
    color: #00f5d4;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .btn-neon-cyan:hover {
    background: rgba(0, 245, 212, 0.1);
    box-shadow: 0 0 20px rgba(0, 245, 212, 0.4);
  }
  .btn-neon-cyan:active {
    transform: scale(0.97);
  }

  .btn-neon-magenta {
    background: transparent;
    border: 1px solid #f72585;
    color: #f72585;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .btn-neon-magenta:hover {
    background: rgba(247, 37, 133, 0.1);
    box-shadow: 0 0 20px rgba(247, 37, 133, 0.4);
  }
  .btn-neon-magenta:active {
    transform: scale(0.97);
  }

  /* Gradient text */
  .gradient-text-cyan {
    background: linear-gradient(135deg, #00f5d4, #4361ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .gradient-text-magenta {
    background: linear-gradient(135deg, #f72585, #7209b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

/* Animations */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes scanline-move {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bar-grow {
  from { width: 0; }
}

.animate-slide-up {
  animation: slide-up 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out both;
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Stagger delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
.delay-700 { animation-delay: 700ms; }
.delay-800 { animation-delay: 800ms; }

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #050914;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 245, 212, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 245, 212, 0.6);
}

/* Range input styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-runnable-track {
  background: rgba(0, 245, 212, 0.2);
  height: 6px;
  border-radius: 3px;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00f5d4;
  margin-top: -7px;
  box-shadow: 0 0 10px rgba(0, 245, 212, 0.6);
  transition: all 0.2s ease;
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 16px rgba(0, 245, 212, 0.9);
}
input[type="range"]::-moz-range-track {
  background: rgba(0, 245, 212, 0.2);
  height: 6px;
  border-radius: 3px;
}
input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00f5d4;
  border: none;
  box-shadow: 0 0 10px rgba(0, 245, 212, 0.6);
}

/* ── Accesibilidad y UX ── */
html {
  scroll-behavior: smooth;
}

/* Focus ring visible para teclado */
*:focus-visible {
  outline: 2px solid #00f5d4;
  outline-offset: 2px;
}

/* Selección de texto con color de marca */
::selection {
  background: rgba(0, 245, 212, 0.25);
  color: #fff;
}

/* Scrollbar personalizada (Webkit) */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #050914;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 245, 212, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 245, 212, 0.5);
}

/* Reducir movimiento si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  .animate-slide-up,
  .animate-fade-in,
  .animate-float,
  .animate-pulse-glow {
    animation: none !important;
  }
  * {
    transition-duration: 0.01ms !important;
  }
}

/* Print básico */
@media print {
  nav, footer, .btn-neon-cyan, .btn-neon-magenta {
    display: none !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
}
