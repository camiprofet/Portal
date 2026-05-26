/* ============================================================
   MovementVisualizer — Cinemática Interactiva
   Visualización de movimiento, velocidad y aceleración
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

interface MovementVisualizerProps {
  initialVelocity: number;
  acceleration: number;
  isRunning: boolean;
}

export function MovementVisualizer({ initialVelocity, acceleration, isRunning }: MovementVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const positionRef = useRef(50);

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

    // Grid
    ctx.strokeStyle = "rgba(0, 245, 212, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += W / 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Línea de referencia (carril)
    ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    if (isRunning) {
      timeRef.current += 0.016; // ~60fps
      // Ecuación: x = x0 + v*t + 0.5*a*t²
      const displacement = initialVelocity * timeRef.current + 0.5 * acceleration * timeRef.current * timeRef.current;
      positionRef.current = Math.max(0, Math.min(W - 30, 50 + displacement / 10));

      // Reset si sale del canvas
      if (positionRef.current >= W - 30 || positionRef.current <= 0) {
        timeRef.current = 0;
        positionRef.current = 50;
      }
    }

    // Objeto (círculo)
    ctx.fillStyle = "#00f5d4";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00f5d4";
    ctx.beginPath();
    ctx.arc(positionRef.current, H / 2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Vector de velocidad
    const velocity = initialVelocity + acceleration * timeRef.current;
    const arrowLength = Math.min(80, Math.abs(velocity) * 5);
    const arrowColor = velocity > 0 ? "#4361ee" : "#f72585";

    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(positionRef.current, H / 2 - 30);
    ctx.lineTo(positionRef.current + (velocity > 0 ? arrowLength : -arrowLength), H / 2 - 30);
    ctx.stroke();

    // Punta de flecha
    const headlen = 8;
    const angle = velocity > 0 ? 0 : Math.PI;
    ctx.beginPath();
    ctx.moveTo(positionRef.current + (velocity > 0 ? arrowLength : -arrowLength), H / 2 - 30);
    ctx.lineTo(
      positionRef.current + (velocity > 0 ? arrowLength : -arrowLength) - headlen * Math.cos(angle - Math.PI / 6),
      H / 2 - 30 - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(positionRef.current + (velocity > 0 ? arrowLength : -arrowLength), H / 2 - 30);
    ctx.lineTo(
      positionRef.current + (velocity > 0 ? arrowLength : -arrowLength) - headlen * Math.cos(angle + Math.PI / 6),
      H / 2 - 30 - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Info
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(0, 245, 212, 0.7)";
    ctx.textAlign = "left";
    ctx.fillText(`t: ${timeRef.current.toFixed(2)}s`, 10, 20);
    ctx.fillText(`v: ${velocity.toFixed(1)} m/s`, 10, 40);
    ctx.fillText(`x: ${(50 + positionRef.current).toFixed(1)} m`, 10, 60);

    animRef.current = requestAnimationFrame(draw);
  }, [initialVelocity, acceleration, isRunning]);

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
