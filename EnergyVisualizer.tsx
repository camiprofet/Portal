/* ============================================================
   EnergyVisualizer — Energía Cinética y Potencial
   Visualización de transformación de energía
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

interface EnergyVisualizerProps {
  height: number;
  mass: number;
  isDropping: boolean;
}

export function EnergyVisualizer({ height, mass, isDropping }: EnergyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const positionRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const g = 9.8; // Gravedad

    // Fondo
    ctx.fillStyle = "#030b18";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(0, 245, 212, 0.06)";
    ctx.lineWidth = 1;
    for (let y = 0; y <= H; y += H / 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    if (isDropping) {
      timeRef.current += 0.016;
      // y = h - 0.5*g*t²
      positionRef.current = Math.max(0, height - 0.5 * g * timeRef.current * timeRef.current);

      if (positionRef.current <= 0) {
        timeRef.current = 0;
        positionRef.current = height;
      }
    } else {
      timeRef.current = 0;
      positionRef.current = height;
    }

    // Escala: mapear altura a píxeles
    const maxHeight = 100; // metros
    const pixelHeight = (positionRef.current / maxHeight) * (H - 40);
    const ballY = H - 20 - pixelHeight;

    // Energía potencial: Ep = m*g*h
    const Ep = mass * g * positionRef.current;
    // Energía cinética: Ek = 0.5*m*v²
    const velocity = g * timeRef.current;
    const Ek = 0.5 * mass * velocity * velocity;
    // Energía total
    const Et = Ep + Ek;
    const maxEnergy = mass * g * height;

    // Barras de energía
    const barWidth = 60;
    const barHeight = 120;
    const epPercent = Et > 0 ? (Ep / maxEnergy) * 100 : 0;
    const ekPercent = Et > 0 ? (Ek / maxEnergy) * 100 : 0;

    // Barra de energía potencial (cian)
    ctx.fillStyle = "rgba(0, 245, 212, 0.2)";
    ctx.fillRect(W / 2 - 100, H - 30 - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#00f5d4";
    ctx.fillRect(W / 2 - 100, H - 30 - (barHeight * epPercent) / 100, barWidth, (barHeight * epPercent) / 100);
    ctx.fillStyle = "rgba(0, 245, 212, 0.6)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Ep", W / 2 - 70, H - 5);

    // Barra de energía cinética (magenta)
    ctx.fillStyle = "rgba(247, 37, 133, 0.2)";
    ctx.fillRect(W / 2 - 20, H - 30 - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#f72585";
    ctx.fillRect(W / 2 - 20, H - 30 - (barHeight * ekPercent) / 100, barWidth, (barHeight * ekPercent) / 100);
    ctx.fillStyle = "rgba(247, 37, 133, 0.6)";
    ctx.fillText("Ek", W / 2 + 10, H - 5);

    // Barra de energía total (amarillo)
    ctx.fillStyle = "rgba(255, 214, 10, 0.2)";
    ctx.fillRect(W / 2 + 60, H - 30 - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#ffd60a";
    ctx.fillRect(W / 2 + 60, H - 30 - barHeight, barWidth, barHeight);
    ctx.fillStyle = "rgba(255, 214, 10, 0.6)";
    ctx.fillText("Et", W / 2 + 90, H - 5);

    // Objeto cayendo
    ctx.fillStyle = "#00f5d4";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00f5d4";
    ctx.beginPath();
    ctx.arc(W / 4, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Línea de altura
    ctx.strokeStyle = "rgba(0, 245, 212, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(W / 4 - 30, ballY);
    ctx.lineTo(W / 4 + 30, ballY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Info
    ctx.fillStyle = "rgba(0, 245, 212, 0.7)";
    ctx.textAlign = "left";
    ctx.fillText(`h: ${positionRef.current.toFixed(1)} m`, 10, 20);
    ctx.fillText(`v: ${velocity.toFixed(1)} m/s`, 10, 40);
    ctx.fillText(`Ep: ${Ep.toFixed(0)} J`, 10, 60);
    ctx.fillText(`Ek: ${Ek.toFixed(0)} J`, 10, 80);

    animRef.current = requestAnimationFrame(draw);
  }, [height, mass, isDropping]);

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
