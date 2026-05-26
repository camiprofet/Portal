/* ============================================================
   Movimiento y Fuerzas — Cinemática Interactiva
   ============================================================ */
import { useState } from "react";
import { Rocket } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { MovementVisualizerAdvanced } from "@/components/MovementVisualizerAdvanced";

const conceptos = [
  {
    titulo: "Posición y Desplazamiento",
    contenido: "La posición indica dónde está un objeto. El desplazamiento es el cambio de posición: Δx = xf − xi. Es una magnitud vectorial (tiene módulo y dirección).",
    formula: "Δx = xf − xi",
    color: "#00f5d4",
  },
  {
    titulo: "Velocidad Media",
    contenido: "Relación entre el desplazamiento y el tiempo transcurrido. La velocidad instantánea es la velocidad en un instante específico.",
    formula: "v = Δx / Δt",
    color: "#4361ee",
  },
  {
    titulo: "Aceleración",
    contenido: "Razón de cambio de la velocidad respecto al tiempo. Si la aceleración es constante, el movimiento es uniformemente acelerado (MRUA).",
    formula: "a = Δv / Δt",
    color: "#f72585",
  },
  {
    titulo: "Ecuaciones del MRUA",
    contenido: "Para movimiento uniformemente acelerado con condiciones iniciales x₀ y v₀:",
    formula: "x = x₀ + v₀·t + ½·a·t²   |   v = v₀ + a·t   |   v² = v₀² + 2a·Δx",
    color: "#ffd60a",
  },
];

export default function FisicaMovimiento() {
  const [velocity, setVelocity] = useState(20);
  const [acceleration, setAcceleration] = useState(2);
  const [isRunning, setIsRunning] = useState(false);

  const currentCurrent = velocity + acceleration; // simplified display

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      <section className="py-16">
        <div className="container">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { href: "/fisica", label: "Física" },
              { label: "Movimiento y Fuerzas" },
            ]}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0, 245, 212, 0.1)", border: "1px solid rgba(0, 245, 212, 0.3)" }}>
              <Rocket size={24} style={{ color: "#00f5d4" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                // movimiento y fuerzas
              </p>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Cinemática Interactiva
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualizador */}
            <div className="lg:col-span-2">
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Visualización del Movimiento
                </h3>
                <MovementVisualizerAdvanced
                  initialVelocity={velocity}
                  acceleration={acceleration}
                  isRunning={isRunning}
                />
              </div>

              {/* Fórmulas */}
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Ecuación de Movimiento
                </h3>
                <div className="p-4 rounded-lg mb-3" style={{ background: "rgba(0, 245, 212, 0.05)", border: "1px solid rgba(0, 245, 212, 0.15)" }}>
                  <p className="text-base mb-1" style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>
                    x = x₀ + v₀·t + ½·a·t²
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                    v = v₀ + a·t
                  </p>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  x: posición final (m) · v₀: velocidad inicial (m/s) · a: aceleración (m/s²) · t: tiempo (s)
                </p>
              </div>

              {/* Con los valores actuales */}
              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Valores Actuales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Velocidad inicial", value: `${velocity.toFixed(1)} m/s`, color: "#00f5d4" },
                    { label: "Aceleración", value: `${acceleration.toFixed(1)} m/s²`, color: "#f72585" },
                    { label: "v en t=5s", value: `${(velocity + acceleration * 5).toFixed(1)} m/s`, color: "#4361ee" },
                    { label: "x en t=5s", value: `${(velocity * 5 + 0.5 * acceleration * 25).toFixed(1)} m`, color: "#ffd60a" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
                      <p className="text-lg font-bold" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="lg:col-span-1">
              <div className="cyber-card rounded-xl p-6 sticky top-20 mb-6">
                <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Parámetros
                </h3>

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-2 block">
                    Velocidad Inicial: <span style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>{velocity.toFixed(1)} m/s</span>
                  </label>
                  <Slider
                    value={[velocity]}
                    onValueChange={(v) => { setVelocity(v[0]); setIsRunning(false); }}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>-50</span><span>0</span><span>50</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-2 block">
                    Aceleración: <span style={{ color: "#f72585", fontFamily: "'JetBrains Mono', monospace" }}>{acceleration.toFixed(1)} m/s²</span>
                  </label>
                  <Slider
                    value={[acceleration]}
                    onValueChange={(a) => { setAcceleration(a[0]); setIsRunning(false); }}
                    min={-10}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>-10</span><span>0</span><span>+10</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: isRunning ? "rgba(247, 37, 133, 0.15)" : "rgba(0, 245, 212, 0.15)",
                    border: `1px solid ${isRunning ? "rgba(247, 37, 133, 0.4)" : "rgba(0, 245, 212, 0.4)"}`,
                    color: isRunning ? "#f72585" : "#00f5d4",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {isRunning ? "⏹ Detener" : "▶ Iniciar"}
                </button>

                <div className="mt-4 p-4 rounded-lg" style={{ background: "rgba(0, 245, 212, 0.05)", border: "1px solid rgba(0, 245, 212, 0.1)" }}>
                  <p className="text-xs font-medium text-white mb-2">💡 Experimenta:</p>
                  <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <li>• v₀ positiva + a positiva → acelera</li>
                    <li>• v₀ positiva + a negativa → frena</li>
                    <li>• v₀ = 0 + a positiva → caída libre</li>
                    <li>• a = 0 → movimiento uniforme (MRU)</li>
                  </ul>
                </div>
              </div>

              {/* Leyes de Newton */}
              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Leyes de Newton
                </h3>
                <div className="space-y-3">
                  {[
                    { n: "1ª", nombre: "Inercia", desc: "Un cuerpo en reposo o MRU permanece así salvo que actúe una fuerza neta." },
                    { n: "2ª", nombre: "F = m·a", desc: "La fuerza neta es proporcional a la masa y la aceleración producida." },
                    { n: "3ª", nombre: "Acción/Reacción", desc: "Por cada acción existe una reacción igual y de sentido contrario." },
                  ].map((ley) => (
                    <div key={ley.n} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-xs font-bold mb-0.5" style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>
                        {ley.n} Ley · {ley.nombre}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{ley.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conceptos clave */}
          <div className="mt-16">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // conceptos esenciales
            </p>
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Fundamentos de Cinemática
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conceptos.map((c) => (
                <div key={c.titulo} className="cyber-card rounded-xl p-6">
                  <h4 className="font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.color }}>
                    {c.titulo}
                  </h4>
                  <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>{c.contenido}</p>
                  <div className="p-2 rounded text-xs" style={{ background: `${c.color}10`, color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {c.formula}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
