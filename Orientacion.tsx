/* ============================================================
   Orientación — Cyberpunk Académico
   Áreas de orientación, recursos y herramientas interactivas
   ============================================================ */
import { useState } from "react";
import { Link } from "wouter";
import { Compass, ChevronDown, ChevronUp } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import NavBar from "@/components/NavBar";
import QuizOrientacion from "@/components/QuizOrientacion";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ORIENTACION_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663697524320/aBTgoW33keowB2hYSBvTXc/orientacion-bg-SBwp8aCm5mU6J2HJPXGaYK.webp";

const areas = [
  {
    icon: "📚",
    title: "Orientación Académica",
    desc: "Estrategias de estudio, gestión del tiempo, técnicas de aprendizaje y mejora del rendimiento académico.",
    color: "#00f5d4",
    tips: [
      "Usa la técnica Pomodoro: 25 min de estudio + 5 min de descanso",
      "Crea mapas mentales para organizar la información",
      "Estudia en bloques temáticos, no por tiempo",
      "Repasa el material dentro de las 24 horas de haberlo visto",
    ],
  },
  {
    icon: "💼",
    title: "Orientación Vocacional",
    desc: "Descubre tus intereses, aptitudes y opciones de carrera. Planifica tu futuro profesional.",
    color: "#f72585",
    tips: [
      "Explora diferentes áreas antes de decidir",
      "Habla con profesionales de las carreras que te interesan",
      "Considera tus fortalezas y pasiones, no solo el mercado laboral",
      "Investiga los requisitos de admisión universitaria",
    ],
  },
  {
    icon: "🧠",
    title: "Bienestar Emocional",
    desc: "Recursos para tu salud mental, manejo del estrés, ansiedad y desarrollo emocional.",
    color: "#7209b7",
    tips: [
      "Practica respiración profunda cuando sientas estrés",
      "Mantén una rutina de sueño regular (8 horas)",
      "Habla con alguien de confianza sobre tus preocupaciones",
      "El ejercicio físico mejora significativamente el estado de ánimo",
    ],
  },
  {
    icon: "👥",
    title: "Relaciones Interpersonales",
    desc: "Mejora tus habilidades sociales, comunicación efectiva y resolución de conflictos.",
    color: "#4361ee",
    tips: [
      "Practica la escucha activa: presta atención sin interrumpir",
      "Expresa tus emociones usando 'yo siento' en lugar de 'tú haces'",
      "Aprende a establecer límites saludables",
      "El respeto mutuo es la base de toda relación",
    ],
  },
];

const recursos = [
  { icon: "📖", title: "Guías y Manuales", desc: "Documentos con consejos prácticos y estrategias comprobadas." },
  { icon: "🎥", title: "Videos Educativos", desc: "Tutoriales y charlas sobre temas de desarrollo integral." },
  { icon: "📝", title: "Ejercicios Prácticos", desc: "Actividades para aplicar lo aprendido en tu vida cotidiana." },
  { icon: "💬", title: "Foro de Discusión", desc: "Espacio para compartir experiencias con tus compañeros." },
  { icon: "📅", title: "Eventos y Talleres", desc: "Sesiones en vivo, talleres temáticos y charlas de expertos." },
  { icon: "🤝", title: "Contacto Directo", desc: "Solicita una cita para hablar con la orientadora." },
];

const faqs = [
  {
    q: "¿Cuándo debo buscar orientación?",
    a: "En cualquier momento. No esperes a que haya un problema. La orientación es preventiva y puede ayudarte a evitar dificultades o a aprovechar mejor tus oportunidades.",
  },
  {
    q: "¿Es confidencial?",
    a: "Sí. Todo lo que compartas con orientación es confidencial, excepto en casos donde haya riesgo para ti o para otros.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "La orientación es un servicio gratuito para todos los estudiantes como parte de tu educación integral.",
  },
  {
    q: "¿Cómo puedo mejorar mi rendimiento académico?",
    a: "Comienza por identificar tus hábitos de estudio actuales. Luego implementa técnicas como la repetición espaciada, el método Cornell para tomar apuntes y la técnica Pomodoro para gestionar el tiempo.",
  },
];

function AreaCard({ area }: { area: typeof areas[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="cyber-card rounded-xl overflow-hidden"
      style={{ borderColor: `${area.color}25` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
              style={{ background: `${area.color}10`, border: `1px solid ${area.color}25` }}
            >
              {area.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {area.title}
              </h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                {area.desc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-200"
            style={{
              background: `${area.color}10`,
              border: `1px solid ${area.color}25`,
              color: area.color,
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Tips expandible */}
        {expanded && (
          <div
            className="mt-4 pt-4 animate-slide-up"
            style={{ borderTop: `1px solid ${area.color}15` }}
          >
            <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: area.color, fontFamily: "'JetBrains Mono', monospace" }}>
              // consejos prácticos
            </p>
            <ul className="flex flex-col gap-2">
              {area.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: area.color }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(13, 27, 42, 0.6)",
        border: open ? "1px solid rgba(247, 37, 133, 0.25)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm pr-4" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Space Grotesk', sans-serif" }}>
          {q}
        </span>
        <span style={{ color: "#f72585", flexShrink: 0 }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 animate-slide-up">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Orientacion() {
  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative pt-16 overflow-hidden" style={{ minHeight: "340px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ORIENTACION_BG})`, filter: "brightness(0.25)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(5,9,20,0.5), rgba(5,9,20,1))" }}
        />
        <div className="container relative z-10 py-20">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { label: "Orientación" },
            ]}
          />
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(247, 37, 133, 0.1)", border: "1px solid rgba(247, 37, 133, 0.3)" }}
            >
              <Compass size={24} style={{ color: "#f72585" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(247, 37, 133, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
                // módulo
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Orientación
              </h1>
            </div>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Tu espacio para el crecimiento académico y personal. Recursos, estrategias y acompañamiento integral para tu desarrollo como estudiante.
          </p>
        </div>
      </section>

      {/* ── ÁREAS ── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // áreas de orientación
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¿En qué te podemos ayudar?
            </h2>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              Haz clic en cada área para ver consejos prácticos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areas.map((area) => (
              <AreaCard key={area.title} area={area} />
            ))}
          </div>
        </div>
      </section>

      {/* ── RECURSOS ── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // recursos disponibles
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Material de apoyo
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recursos.map((r, i) => (
              <button
                key={r.title}
                className="cyber-card rounded-xl p-5 text-left animate-slide-up group"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => toast.info(`${r.title} — próximamente disponible`, { description: "La docente estará agregando este contenido pronto." })}
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h4 className="font-bold text-white text-sm mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {r.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {r.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // preguntas frecuentes
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¿Tienes dudas?
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      <QuizOrientacion />

      <Footer />
    </div>
  );
}
