/* ============================================================
   Electricidad — Circuitos Interactivos
   ============================================================ */
import { useState } from "react";
import { Link } from "wouter";
import { Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { CircuitVisualizer } from "@/components/CircuitVisualizer";

const conceptos = [
  {
    titulo: "Carga Eléctrica (q)",
    formula: "q [C] — Coulombs",
    desc: "Propiedad fundamental de la materia. Puede ser positiva (protones) o negativa (electrones). Cargas iguales se repelen; opuestas se atraen.",
    color: "#f72585",
  },
  {
    titulo: "Corriente Eléctrica (I)",
    formula: "I = q / t   [A — Amperes]",
    desc: "Flujo de carga eléctrica por unidad de tiempo. En un conductor metálico son los electrones libres los que se desplazan.",
    color: "#00f5d4",
  },
  {
    titulo: "Voltaje o Tensión (V)",
    formula: "V [V — Volts]",
    desc: "Diferencia de potencial eléctrico entre dos puntos. Es la 'fuerza' que impulsa la corriente. Generado por baterías, fuentes de alimentación.",
    color: "#ffd60a",
  },
  {
    titulo: "Resistencia (R)",
    formula: "R [Ω — Ohms]",
    desc: "Oposición al flujo de corriente. Depende del material, la longitud y la sección transversal del conductor. ρ es la resistividad del material.",
    color: "#4361ee",
  },
];

export default function FisicaElectricidad() {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);
  const [isActive, setIsActive] = useState(false);

  const current = voltage / (resistance || 0.1);
  const power = voltage * current;

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      <section className="py-16">
        <div className="container">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { href: "/fisica", label: "Física" },
              { label: "Electricidad" },
            ]}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(247, 37, 133, 0.1)", border: "1px solid rgba(247, 37, 133, 0.3)" }}>
              <Zap size={24} style={{ color: "#f72585" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                // electricidad
              </p>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Circuitos Eléctricos
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualizador */}
            <div className="lg:col-span-2">
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Circuito Simple: Fuente + Resistencia
                </h3>
                <CircuitVisualizer
                  voltage={voltage}
                  resistance={resistance}
                  isActive={isActive}
                />
              </div>

              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Ley de Ohm
                </h3>
                <div className="p-4 rounded-lg mb-3" style={{ background: "rgba(247, 37, 133, 0.05)", border: "1px solid rgba(247, 37, 133, 0.15)" }}>
                  <p className="text-lg mb-1" style={{ color: "#f72585", fontFamily: "'JetBrains Mono', monospace" }}>V = I · R</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                    P = V · I = I² · R = V² / R
                  </p>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  V: voltaje (V) · I: corriente (A) · R: resistencia (Ω) · P: potencia (W)
                </p>
              </div>

              {/* Calculadora en vivo */}
              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Calculadora en Tiempo Real
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Voltaje (V)", value: `${voltage.toFixed(1)} V`, color: "#ffd60a" },
                    { label: "Resistencia (R)", value: `${resistance.toFixed(1)} Ω`, color: "#4361ee" },
                    { label: "Corriente I = V/R", value: `${current.toFixed(3)} A`, color: "#f72585" },
                    { label: "Potencia P = V·I", value: `${power.toFixed(1)} W`, color: "#00f5d4" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
                      <p className="text-xl font-bold" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</p>
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
                    Voltaje: <span style={{ color: "#ffd60a", fontFamily: "'JetBrains Mono', monospace" }}>{voltage.toFixed(1)} V</span>
                  </label>
                  <Slider
                    value={[voltage]}
                    onValueChange={(v) => setVoltage(v[0])}
                    min={0}
                    max={24}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>0V</span><span>12V</span><span>24V</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-2 block">
                    Resistencia: <span style={{ color: "#4361ee", fontFamily: "'JetBrains Mono', monospace" }}>{resistance.toFixed(1)} Ω</span>
                  </label>
                  <Slider
                    value={[resistance]}
                    onValueChange={(r) => setResistance(r[0])}
                    min={0.1}
                    max={20}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>0.1Ω</span><span>10Ω</span><span>20Ω</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsActive(!isActive)}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: isActive ? "rgba(247, 37, 133, 0.15)" : "rgba(0, 245, 212, 0.15)",
                    border: `1px solid ${isActive ? "rgba(247, 37, 133, 0.4)" : "rgba(0, 245, 212, 0.4)"}`,
                    color: isActive ? "#f72585" : "#00f5d4",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {isActive ? "⏹ Apagar" : "▶ Encender"}
                </button>

                <div className="mt-4 p-4 rounded-lg" style={{ background: "rgba(247, 37, 133, 0.05)", border: "1px solid rgba(247, 37, 133, 0.1)" }}>
                  <p className="text-xs font-medium text-white mb-2">💡 Experimenta:</p>
                  <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <li>• Aumenta V → sube la corriente</li>
                    <li>• Aumenta R → baja la corriente</li>
                    <li>• R muy baja → corriente muy alta (cortocircuito)</li>
                    <li>• P = I² · R → más corriente = más calor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conceptos */}
          <div className="mt-16">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // magnitudes eléctricas
            </p>
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Conceptos Fundamentales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conceptos.map((c) => (
                <div key={c.titulo} className="cyber-card rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div>
                      <h4 className="font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{c.titulo}</h4>
                      <div className="inline-block px-2 py-0.5 rounded text-xs mb-2" style={{ background: `${c.color}15`, color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>
                        {c.formula}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{c.desc}</p>
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
