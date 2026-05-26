/* ============================================================
   Óptica — Refracción y Reflexión Interactivas
   ============================================================ */
import { useState } from "react";
import { Eye } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { OpticsVisualizer } from "@/components/OpticsVisualizer";

const medios = [
  { nombre: "Vacío / Aire", n: 1.00, emoji: "🌌" },
  { nombre: "Agua", n: 1.33, emoji: "💧" },
  { nombre: "Vidrio (crown)", n: 1.52, emoji: "🔮" },
  { nombre: "Vidrio (flint)", n: 1.70, emoji: "🔷" },
  { nombre: "Diamante", n: 2.42, emoji: "💎" },
];

const conceptos = [
  {
    titulo: "Ley de Snell (Refracción)",
    formula: "n₁ · sin(θ₁) = n₂ · sin(θ₂)",
    desc: "Al pasar de un medio a otro, la luz cambia de velocidad y dirección. El índice de refracción n = c/v indica cuánto más lento viaja la luz en ese medio.",
    color: "#ff9f1c",
  },
  {
    titulo: "Ley de Reflexión",
    formula: "θ_incidencia = θ_reflexión",
    desc: "El ángulo de incidencia es igual al ángulo de reflexión, ambos medidos respecto a la normal de la superficie. Es la base de los espejos.",
    color: "#00f5d4",
  },
  {
    titulo: "Reflexión Total Interna",
    formula: "sin(θ_c) = n₂ / n₁  (con n₁ > n₂)",
    desc: "Cuando la luz pasa de un medio más denso a uno menos denso con un ángulo mayor al crítico, NO sale del medio. Base de la fibra óptica.",
    color: "#f72585",
  },
  {
    titulo: "Índice de Refracción",
    formula: "n = c / v  (c = 3×10⁸ m/s)",
    desc: "Relación entre la velocidad de la luz en el vacío (c) y en el medio (v). Siempre n ≥ 1. Mayor n → mayor cambio de dirección al refractar.",
    color: "#7209b7",
  },
];

