/* ============================================================
   SpectrumAnalyzer — FFT Spectrum Visualizer
   Análisis en tiempo real de armónicos y distribución de frecuencias
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";
import { getMusicalNotesInRange, formatNote } from "@/lib/musicNotes";

interface SpectrumAnalyzerProps {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  isPlaying: boolean;
  externalAnalyser?: AnalyserNode | null;
  showNoteLabels?: boolean;
}

export function SpectrumAnalyzer({ audioContext, gainNode, isPlaying, externalAnalyser, showNoteLabels = true }: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(externalAnalyser || null);
  const animRef = useRef<number>(0);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const setupAnalyser = useCallback(() => {
    // Si hay un analizador externo (micrófono), usarlo directamente
    if (externalAnalyser) {
      const bufferLength = externalAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current = externalAnalyser;
      dataArrayRef.current = dataArray;
      return;
    }

    if (!audioContext || !gainNode) return;

    if (analyserRef.current) return; // Ya está configurado

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
  }, [audioContext, gainNode, externalAnalyser]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Fondo
    ctx.fillStyle = "#030b18";
    ctx.fillRect(0, 0, W, H);

    // Grid horizontal (líneas de referencia de dB)
    ctx.strokeStyle = "rgba(0, 245, 212, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (H / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Grid vertical (bandas de frecuencia)
    ctx.strokeStyle = "rgba(0, 245, 212, 0.04)";
    for (let i = 0; i <= 8; i++) {
      const x = (W / 8) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Obtener datos del analizador
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const barWidth = W / dataArrayRef.current.length;
    let x = 0;

    // Dibujar barras de espectro con gradiente
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = dataArrayRef.current[i];
      const percent = value / 255;
      const hue = (i / dataArrayRef.current.length) * 360;

      // Gradiente de color basado en frecuencia
      let color: string;
      if (percent < 0.2) {
        color = `rgba(0, 245, 212, ${percent * 0.3})`;
      } else if (percent < 0.5) {
        color = `rgba(67, 97, 238, ${percent * 0.6})`;
      } else if (percent < 0.8) {
        color = `rgba(247, 37, 133, ${percent * 0.8})`;
      } else {
        color = `rgba(255, 214, 10, ${percent})`;
      }

      ctx.fillStyle = color;
      const barHeight = (percent * H) * 0.95;
      ctx.fillRect(x, H - barHeight, barWidth - 1, barHeight);

      // Glow en picos
      if (percent > 0.7) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fillStyle = `rgba(255, 255, 255, ${(percent - 0.7) * 0.3})`;
        ctx.fillRect(x, H - barHeight - 2, barWidth - 1, 2);
        ctx.shadowBlur = 0;
      }

      x += barWidth;
    }

    // Línea de base
    ctx.strokeStyle = "rgba(0, 245, 212, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(W, H);
    ctx.stroke();

    // Etiquetas de notas musicales
    if (showNoteLabels) {
      const analyser = analyserRef.current;
      const nyquist = (analyser.context.sampleRate || 44100) / 2; // Frecuencia de Nyquist
      const minFreq = 20; // Hz
      const maxFreq = Math.min(nyquist, 20000); // Rango audible

      const notes = getMusicalNotesInRange(minFreq, maxFreq, 10);

      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(0, 245, 212, 0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      for (const note of notes) {
        // Mapear frecuencia a posición X en el canvas
        const freqPercent = (Math.log2(note.frequency) - Math.log2(minFreq)) / 
                           (Math.log2(maxFreq) - Math.log2(minFreq));
        const xPos = freqPercent * W;

        // Dibujar línea vertical punteada
        ctx.strokeStyle = "rgba(0, 245, 212, 0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, H - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Dibujar etiqueta de nota
        const label = formatNote(note);
        ctx.fillText(label, xPos, H - 16);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [showNoteLabels]);

  useEffect(() => {
    if (isPlaying || externalAnalyser) {
      setupAnalyser();
    }
  }, [isPlaying, externalAnalyser, setupAnalyser]);

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

    if (isPlaying || externalAnalyser) {
      animRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [isPlaying, externalAnalyser, draw]);

  return (
    <div className="w-full">
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
      <div className="flex justify-between items-center mt-2 px-1">
        <span className="text-xs" style={{ color: "rgba(0, 245, 212, 0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
          Bajos
        </span>
        <span className="text-xs" style={{ color: "rgba(0, 245, 212, 0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
          Espectro de Frecuencias (FFT)
        </span>
        <span className="text-xs" style={{ color: "rgba(0, 245, 212, 0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
          Agudos
        </span>
      </div>
    </div>
  );
}
