/* ============================================================
   MovementVisualizerAdvanced — Cinemática con Gráficos
   Visualización de movimiento + gráficos v/t, x/t, a/t
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

interface MovementVisualizerAdvancedProps {
  initialVelocity: number;
  acceleration: number;
  isRunning: boolean;
}

interface DataPoint {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
}

export function MovementVisualizerAdvanced({
  initialVelocity,
  acceleration,
  isRunning,
}: MovementVisualizerAdvancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const positionRef = useRef(50);
  const dataPointsRef = useRef<DataPoint[]>([]);

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

      // Calcular velocidad y aceleración actuales
      const currentVelocity = initialVelocity + acceleration * timeRef.current;
      const currentAcceleration = acceleration;

      // Guardar punto de datos
      dataPointsRef.current.push({
        time: timeRef.current,
        position: positionRef.current,
        velocity: currentVelocity,
        acceleration: currentAcceleration,
      });

      // Limitar a últimos 300 puntos para performance
      if (dataPointsRef.current.length > 300) {
        dataPointsRef.current.shift();
      }

      // Reset si sale del canvas
      if (positionRef.current >= W - 30 || positionRef.current <= 0) {
        timeRef.current = 0;
        positionRef.current = 50;
        dataPointsRef.current = [];
      }
    } else {
      dataPointsRef.current = [];
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

  const drawGraphs = useCallback(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const graphHeight = H / 3;

    // Fondo
    ctx.fillStyle = "#030b18";
    ctx.fillRect(0, 0, W, H);

    if (dataPointsRef.current.length < 2) return;

    // Encontrar rangos de datos
    const times = dataPointsRef.current.map((p) => p.time);
    const positions = dataPointsRef.current.map((p) => p.position);
    const velocities = dataPointsRef.current.map((p) => p.velocity);
    const accelerations = dataPointsRef.current.map((p) => p.acceleration);

    const maxTime = Math.max(...times);
    const maxPos = Math.max(...positions, 100);
    const minPos = Math.min(...positions, 0);
    const maxVel = Math.max(...velocities.map(Math.abs), 50);
    const maxAcc = Math.max(...accelerations.map(Math.abs), 10);

    const padding = 30;
    const graphWidth = W - 2 * padding;

    // Función para dibujar un gráfico
    const drawGraph = (
      yOffset: number,
      data: number[],
      maxValue: number,
      minValue: number,
      color: string,
      label: string,
      unit: string
    ) => {
      // Fondo del gráfico
      ctx.fillStyle = "rgba(0, 245, 212, 0.03)";
      ctx.fillRect(padding, yOffset, graphWidth, graphHeight);

      // Borde
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, yOffset, graphWidth, graphHeight);

      // Grid horizontal
      ctx.strokeStyle = `${color}15`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = yOffset + (graphHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + graphWidth, y);
        ctx.stroke();
      }

      // Eje Y
      ctx.strokeStyle = `${color}30`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, yOffset);
      ctx.lineTo(padding, yOffset + graphHeight);
      ctx.stroke();

      // Eje X
      ctx.beginPath();
      ctx.moveTo(padding, yOffset + graphHeight);
      ctx.lineTo(padding + graphWidth, yOffset + graphHeight);
      ctx.stroke();

      // Dibujar línea de datos
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * graphWidth;
        const normalizedValue = (data[i] - minValue) / (maxValue - minValue || 1);
        const y = yOffset + graphHeight - normalizedValue * graphHeight;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Etiqueta
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.fillText(`${label} (${unit})`, padding + 5, yOffset + 15);

      // Valores min/max
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = `${color}80`;
      ctx.textAlign = "right";
      ctx.fillText(`${maxValue.toFixed(1)}`, padding + graphWidth - 5, yOffset + 12);
      ctx.fillText(`${minValue.toFixed(1)}`, padding + graphWidth - 5, yOffset + graphHeight - 3);
    };

    // Gráfico x/t
    drawGraph(0, positions, maxPos, minPos, "#00f5d4", "Posición", "m");

    // Gráfico v/t
    drawGraph(graphHeight, velocities, maxVel, -maxVel, "#4361ee", "Velocidad", "m/s");

    // Gráfico a/t
    drawGraph(graphHeight * 2, accelerations, maxAcc, -maxAcc, "#f72585", "Aceleración", "m/s²");

    // Etiqueta de tiempo en eje X (solo para el último gráfico)
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "right";
    ctx.fillText(`${maxTime.toFixed(1)}s`, padding + graphWidth - 5, H - 5);
  }, []);

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

  useEffect(() => {
    const graphCanvas = graphCanvasRef.current;
    if (!graphCanvas) return;

    const resize = () => {
      graphCanvas.width = graphCanvas.offsetWidth;
      graphCanvas.height = graphCanvas.offsetHeight;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(graphCanvas);

    const animId = setInterval(() => {
      drawGraphs();
    }, 50);

    return () => {
      clearInterval(animId);
      observer.disconnect();
    };
  }, [drawGraphs]);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Movimiento del Objeto
        </h4>
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
      </div>

      <div>
        <h4 className="text-sm font-medium text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Gráficos en Tiempo Real
        </h4>
        <canvas
          ref={graphCanvasRef}
          className="w-full rounded-lg"
          style={{
            height: "300px",
            background: "#030b18",
            border: "1px solid rgba(0, 245, 212, 0.15)",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