export default function FisicaOptica() {
  const [angle, setAngle] = useState(30);
  const [opticsType, setOpticsType] = useState<"refraction" | "reflection">("refraction");
  const [refractiveIndex, setRefractiveIndex] = useState(1.33);
  const [selectedMedio, setSelectedMedio] = useState(1); // índice en medios[]

  const thetaR_rad = Math.asin(Math.min(1, Math.sin(angle * Math.PI / 180) / refractiveIndex));
  const thetaR_deg = isNaN(thetaR_rad) ? "∞ (reflexión total)" : (thetaR_rad * 180 / Math.PI).toFixed(1) + "°";
  const thetaC_deg = (Math.asin(1 / refractiveIndex) * 180 / Math.PI).toFixed(1);

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      <section className="py-16">
        <div className="container">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { href: "/fisica", label: "Física" },
              { label: "Óptica" },
            ]}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255, 159, 28, 0.1)", border: "1px solid rgba(255, 159, 28, 0.3)" }}>
              <Eye size={24} style={{ color: "#ff9f1c" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(255, 159, 28, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                // óptica
              </p>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Refracción y Reflexión
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualizador */}
            <div className="lg:col-span-2">
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Visualización de Rayos de Luz
                </h3>
                <OpticsVisualizer
                  angle={angle}
                  opticsType={opticsType}
                  refractiveIndex={refractiveIndex}
                />
              </div>

              {/* Leyes */}
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {opticsType === "refraction" ? "Ley de Snell — Refracción" : "Ley de Reflexión"}
                </h3>
                <div className="p-4 rounded-lg mb-3" style={{ background: "rgba(255, 159, 28, 0.06)", border: "1px solid rgba(255, 159, 28, 0.2)" }}>
                  {opticsType === "refraction" ? (
                    <>
                      <p className="text-base mb-1" style={{ color: "#ff9f1c", fontFamily: "'JetBrains Mono', monospace" }}>
                        n₁ · sin(θ₁) = n₂ · sin(θ₂)
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Con n₁ = 1 (aire) y n₂ = {refractiveIndex.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-base" style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>
                      θᵢ = θᵣ  (ángulo incidencia = ángulo reflexión)
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "θ incidencia", value: `${angle}°`, color: "#ff9f1c" },
                    { label: opticsType === "refraction" ? "θ refracción" : "θ reflexión", value: opticsType === "refraction" ? thetaR_deg : `${angle}°`, color: "#00f5d4" },
                    { label: "θ crítico", value: refractiveIndex > 1 ? `${thetaC_deg}°` : "N/A", color: "#f72585" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
                      <p className="text-base font-bold" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medios predefinidos */}
              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Índices de Refracción Comunes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medios.map((m, i) => (
                    <button
                      key={m.nombre}
                      onClick={() => { setSelectedMedio(i); setRefractiveIndex(m.n); }}
                      className="p-3 rounded-lg text-left transition-all"
                      style={{
                        background: selectedMedio === i ? "rgba(255, 159, 28, 0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedMedio === i ? "rgba(255, 159, 28, 0.4)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <span className="text-lg block mb-1">{m.emoji}</span>
                      <p className="text-xs font-medium text-white">{m.nombre}</p>
                      <p className="text-xs" style={{ color: "#ff9f1c", fontFamily: "'JetBrains Mono', monospace" }}>n = {m.n.toFixed(2)}</p>
                    </button>
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
                    Ángulo de Incidencia: <span style={{ color: "#ff9f1c", fontFamily: "'JetBrains Mono', monospace" }}>{angle.toFixed(1)}°</span>
                  </label>
                  <Slider
                    value={[angle]}
                    onValueChange={(a) => setAngle(a[0])}
                    min={0}
                    max={85}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>0°</span><span>45°</span><span>85°</span>
                  </div>
                </div>

                {opticsType === "refraction" && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Índice de Refracción: <span style={{ color: "#ff9f1c", fontFamily: "'JetBrains Mono', monospace" }}>{refractiveIndex.toFixed(2)}</span>
                    </label>
                    <Slider
                      value={[refractiveIndex]}
                      onValueChange={(n) => { setRefractiveIndex(n[0]); setSelectedMedio(-1); }}
                      min={1}
                      max={2.5}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <span>1.00 (aire)</span><span>2.50 (diamante)</span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-3 block">Tipo de Fenómeno:</label>
                  <Tabs value={opticsType} onValueChange={(v) => setOpticsType(v as "refraction" | "reflection")}>
                    <TabsList className="w-full">
                      <TabsTrigger value="refraction" className="flex-1 text-xs">Refracción</TabsTrigger>
                      <TabsTrigger value="reflection" className="flex-1 text-xs">Reflexión</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="p-4 rounded-lg" style={{ background: "rgba(255, 159, 28, 0.05)", border: "1px solid rgba(255, 159, 28, 0.1)" }}>
                  <p className="text-xs font-medium text-white mb-2">💡 Observa:</p>
                  <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {opticsType === "refraction" ? (
                      <>
                        <li>• n&gt;1 → el rayo se dobla hacia la normal</li>
                        <li>• Mayor n → mayor curvatura</li>
                        <li>• Si θ &gt; θ_crítico → reflexión total</li>
                      </>
                    ) : (
                      <>
                        <li>• θ_reflexión = θ_incidencia siempre</li>
                        <li>• La normal es la referencia</li>
                        <li>• Base de espejos planos y curvos</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conceptos */}
          <div className="mt-16">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(255, 159, 28, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // fundamentos de óptica
            </p>
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Leyes y Conceptos Esenciales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conceptos.map((c) => (
                <div key={c.titulo} className="cyber-card rounded-xl p-6">
                  <h4 className="font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.color }}>{c.titulo}</h4>
                  <div className="inline-block px-2 py-0.5 rounded text-xs mb-3" style={{ background: `${c.color}15`, color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {c.formula}
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
