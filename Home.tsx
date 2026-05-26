/* ============================================================
   Home — Cyberpunk Académico
   Hero con imagen de fondo, typewriter effect, cards de materias
   Liceo O'Higgins · Prof. Camila Tapia Cisternas
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Atom, Compass, ChevronRight, Zap, BookOpen, Star } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663697524320/aBTgoW33keowB2hYSBvTXc/hero-bg-cYfYNpGZPSSkUqFPCgtNdh.webp";

const TYPEWRITER_TEXTS = [
  "Explora la Física del universo",
  "Descubre tu potencial",
  "Aprende con tecnología",
  "Ciencia + Orientación",
];

function useTypewriter(texts: string[], speed = 60, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
}

// Animated particle canvas
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 212, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

const materias = [
  {
    href: "/fisica",
    icon: Atom,
    title: "Física",
    subtitle: "Ciencias Naturales",
    desc: "Ondas sonoras, escala de decibeles, osciloscopio interactivo y los principios fundamentales que rigen el universo.",
    color: "#00f5d4",
    glow: "rgba(0, 245, 212, 0.15)",
    border: "rgba(0, 245, 212, 0.25)",
    bg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663697524320/aBTgoW33keowB2hYSBvTXc/fisica-bg-oLaFxGErboDSxGiSwo3M64.webp",
    badge: "Primero Medio",
  },
  {
    href: "/orientacion",
    icon: Compass,
    title: "Orientación",
    subtitle: "Desarrollo Personal",
    desc: "Recursos para tu crecimiento académico y personal. Estrategias de estudio, bienestar emocional y orientación vocacional.",
    color: "#f72585",
    glow: "rgba(247, 37, 133, 0.15)",
    border: "rgba(247, 37, 133, 0.25)",
    bg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663697524320/aBTgoW33keowB2hYSBvTXc/orientacion-bg-SBwp8aCm5mU6J2HJPXGaYK.webp",
    badge: "Todos los cursos",
  },
];

const stats = [
  { value: "2", label: "Materias", icon: BookOpen },
  { value: "∞", label: "Recursos", icon: Star },
  { value: "100%", label: "Interactivo", icon: Zap },
];

export default function Home() {
  const typed = useTypewriter(TYPEWRITER_TEXTS);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ paddingTop: "64px" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            filter: "brightness(0.35)",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(5,9,20,0.7) 0%, rgba(5,9,20,0.3) 50%, rgba(5,9,20,0.8) 100%)",
          }}
        />
        {/* Particles */}
        <ParticleCanvas />

        {/* Content */}
        <div className="container relative z-10 py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{
                background: "rgba(0, 245, 212, 0.08)",
                border: "1px solid rgba(0, 245, 212, 0.25)",
                color: "#00f5d4",
                fontFamily: "'JetBrains Mono', monospace",
                transitionDelay: "0ms",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
              Liceo Emblemático Libertador General Bernardo O'Higgins Riquelme
            </div>

            {/* Title */}
            <h1
              className={`text-5xl md:text-7xl font-black leading-none mb-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                transitionDelay: "100ms",
              }}
            >
              <span className="gradient-text-cyan">La Matriz</span>
            </h1>

            {/* Typewriter */}
            <div
              className={`text-xl md:text-2xl font-medium mb-2 h-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Space Grotesk', sans-serif",
                transitionDelay: "200ms",
              }}
            >
              {typed}
              <span className="inline-block w-0.5 h-6 ml-1 align-middle animate-pulse" style={{ background: "#00f5d4" }} />
            </div>

            {/* Subtitle */}
            <p
              className={`text-base md:text-lg mb-8 max-w-xl leading-relaxed transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{
                color: "rgba(255,255,255,0.5)",
                transitionDelay: "300ms",
              }}
            >
              Portal académico de la{" "}
              <span style={{ color: "rgba(0, 245, 212, 0.8)" }}>Prof. Camila Tapia Cisternas</span>.
              Física interactiva y orientación para tu desarrollo integral.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-wrap gap-3 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <Link href="/fisica">
                <button
                  className="btn-neon-cyan flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                >
                  <Atom size={16} />
                  Ir a Física
                  <ChevronRight size={14} />
                </button>
              </Link>
              <Link href="/orientacion">
                <button
                  className="btn-neon-magenta flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                >
                  <Compass size={16} />
                  Ir a Orientación
                  <ChevronRight size={14} />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 mt-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "500ms" }}
            >
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} style={{ color: "#00f5d4" }} />
                  <div>
                    <div className="text-lg font-bold leading-none" style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}>
                      {value}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-xs" style={{ color: "rgba(0, 245, 212, 0.4)", fontFamily: "'JetBrains Mono', monospace" }}>scroll</span>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(0,245,212,0.4), transparent)" }} />
        </div>
      </section>

      {/* ── MATERIAS ── */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // materias disponibles
            </p>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
              Elige tu{" "}
              <span className="gradient-text-cyan">módulo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materias.map((m, i) => {
              const Icon = m.icon;
              return (
                <Link key={m.href} href={m.href}>
                  <div
                    className="cyber-card rounded-2xl overflow-hidden group cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {/* Card image header */}
                    <div
                      className="relative h-48 overflow-hidden"
                      style={{
                        backgroundImage: `url(${m.bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, rgba(5,9,20,0.2), rgba(5,9,20,0.85))` }}
                      />
                      <div className="absolute bottom-4 left-6 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: `${m.glow}`, border: `1px solid ${m.border}` }}
                        >
                          <Icon size={20} style={{ color: m.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-medium" style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>
                            {m.subtitle}
                          </div>
                          <div className="text-xl font-bold text-white">{m.title}</div>
                        </div>
                      </div>
                      {/* Badge */}
                      <div
                        className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium"
                        style={{ background: `${m.glow}`, border: `1px solid ${m.border}`, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {m.badge}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6">
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {m.desc}
                      </p>
                      <div
                        className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
                        style={{ color: m.color }}
                      >
                        Explorar módulo <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DOCENTE BANNER ── */}
      <section className="py-16">
        <div className="container">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0, 245, 212, 0.05) 0%, rgba(247, 37, 133, 0.05) 100%)",
              border: "1px solid rgba(0, 245, 212, 0.1)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ background: "#00f5d4", transform: "translate(30%, -30%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
              style={{ background: "#f72585", transform: "translate(-30%, 30%)" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(0, 245, 212, 0.1)", border: "1px solid rgba(0, 245, 212, 0.25)" }}
              >
                <span className="text-3xl">👩‍🏫</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                  // docente a cargo
                </p>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Prof. Camila Tapia Cisternas
                </h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Liceo Emblemático Libertador General Bernardo O'Higgins Riquelme · Física y Orientación
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/fisica">
                  <button className="btn-neon-cyan px-5 py-2.5 rounded-lg text-sm">
                    Física
                  </button>
                </Link>
                <Link href="/orientacion">
                  <button className="btn-neon-magenta px-5 py-2.5 rounded-lg text-sm">
                    Orientación
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
