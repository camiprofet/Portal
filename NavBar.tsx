/* ============================================================
   NavBar — Cyberpunk Académico
   Sticky top nav con detección de sub-rutas activas
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/fisica", label: "Física" },
  { href: "/orientacion", label: "Orientación" },
];

export default function NavBar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Marca activo si la ruta exacta coincide, o si es sub-ruta (excepto "/")
  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(href + "/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 9, 20, 0.95)"
          : "rgba(5, 9, 20, 0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(0, 245, 212, 0.15)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.5)" : "none",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{
                  background: "rgba(0, 245, 212, 0.1)",
                  border: "1px solid rgba(0, 245, 212, 0.4)",
                }}
              >
                <Zap size={16} style={{ color: "#00f5d4" }} />
              </div>
              <div>
                <span
                  className="font-bold text-lg leading-none block"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#00f5d4" }}
                >
                  La Matriz
                </span>
                <span
                  className="text-xs leading-none block"
                  style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Liceo O'Higgins
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    className="px-4 py-2 rounded text-sm font-medium transition-all duration-200"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: active ? "#00f5d4" : "rgba(255,255,255,0.7)",
                      background: active ? "rgba(0, 245, 212, 0.08)" : "transparent",
                      border: active ? "1px solid rgba(0, 245, 212, 0.2)" : "1px solid transparent",
                      textShadow: active ? "0 0 12px rgba(0, 245, 212, 0.5)" : "none",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded"
            style={{ color: "#00f5d4" }}
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(5, 9, 20, 0.98)",
            borderColor: "rgba(0, 245, 212, 0.1)",
          }}
        >
          <div className="container py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    className="block px-4 py-3 rounded text-sm font-medium"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: active ? "#00f5d4" : "rgba(255,255,255,0.7)",
                      background: active ? "rgba(0, 245, 212, 0.08)" : "transparent",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
