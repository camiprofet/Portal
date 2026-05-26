/* ============================================================
   Breadcrumb — Cyberpunk Académico
   Componente de navegación contextual para sub-páginas
   ============================================================ */
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface Crumb {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Navegación"
      className="flex items-center gap-1.5 text-xs mb-6 flex-wrap"
      style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.35)" }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {crumb.href && !isLast ? (
              <Link href={crumb.href}>
                <span
                  className="transition-colors duration-150 hover:text-white cursor-pointer"
                  style={{ color: "rgba(0, 245, 212, 0.55)" }}
                >
                  {crumb.label}
                </span>
              </Link>
            ) : (
              <span
                style={{
                  color: isLast ? "rgba(0, 245, 212, 0.8)" : "rgba(0, 245, 212, 0.55)",
                  fontWeight: isLast ? 500 : 400,
                }}
              >
                {crumb.label}
              </span>
            )}
            {!isLast && <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.2)" }} />}
          </span>
        );
      })}
    </nav>
  );
}
