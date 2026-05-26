/* ============================================================
   Magnetismo — Campos Magnéticos Interactivos
   ============================================================ */
import { useState } from "react";
import { Magnet } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { MagneticFieldVisualizer } from "@/components/MagneticFieldVisualizer";

const conceptos = [
  {
    titulo: "Campo Magnético (B)",
    formula: "B [T — Tesla]",
    desc: "Región del espacio donde se ejerce fuerza magnética sobre cargas en movimiento. Su dirección se representa con líneas de fuerza.",
    color: "#7209b7",
  },
  {
    titulo: "Fuerza de Lorentz",
    formula: "F = q · v × B",
    desc: "Fuerza que ejerce un campo magnético sobre una carga q moviéndose a velocidad v. Es perpendicular a v y a B (producto vectorial).",
    color: "#4361ee",
  },
  {
    titulo: "Regla de la Mano Derecha",
    formula: "F = I · L × B",
    desc: "Herramienta mnemotécnica para determinar la dirección de la fuerza magnética. Dedos apuntan en dirección de v (o I), se doblan hacia B, y el pulgar da F.",
    color: "#f72585",
  },
  {
    titulo: "Electromagnetismo",
    formula: "B = μ₀ · n · I",
    desc: "Una corriente eléctrica produce un campo magnético (Oersted, 1820). Un solenoide de n vueltas/metro con corriente I produce un campo uniforme interior.",
    color: "#00f5d4",
  },
];

const aplicaciones = [
  { emoji: "🧭", titulo: "Brújula", desc: "El campo magnético terrestre orienta la aguja hacia el polo norte magnético." },
  { emoji: "🔊", titulo: "Altavoces", desc: "Un electroimán que varía genera movimiento en la membrana del altavoz." },
  { emoji: "🏥", titulo: "Resonancia Magnética (MRI)", desc: "Campos muy intensos alinean protones del cuerpo para obtener imágenes médicas." },
  { emoji: "⚡", titulo: "Generadores", desc: "La variación del campo magnético induce corriente eléctrica (Faraday)." },
  { emoji: "🚄", titulo: "Tren Maglev", desc: "Levitación magnética por repulsión de campos superconductores." },
  { emoji: "💻", titulo: "Disco Duro (HDD)", desc: "Los datos se almacenan como zonas magnetizadas en una superficie giratoria." },
];

export default function FisicaMagnetismo() {
  const [magnetStrength, setMagnetStrength] = useState(1);
  const [fieldType, setFieldType] = useState<"dipole" | "solenoid">("dipole");

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      <section className="py-16">
        <div className="container">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { href: "/fisica", label: "Física" },
              { label: "Magnetismo" },
            ]}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(114, 9, 183, 0.1)", border: "1px solid rgba(114, 9, 183, 0.3)" }}>
              <Magnet size={24} style={{ color: "#7209b7" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(114, 9, 183, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                // magnetismo
              </p>
              <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Campos Magnéticos
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualizador */}
            <div className="lg:col-span-2">
              <div className="cyber-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Visualización de Campos Magnéticos
                </h3>
                <MagneticFieldVisualizer
                  magnetStrength={magnetStrength}
                  fieldType={fieldType}
                />
              </div>

              <div className="cyber-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Diferencia entre Imán y Solenoide
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ background: "rgba(114, 9, 183, 0.07)", border: "1px solid rgba(114, 9, 183, 0.2)" }}>
                    <p className="text-sm font-bold text-white mb-2">🧲 Imán Permanente</p>
                    <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <li>• Campo dipolar permanente</li>
                      <li>• No requiere electricidad</li>
                      <li>• Polos N y S inseparables</li>
                      <li>• Campo más intenso en los polos</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: "rgba(0, 245, 212, 0.07)", border: "1px solid rgba(0, 245, 212, 0.2)" }}>
                    <p className="text-sm font-bold text-white mb-2">⚙️ Solenoide (Electroimán)</p>
                    <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <li>• Campo solo con corriente activa</li>
                      <li>• Intensidad controlable (I)</li>
                      <li>• Campo uniforme en el interior</li>
                      <li>• Polaridad reversible</li>
                    </ul>
                  </div>
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
                    Intensidad: <span style={{ color: "#7209b7", fontFamily: "'JetBrains Mono', monospace" }}>{magnetStrength.toFixed(1)} T</span>
                  </label>
                  <Slider
                    value={[magnetStrength]}
                    onValueChange={(m) => setMagnetStrength(m[0])}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>débil</span><span>fuerte</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-white mb-3 block">Tipo de Campo:</label>
                  <Tabs value={fieldType} onValueChange={(v) => setFieldType(v as "dipole" | "solenoid")}>
                    <TabsList className="w-full">
                      <TabsTrigger value="dipole" className="flex-1">🧲 Imán</TabsTrigger>
                      <TabsTrigger value="solenoid" className="flex-1">⚙️ Bobina</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="p-4 rounded-lg mb-4" style={{ background: "rgba(114, 9, 183, 0.05)", border: "1px solid rgba(114, 9, 183, 0.1)" }}>
                  <p className="text-xs font-medium text-white mb-2">📏 Unidades:</p>
                  <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
                    <li>• B: Tesla (T)</li>
                    <li>• μ₀ = 4π×10⁻⁷ T·m/A</li>
                    <li>• Tierra ≈ 25–65 μT</li>
                    <li>• MRI médico ≈ 1.5–3 T</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg" style={{ background: "rgba(0, 245, 212, 0.05)", border: "1px solid rgba(0, 245, 212, 0.1)" }}>
                  <p className="text-xs font-medium text-white mb-2">💡 Recuerda:</p>
                  <ul className="text-xs space-y-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <li>• Líneas de campo van de N→S fuera del imán</li>
                    <li>• Se cierran pasando por el interior (S→N)</li>
                    <li>• Polos iguales se repelen, distintos atraen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conceptos y Aplicaciones */}
          <div className="mt-16">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(114, 9, 183, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // fundamentos
            </p>
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Conceptos Esenciales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
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

            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(114, 9, 183, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // aplicaciones reales
            </p>
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              El Magnetismo en tu Vida
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {aplicaciones.map((a) => (
                <div key={a.titulo} className="cyber-card rounded-xl p-4">
                  <div className="text-2xl mb-2">{a.emoji}</div>
                  <h4 className="font-bold text-white text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{a.titulo}</h4>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{a.desc}</p>
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
