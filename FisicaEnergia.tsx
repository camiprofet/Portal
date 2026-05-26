/* ============================================================
   Energía y Trabajo — Transformación de Energía
   ============================================================ */
import { useState } from "react";
import { Flame } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { EnergyVisualizer } from "@/components/EnergyVisualizer";

const G = 9.8; // m/s²

export default function FisicaEnergia() {
  const [height, setHeight] = useState(50);
  const [mass, setMass] = useState(1);
  const [isDropping, setIsDropping] = useState(false);

  const ep = mass * G * height;
  const vFinal = Math.sqrt(2 * G * height);
  const ekFinal = 0.5 * mass * vFinal * vFinal;
  const trabajo = mass * G * height; // W = F·d = m·g·h

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      <section className="py-16">
        <div className="container">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { href: "/fisica", label: "Física" },
              { label: "Energía y Trabajo" },
            ]}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255, 214, 10, 0.1)", border: "1px solid rgba(255, 214, 10, 0.3)" }}>
              <Flame size={24} style={{ color: "#ffd60a" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(255, 214, 10, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                // energía y trabajo
              </p>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Transformación de Energía
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualizador */}
            <div className="lg:col-span-2">
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Caída Libre: Conversión Ep ↔ Ek
                </h3>
                <EnergyVisualizer
                  height={height}
                  mass={mass}
                  isDropping={isDropping}
                />
              </div>

              {/* Fórmulas */}
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Fórmulas Fundamentales
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { formula: "Ep = m · g · h", label: "Energía Potencial Gravitatoria", color: "#00f5d4" },
                    { formula: "Ek = ½ · m · v²", label: "Energía Cinética", color: "#f72585" },
                    { formula: "W = F · d · cos(θ)", label: "Trabajo Mecánico", color: "#ffd60a" },
                    { formula: "Et = Ep + Ek = cte.", label: "Conservación de Energía Mecánica", color: "#7fff00" },
                  ].map((item) => (
                    <div key={item.formula} className="flex items-center gap-4 p-3 rounded-lg"
                      style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                      <code className="text-sm font-bold" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace", minWidth: "180px" }}>
                        {item.formula}
                      </code>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculadora */}
              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Resultados para los Valores Actuales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Ep inicial", value: `${ep.toFixed(1)} J`, color: "#00f5d4" },
                    { label: "Ek inicial", value: "0 J", color: "rgba(255,255,255,0.3)" },
                    { label: "v al impacto", value: `${vFinal.toFixed(2)} m/s`, color: "#f72585" },
                    { label: "Ek al impacto", value: `${ekFinal.toFixed(1)} J`, color: "#ffd60a" },
                    { label: "Trabajo de la gravedad", value: `${trabajo.toFixed(1)} J`, color: "#7fff00" },
                    { label: "Energía total (cte.)", value: `${ep.toFixed(1)} J`, color: "#4361ee" },
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
                    Altura: <span style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>{height.toFixed(1)} m</span>
                  </label>
                  <Slider
                    value={[height]}
                    onValueChange={(h) => { setHeight(h[0]); setIsDropping(false); }}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-2 block">
                    Masa: <span style={{ color: "#ffd60a", fontFamily: "'JetBrains Mono', monospace" }}>{mass.toFixed(1)} kg</span>
                  </label>
                  <Slider
                    value={[mass]}
                    onValueChange={(m) => { setMass(m[0]); setIsDropping(false); }}
                    min={0.1}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="mb-4 p-3 rounded-lg text-center" style={{ background: "rgba(0, 245, 212, 0.05)", border: "1px solid rgba(0, 245, 212, 0.1)" }}>
                  <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>g = 9.8 m/s² (constante)</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Gravedad terrestre</p>
                </div>

                <button
                  onClick={() => setIsDropping(!isDropping)}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: isDropping ? "rgba(247, 37, 133, 0.15)" : "rgba(255, 214, 10, 0.15)",
                    border: `1px solid ${isDropping ? "rgba(247, 37, 133, 0.4)" : "rgba(255, 214, 10, 0.4)"}`,
                    color: isDropping ? "#f72585" : "#ffd60a",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {isDropping ? "⏹ Detener" : "▶ Soltar objeto"}
                </button>

                <div className="mt-4 p-4 rounded-lg" style={{ background: "rgba(255, 214, 10, 0.05)", border: "1px solid rgba(255, 214, 10, 0.1)" }}>
                  <p className="text-xs font-medium text-white mb-2">💡 Principio clave:</p>
                  <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <li>• Ep + Ek = constante (sin fricción)</li>
                    <li>• Mientras baja → Ep↓, Ek↑</li>
                    <li>• Mayor masa → mayor Ep, misma v</li>
                    <li>• Mayor altura → mayor v al impacto</li>
                  </ul>
                </div>
              </div>

              {/* Tipos de energía */}
              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Tipos de Energía
                </h3>
                <div className="space-y-2">
                  {[
                    { tipo: "Mecánica", desc: "Cinética + Potencial. Objetos en movimiento o con altura." },
                    { tipo: "Térmica", desc: "Asociada a la temperatura y agitación molecular." },
                    { tipo: "Eléctrica", desc: "Flujo de cargas eléctricas en un circuito." },
                    { tipo: "Química", desc: "Almacenada en enlaces químicos (alimentos, baterías)." },
                    { tipo: "Nuclear", desc: "Liberada en reacciones de fusión o fisión nuclear." },
                  ].map((item) => (
                    <div key={item.tipo} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: "#ffd60a" }}>{item.tipo}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
