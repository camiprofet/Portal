/* ============================================================
   CircuitVisualizer — Circuitos Eléctricos Interactivos
   Visualización de voltaje, corriente y resistencia
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

interface CircuitVisualizerProps {
  voltage: number;
  resistance: number;
  isActive: boolean;
}

export function CircuitVisualizer({ voltage, resistance, isActive }: CircuitVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particleRef = useRef<{ x: number; y: number }[]>([]);

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

    // Ley de Ohm: I = V/R
    const current = resistance > 0 ? voltage / resistance : 0;
    const speed = isActive ? Math.abs(current) * 0.5 : 0;

    // Inicializar partículas si es necesario
    if (particleRef.current.length === 0 && isActive) {
      for (let i = 0; i < 5; i++) {
        particleRef.current.push({ x: Math.random() * W, y: Math.random() * H });
      }
    }

    // Dibujar circuito (rectángulo simple)
    const margin = 40;
    ctx.strokeStyle = "rgba(0, 245, 212, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, W - 2 * margin, H - 2 * margin);

    // Fuente de voltaje (izquierda)
    ctx.fillStyle = "#4361ee";
    ctx.beginPath();
    ctx.arc(margin + 20, H / 2, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(67, 97, 238, 0.6)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("V", margin + 20, H / 2);

    // Resistencia (derecha)
    ctx.strokeStyle = "#f72585";
    ctx.lineWidth = 2;
    const resistorX = W - margin - 20;
    const resistorY = H / 2;
    const resistorWidth = 30;
    const resistorHeight = 15;
    ctx.strokeRect(resistorX - resistorWidth / 2, resistorY - resistorHeight / 2, resistorWidth, resistorHeight);
    ctx.fillStyle = "rgba(247, 37, 133, 0.6)";
    ctx.fillText("R", resistorX, resistorY);

    // Cables
    ctx.strokeStyle = isActive ? "#00f5d4" : "rgba(0, 245, 212, 0.3)";
    ctx.lineWidth = 2;

    // Cable superior
    ctx.beginPath();
    ctx.moveTo(margin + 35, margin + 20);
    ctx.lineTo(W - margin - 35, margin + 20);
    ctx.stroke();

    // Cable inferior
    ctx.beginPath();
    ctx.moveTo(margin + 35, H - margin - 20);
    ctx.lineTo(W - margin - 35, H - margin - 20);
    ctx.stroke();

    // Cables verticales
    ctx.beginPath();
    ctx.moveTo(margin + 35, margin + 20);
    ctx.lineTo(margin + 35, H - margin - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W - margin - 35, margin + 20);
    ctx.lineTo(W - margin - 35, H - margin - 20);
    ctx.stroke();

    // Animar partículas de electrones
    if (isActive) {
      particleRef.current.forEach((particle) => {
        particle.x += speed;
        if (particle.x > W) particle.x = 0;

        ctx.fillStyle = "#00f5d4";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00f5d4";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // Información
    ctx.fillStyle = "rgba(0, 245, 212, 0.7)";
    ctx.textAlign = "left";
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.fillText(`V: ${voltage.toFixed(1)} V`, 10, 20);
    ctx.fillText(`R: ${resistance.toFixed(1)} Ω`, 10, 40);
    ctx.fillText(`I: ${current.toFixed(2)} A`, 10, 60);

    // Potencia: P = V*I
    const power = voltage * current;
    ctx.fillText(`P: ${power.toFixed(1)} W`, 10, 80);

    animRef.current = requestAnimationFrame(draw);
  }, [voltage, resistance, isActive]);

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
