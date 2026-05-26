/* ============================================================
   MagneticFieldVisualizer — Campos Magnéticos
   Visualización de líneas de fuerza magnética
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

interface MagneticFieldVisualizerProps {
  magnetStrength: number;
  fieldType: "dipole" | "solenoid";
}

export function MagneticFieldVisualizer({ magnetStrength, fieldType }: MagneticFieldVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Fondo
    ctx.fillStyle = "#030b18";
    ctx.fillRect(0, 0, W, H);

    if (fieldType === "dipole") {
      // Imán de barra (dipolo)
      const magnetX = W / 2;
      const magnetY = H / 2;

      // Polo norte (azul)
      ctx.fillStyle = "#4361ee";
      ctx.fillRect(magnetX - 30, magnetY - 60, 60, 30);
      ctx.fillStyle = "rgba(67, 97, 238, 0.7)";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("N", magnetX, magnetY - 45);

      // Polo sur (rojo)
      ctx.fillStyle = "#f72585";
      ctx.fillRect(magnetX - 30, magnetY + 30, 60, 30);
      ctx.fillStyle = "rgba(247, 37, 133, 0.7)";
      ctx.fillText("S", magnetX, magnetY + 45);

      // Líneas de fuerza
      const lineCount = Math.ceil(magnetStrength * 2);
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI;
        const startX = magnetX + Math.cos(angle) * 40;
        const startY = magnetY - 60;

        ctx.strokeStyle = `rgba(0, 245, 212, ${0.3 + (i / lineCount) * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Curva de línea de fuerza
        for (let t = 0; t <= 1; t += 0.05) {
          const x = startX + Math.sin(angle * t) * 80;
          const y = startY + t * (H - 60);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Líneas simétricas
        ctx.beginPath();
        ctx.moveTo(magnetX - (startX - magnetX), startY);
        for (let t = 0; t <= 1; t += 0.05) {
          const x = magnetX - (startX - magnetX) - Math.sin(angle * t) * 80;
          const y = startY + t * (H - 60);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else {
      // Solenoide (bobina)
      const coilX = W / 2;
      const coilRadius = 40;
      const coilWidth = 80;

      // Dibujar bobina
      ctx.strokeStyle = "#f72585";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const y = H / 2 - 80 + i * 40;
        ctx.beginPath();
        ctx.arc(coilX, y, coilRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Líneas de fuerza dentro del solenoide
      const fieldStrength = magnetStrength * 3;
      for (let i = 0; i < fieldStrength; i++) {
        const x = coilX - coilWidth / 2 + (i / fieldStrength) * coilWidth;
        ctx.strokeStyle = `rgba(0, 245, 212, ${0.4 + (i / fieldStrength) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, H / 2 - 100);
        ctx.lineTo(x, H / 2 + 100);
        ctx.stroke();
      }

      // Polos
      ctx.fillStyle = "#4361ee";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("N", coilX - coilWidth / 2 - 30, H / 2);
      ctx.fillStyle = "#f72585";
      ctx.fillText("S", coilX + coilWidth / 2 + 30, H / 2);
    }

    // Información
    ctx.fillStyle = "rgba(0, 245, 212, 0.7)";
    ctx.textAlign = "left";
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.fillText(`Campo: ${magnetStrength.toFixed(1)} T`, 10, 20);
    ctx.fillText(`Tipo: ${fieldType === "dipole" ? "Imán de barra" : "Solenoide"}`, 10, 40);

    animRef.current = requestAnimationFrame(draw);
  }, [magnetStrength, fieldType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{
        height: "200px",
        background: "#030b18",
        border: "1px solid rgba(0, 245, 212, 0.15)",
        display: "block",
      }}
    />
  );
}
