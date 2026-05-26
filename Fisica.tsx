/* ============================================================
   Física — Cyberpunk Académico
   Temas de física con cards interactivas y acceso a Primero Medio
   ============================================================ */
import { Link } from "wouter";
import { Atom, ChevronRight, Rocket, Flame, Waves, Zap, Magnet, Eye } from "lucide-react";
import NavBar from "@/components/NavBar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

const FISICA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663697524320/aBTgoW33keowB2hYSBvTXc/fisica-bg-oLaFxGErboDSxGiSwo3M64.webp";

const temas = [
  {
    icon: Rocket,
    title: "Movimiento y Fuerzas",
    desc: "Estudia el movimiento de los objetos, la aceleración, velocidad y las leyes de Newton que explican cómo actúan las fuerzas.",
    color: "#00f5d4",
    available: true,
    href: "/fisica/movimiento",
    badge: "Interactivo",
  },
  {
    icon: Flame,
    title: "Energía y Trabajo",
    desc: "Comprende los conceptos de energía cinética, potencial, trabajo mecánico y la conservación de la energía.",
    color: "#ffd60a",
    available: true,
    href: "/fisica/energia",
    badge: "Interactivo",
  },
  {
    icon: Waves,
    title: "Ondas y Sonido",
    desc: "Explora las propiedades de las ondas, su propagación, interferencia y aplicaciones en el sonido. Incluye osciloscopio interactivo.",
    color: "#4361ee",
    available: true,
    href: "/fisica/primero-medio",
    badge: "Primero Medio",
  },
  {
    icon: Zap,
    title: "Electricidad",
    desc: "Estudia las cargas eléctricas, campos eléctricos, corriente eléctrica y circuitos.",
    color: "#f72585",
    available: true,
    href: "/fisica/electricidad",
    badge: "Interactivo",
  },
  {
    icon: Magnet,
    title: "Magnetismo",
    desc: "Descubre los campos magnéticos, la interacción entre magnetismo y electricidad, y sus aplicaciones.",
    color: "#7209b7",
    available: true,
    href: "/fisica/magnetismo",
    badge: "Interactivo",
  },
  {
    icon: Eye,
    title: "Óptica",
    desc: "Aprende sobre la luz, reflexión, refracción, lentes y fenómenos ópticos en la naturaleza.",
    color: "#ff9f1c",
    available: true,
    href: "/fisica/optica",
    badge: "Interactivo",
  },
];

const recursos = [
  { icon: "📖", title: "Material de Lectura", desc: "Apuntes, resúmenes y material de referencia para cada tema." },
  { icon: "✏️", title: "Ejercicios Prácticos", desc: "Resuelve problemas y ejercicios para reforzar tu comprensión." },
  { icon: "🎥", title: "Videos Educativos", desc: "Explicaciones en video de conceptos complejos y experimentos." },
  { icon: "🧪", title: "Experimentos", desc: "Experimentos prácticos que demuestran los principios físicos." },
];

export default function Fisica() {
  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      {/* ── HERO ── */}
      <section
        className="relative pt-16 overflow-hidden"
        style={{ minHeight: "380px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${FISICA_BG})`,
            filter: "brightness(0.25)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(5,9,20,0.4), rgba(5,9,20,1))" }}
        />

        <div className="container relative z-10 py-20">
          <Breadcrumb
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Física" },
          ]}
        />

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0, 245, 212, 0.1)", border: "1px solid rgba(0, 245, 212, 0.3)" }}
            >
              <Atom size={24} style={{ color: "#00f5d4" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                // módulo
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Física
              </h1>
            </div>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Explora los principios fundamentales que rigen el universo físico. Desde la mecánica clásica hasta las ondas sonoras interactivas.
          </p>
        </div>
      </section>

      {/* ── TEMAS ── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // temas principales
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Contenidos del curso
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {temas.map((tema, i) => {
              const Icon = tema.icon;
              return tema.available && tema.href ? (
                <Link key={tema.title} href={tema.href}>
                  <div
                    className="cyber-card rounded-xl p-6 h-full animate-slide-up relative overflow-hidden"
                    style={{ animationDelay: `${i * 80}ms`, borderColor: `${tema.color}40` }}
                  >
                    {/* Available glow */}
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: `${tema.color}15`, border: `1px solid ${tema.color}40`, color: tema.color, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {tema.badge}
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: `${tema.color}15`, border: `1px solid ${tema.color}30` }}
                    >
                      <Icon size={20} style={{ color: tema.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {tema.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {tema.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: tema.color }}>
                      Ver tema <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={tema.title}
                  className="cyber-card rounded-xl p-6 h-full animate-slide-up relative opacity-60"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    próximamente
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${tema.color}10`, border: `1px solid ${tema.color}20` }}
                  >
                    <Icon size={20} style={{ color: tema.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tema.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {tema.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RECURSOS ── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // recursos disponibles
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Material de apoyo
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recursos.map((r, i) => (
              <div
                key={r.title}
                className="cyber-card rounded-xl p-5 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h4 className="font-bold text-white mb-1.5 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {r.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Primero Medio ── */}
      <section className="py-16">
        <div className="container">
          <div
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(0, 245, 212, 0.05) 100%)",
              border: "1px solid rgba(67, 97, 238, 0.2)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 blur-3xl"
              style={{ background: "#4361ee", transform: "translate(20%, -20%)" }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="text-5xl animate-float">🌊</div>
              <div className="flex-1">
                <p className="text-xs font-medium mb-1" style={{ color: "rgba(67, 97, 238, 0.8)", fontFamily: "'JetBrains Mono', monospace" }}>
                  // primero medio · disponible ahora
                </p>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Ondas Sonoras Interactivas
                </h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Osciloscopio en tiempo real, escala logarítmica de decibeles y rangos de frecuencia. ¡Experimenta con las ondas sonoras!
                </p>
              </div>
              <Link href="/fisica/primero-medio">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold flex-shrink-0"
                  style={{
                    background: "rgba(67, 97, 238, 0.15)",
                    border: "1px solid rgba(67, 97, 238, 0.4)",
                    color: "#7b9ef7",
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(67, 97, 238, 0.25)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(67, 97, 238, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(67, 97, 238, 0.15)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  Explorar ahora <ChevronRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
