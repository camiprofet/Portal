/* ============================================================
   OpticsVisualizer — Óptica: Refracción y Reflexión
   Visualización de rayos de luz en diferentes medios
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

interface OpticsVisualizerProps {
  angle: number;
  opticsType: "refraction" | "reflection";
  refractiveIndex: number;
}

export function OpticsVisualizer({ angle, opticsType, refractiveIndex }: OpticsVisualizerProps) {
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

    const interfaceY = H / 2;

    if (opticsType === "refraction") {
      // Medio 1 (aire)
      ctx.fillStyle = "rgba(0, 245, 212, 0.05)";
      ctx.fillRect(0, 0, W, interfaceY);

      // Medio 2 (agua/vidrio)
      ctx.fillStyle = "rgba(67, 97, 238, 0.05)";
      ctx.fillRect(0, interfaceY, W, H / 2);

      // Interfaz
      ctx.strokeStyle = "rgba(0, 245, 212, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, interfaceY);
      ctx.lineTo(W, interfaceY);
      ctx.stroke();

      // Rayo incidente
      const startX = W / 4;
      const startY = 20;
      const incidentAngle = (angle * Math.PI) / 180;
      const incidentLength = 150;

      ctx.strokeStyle = "#ffd60a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + incidentLength * Math.sin(incidentAngle),
        interfaceY - incidentLength * Math.cos(incidentAngle)
      );
      ctx.stroke();

      // Normal
      ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rayo refractado (Ley de Snell: n1*sin(θ1) = n2*sin(θ2))
      const n1 = 1; // aire
      const n2 = refractiveIndex;
      const sinRefracted = (n1 * Math.sin(incidentAngle)) / n2;
      const refractedAngle = Math.asin(Math.max(-1, Math.min(1, sinRefracted)));
      const refractedLength = 150;

      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, interfaceY);
      ctx.lineTo(
        startX + refractedLength * Math.sin(refractedAngle),
        interfaceY + refractedLength * Math.cos(refractedAngle)
      );
      ctx.stroke();

      // Información
      ctx.fillStyle = "rgba(0, 245, 212, 0.7)";
      ctx.textAlign = "left";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText(`θ incidente: ${angle.toFixed(1)}°`, 10, 20);
      ctx.fillText(`θ refractado: ${((refractedAngle * 180) / Math.PI).toFixed(1)}°`, 10, 40);
      ctx.fillText(`n₂: ${refractiveIndex.toFixed(2)}`, 10, 60);
    } else {
      // Reflexión
      ctx.fillStyle = "rgba(247, 37, 133, 0.05)";
      ctx.fillRect(0, interfaceY - 5, W, 10);

      // Espejo
      ctx.strokeStyle = "#f72585";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, interfaceY);
      ctx.lineTo(W, interfaceY);
      ctx.stroke();

      // Rayo incidente
      const startX = W / 4;
      const startY = 20;
      const incidentAngle = (angle * Math.PI) / 180;
      const incidentLength = 150;

      ctx.strokeStyle = "#ffd60a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + incidentLength * Math.sin(incidentAngle),
        interfaceY - incidentLength * Math.cos(incidentAngle)
      );
      ctx.stroke();

      // Normal
      ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rayo reflejado (Ángulo de incidencia = Ángulo de reflexión)
      const reflectedLength = 150;
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, interfaceY);
      ctx.lineTo(
        startX + reflectedLength * Math.sin(incidentAngle),
        interfaceY + reflectedLength * Math.cos(incidentAngle)
      );
      ctx.stroke();

      // Información
      ctx.fillStyle = "rgba(0, 245, 212, 0.7)";
      ctx.textAlign = "left";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText(`θ incidente: ${angle.toFixed(1)}°`, 10, 20);
      ctx.fillText(`θ reflejado: ${angle.toFixed(1)}°`, 10, 40);
      ctx.fillText("Ley: θᵢ = θᵣ", 10, 60);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [angle, opticsType, refractiveIndex]);

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
