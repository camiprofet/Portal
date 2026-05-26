/* ============================================================
   Footer — Cyberpunk Académico
   ============================================================ */
import { Link } from "wouter";
import { Zap, BookOpen, Compass, MapPin, Mail } from "lucide-react";

const temasPhysics = [
  { href: "/fisica/movimiento", label: "Movimiento y Fuerzas" },
  { href: "/fisica/energia", label: "Energía y Trabajo" },
  { href: "/fisica/primero-medio", label: "Ondas y Sonido" },
  { href: "/fisica/electricidad", label: "Electricidad" },
  { href: "/fisica/magnetismo", label: "Magnetismo" },
  { href: "/fisica/optica", label: "Óptica" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24 border-t"
      style={{
        background: "rgba(5, 9, 20, 0.95)",
        borderColor: "rgba(0, 245, 212, 0.1)",
      }}
    >
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ background: "rgba(0, 245, 212, 0.1)", border: "1px solid rgba(0, 245, 212, 0.3)" }}
              >
                <Zap size={16} style={{ color: "#00f5d4" }} />
              </div>
              <span className="font-bold text-lg" style={{ color: "#00f5d4", fontFamily: "'Space Grotesk', sans-serif" }}>
                La Matriz
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Portal académico interactivo del Liceo Emblemático O'Higgins.
            </p>
            <p className="text-sm" style={{ color: "rgba(0, 245, 212, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
              Prof. Camila Tapia Cisternas
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              <MapPin size={11} />
              <span>Iquique, Chile</span>
            </div>
          </div>

          {/* Materias */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              Módulos
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/fisica">
                <span className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}>
                  <BookOpen size={14} style={{ color: "#00f5d4" }} /> Física
                </span>
              </Link>
              <Link href="/orientacion">
                <span className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}>
                  <Compass size={14} style={{ color: "#f72585" }} /> Orientación
                </span>
              </Link>
            </div>
          </div>

          {/* Temas de Física */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              Temas Física
            </h4>
            <div className="flex flex-col gap-1.5">
              {temasPhysics.map((t) => (
                <Link key={t.href} href={t.href}>
                  <span className="text-xs transition-colors duration-200 hover:text-white"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    {t.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Establecimiento */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              Establecimiento
            </h4>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Liceo Emblemático Libertador General Bernardo O'Higgins Riquelme
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Departamento de Ciencias y Tecnología
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "rgba(0, 245, 212, 0.4)" }}>
              <Mail size={11} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Iquique · Tarapacá · Chile</span>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(0, 245, 212, 0.08)", color: "rgba(255,255,255,0.25)" }}
        >
          <span>© {year} La Matriz · Liceo O'Higgins. Todos los derechos reservados.</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(0, 245, 212, 0.3)" }}>
            v1.0.0 · Hecho con ❤️ para las ciencias
          </span>
        </div>
      </div>
    </footer>
  );
}
