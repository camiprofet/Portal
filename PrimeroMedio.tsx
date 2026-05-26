/* ============================================================
   PrimeroMedio — Cyberpunk Académico
   Osciloscopio interactivo + escala de decibeles
   ============================================================ */
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import { Waves, Volume2, Activity, Play, Square, Mic, MicOff, AlertCircle } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAudioSynthesizer } from "@/hooks/useAudioSynthesizer";
import { useMicrophoneCapture } from "@/hooks/useMicrophoneCapture";
import { SpectrumAnalyzer } from "@/components/SpectrumAnalyzer";

const FISICA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663697524320/aBTgoW33keowB2hYSBvTXc/fisica-bg-oLaFxGErboDSxGiSwo3M64.webp";

const DB_DATA = [
  { db: 0, label: "Umbral de audición", color: "#C0DD97", width: 2 },
  { db: 20, label: "Susurro", color: "#97C459", width: 8 },
  { db: 30, label: "Biblioteca silenciosa", color: "#639922", width: 13 },
  { db: 40, label: "Scooter eléctrico", color: "#3B6D11", width: 19 },
  { db: 55, label: "Límite OMS (salud)", color: "#378ADD", width: 38 },
  { db: 60, label: "DS N°38 nocturno", color: "#EF9F27", width: 48 },
  { db: 65, label: "Restaurante concurrido", color: "#BA7517", width: 57 },
  { db: 70, label: "DS N°38 diurno / Aspiradora", color: "#E24B4A", width: 67 },
  { db: 80, label: "Tráfico intenso", color: "#993535", width: 78 },
  { db: 90, label: "Moto / Daño auditivo", color: "#791F1F", width: 88 },
  { db: 120, label: "Concierto / Umbral de dolor", color: "#501313", width: 100 },
];

const FREQ_RANGES = [
  { title: "Infrasonido", desc: "Debajo del rango audible", value: "< 20 Hz", color: "#7209b7" },
  { title: "Sonido Grave", desc: "Bajos profundos", value: "20 – 250 Hz", color: "#4361ee" },
  { title: "Sonido Medio", desc: "Voces humanas", value: "250 – 2.000 Hz", color: "#00f5d4" },
  { title: "Sonido Agudo", desc: "Notas altas", value: "2.000 – 20.000 Hz", color: "#f72585" },
];

function Oscilloscope({ frequency, amplitude }: { frequency: number; amplitude: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(0, 245, 212, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += W / 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += H / 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = "rgba(0, 245, 212, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

    // Wave - Sincronización correcta con la frecuencia
    const amp = (amplitude / 100) * (H / 2 - 20);
    // Mostrar 2-4 ciclos completos dependiendo de la frecuencia
    // Para frecuencias bajas (20 Hz): 4 ciclos
    // Para frecuencias altas (20000 Hz): 2 ciclos
    const cycleCount = 4 - (Math.log2(frequency / 20) / Math.log2(20000 / 20)) * 2;
    const cycles = Math.max(2, Math.min(cycleCount, 4));
    
    // Velocidad de animación basada en la frecuencia real
    const speed = (frequency / 1000) * 0.02;
    phaseRef.current += speed;

    // Glow effect - Onda fundamental
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00f5d4";
    ctx.strokeStyle = "#00f5d4";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let px = 0; px <= W; px++) {
      // Mapear la frecuencia real a ciclos mostrados
      const normalizedFreq = (frequency - 20) / (20000 - 20); // 0 a 1
      const displayCycles = 2 + normalizedFreq * 2; // 2 a 4 ciclos
      const t = (px / W) * displayCycles * 2 * Math.PI + phaseRef.current;
      const y = H / 2 - amp * Math.sin(t);
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();

    // Second harmonic (faint) - Armónico visible
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#f72585";
    ctx.strokeStyle = "rgba(247, 37, 133, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let px = 0; px <= W; px++) {
      const normalizedFreq = (frequency - 20) / (20000 - 20);
      const displayCycles = 2 + normalizedFreq * 2;
      const t = (px / W) * displayCycles * 4 * Math.PI + phaseRef.current * 2;
      const y = H / 2 - (amp * 0.2) * Math.sin(t);
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();

    ctx.shadowBlur = 0;
    animRef.current = requestAnimationFrame(draw);
  }, [frequency, amplitude]);

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
        height: "280px",
        background: "#030b18",
        border: "1px solid rgba(0, 245, 212, 0.15)",
        display: "block",
      }}
    />
  );
}

function DbBar({ db, label, color, width, index }: { db: number; label: string; color: string; width: number; index: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), index * 80 + 300);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group"
      style={{ background: "rgba(255,255,255,0.02)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 245, 212, 0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
    >
      <span
        className="text-sm font-bold w-14 text-right flex-shrink-0"
        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {db} dB
      </span>
      <div className="flex-1 h-8 rounded relative overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded flex items-center px-3 transition-all duration-700"
          style={{
            width: animated ? `${width}%` : "0%",
            background: color,
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      </div>
      <span className="text-xs w-44 flex-shrink-0" style={{ color: "rgba(255,255,255,0.45)" }}>
        {label}
      </span>
    </div>
  );
}

export default function PrimeroMedio() {
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const audioSynth = useAudioSynthesizer();
  const microphone = useMicrophoneCapture();

  const handlePlayAudio = () => {
    if (isPlaying) {
      audioSynth.stop();
      setIsPlaying(false);
    } else {
      audioSynth.start(frequency, amplitude / 100);
      setIsPlaying(true);
    }
  };

  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    if (isPlaying) {
      audioSynth.update(newFreq, amplitude / 100);
    }
  };

  const handleAmplitudeChange = (newAmp: number) => {
    setAmplitude(newAmp);
    if (isPlaying) {
      audioSynth.update(frequency, newAmp / 100);
    }
  };

  const handleMicrophoneToggle = async () => {
    if (isMicActive) {
      microphone.stop();
      setIsMicActive(false);
    } else {
      if (isPlaying) {
        audioSynth.stop();
        setIsPlaying(false);
      }
      await microphone.initMicrophone();
      if (microphone.isActive) {
        setIsMicActive(true);
      }
    }
  };

  const getFreqCategory = (f: number) => {
    if (f < 20) return { label: "Infrasonido", color: "#7209b7" };
    if (f < 250) return { label: "Grave", color: "#4361ee" };
    if (f < 2000) return { label: "Medio", color: "#00f5d4" };
    return { label: "Agudo", color: "#f72585" };
  };

  const freqCat = getFreqCategory(frequency);

  return (
    <div className="min-h-screen" style={{ background: "#050914" }}>
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative pt-16 overflow-hidden" style={{ minHeight: "320px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${FISICA_BG})`, filter: "brightness(0.2)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(5,9,20,0.5), rgba(5,9,20,1))" }}
        />
        <div className="container relative z-10 py-16">
          <Breadcrumb
            crumbs={[
              { href: "/", label: "Inicio" },
              { href: "/fisica", label: "Física" },
              { label: "Ondas y Sonido" },
            ]}
          />
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(67, 97, 238, 0.15)", border: "1px solid rgba(67, 97, 238, 0.3)" }}
            >
              <Waves size={24} style={{ color: "#7b9ef7" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgba(67, 97, 238, 0.7)", fontFamily: "'JetBrains Mono', monospace" }}>
                // primero medio · física
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Ondas Sonoras
              </h1>
            </div>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Visualiza en tiempo real cómo funcionan las ondas sonoras. Ajusta frecuencia y amplitud, y comprende la escala logarítmica de decibeles.
          </p>
        </div>
      </section>

      {/* ── OSCILOSCOPIO ── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(67, 97, 238, 0.7)", fontFamily: "'JetBrains Mono', monospace" }}>
              // herramienta interactiva
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Osciloscopio en Tiempo Real
            </h2>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(13, 27, 42, 0.8)", border: "1px solid rgba(67, 97, 238, 0.2)" }}
          >
            {/* Canvas */}
            <Oscilloscope frequency={frequency} amplitude={amplitude} />

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Frequency */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Activity size={16} style={{ color: "#00f5d4" }} />
                    Frecuencia
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#00f5d4", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {frequency.toLocaleString("es-CL")} Hz
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: `${freqCat.color}20`, border: `1px solid ${freqCat.color}40`, color: freqCat.color, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {freqCat.label}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={20}
                  max={20000}
                  step={10}
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>20 Hz</span>
                  <span>20.000 Hz</span>
                </div>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  La frecuencia determina el tono: grave (baja) o agudo (alta).
                </p>
              </div>

              {/* Amplitude */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Volume2 size={16} style={{ color: "#f72585" }} />
                    Amplitud / Volumen
                  </label>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#f72585", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {amplitude}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={amplitude}
                  onChange={(e) => handleAmplitudeChange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>silencio</span>
                  <span>máximo</span>
                </div>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  La amplitud controla el volumen. Duplicar amplitud ≈ +6 dB.
                </p>
              </div>
            </div>

            {/* Spectrum Analyzer - Síntesis */}
            {isPlaying && (
              <div className="mt-6 animate-slide-up">
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                  // análisis en tiempo real
                </p>
                <SpectrumAnalyzer
                  audioContext={audioSynth.audioContext}
                  gainNode={audioSynth.gainNode}
                  isPlaying={isPlaying}
                />
              </div>
            )}

            {/* Spectrum Analyzer - Micrófono */}
            {isMicActive && (
              <div className="mt-6 animate-slide-up">
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(247, 37, 133, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                  // captura de micrófono en vivo
                </p>
                <SpectrumAnalyzer
                  audioContext={null}
                  gainNode={null}
                  isPlaying={isMicActive}
                  externalAnalyser={microphone.getAnalyser()}
                />
              </div>
            )}

            {/* Play button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handlePlayAudio}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: isPlaying ? "rgba(247, 37, 133, 0.2)" : "rgba(0, 245, 212, 0.15)",
                  border: isPlaying ? "1px solid rgba(247, 37, 133, 0.4)" : "1px solid rgba(0, 245, 212, 0.3)",
                  color: isPlaying ? "#f72585" : "#00f5d4",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: isPlaying ? "0 0 16px rgba(247, 37, 133, 0.3)" : "0 0 12px rgba(0, 245, 212, 0.2)",
                }}
              >
                {isPlaying ? (
                  <>
                    <Square size={16} fill="currentColor" /> Detener sonido
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" /> Reproducir sonido
                  </>
                )}
              </button>
              {isPlaying && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: "rgba(247, 37, 133, 0.1)", border: "1px solid rgba(247, 37, 133, 0.2)" }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#f72585" }} />
                  <span className="text-xs" style={{ color: "#f72585", fontFamily: "'JetBrains Mono', monospace" }}>Sonido activo</span>
                </div>
              )}
              
              <button
                onClick={handleMicrophoneToggle}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: isMicActive ? "rgba(247, 37, 133, 0.2)" : "rgba(255, 214, 10, 0.12)",
                  border: isMicActive ? "1px solid rgba(247, 37, 133, 0.4)" : "1px solid rgba(255, 214, 10, 0.25)",
                  color: isMicActive ? "#f72585" : "#ffd60a",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: isMicActive ? "0 0 16px rgba(247, 37, 133, 0.3)" : "0 0 12px rgba(255, 214, 10, 0.2)",
                }}
              >
                {isMicActive ? (
                  <>
                    <MicOff size={16} /> Detener micrófono
                  </>
                ) : (
                  <>
                    <Mic size={16} /> Analizar micrófono
                  </>
                )}
              </button>
              {isMicActive && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: "rgba(255, 214, 10, 0.1)", border: "1px solid rgba(255, 214, 10, 0.2)" }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#ffd60a" }} />
                  <span className="text-xs" style={{ color: "#ffd60a", fontFamily: "'JetBrains Mono', monospace" }}>Micrófono activo</span>
                </div>
              )}
              {microphone.error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: "rgba(220, 53, 69, 0.1)", border: "1px solid rgba(220, 53, 69, 0.3)" }}>
                  <AlertCircle size={16} style={{ color: "#dc3545" }} />
                  <span className="text-xs" style={{ color: "#dc3545", fontFamily: "'JetBrains Mono', monospace" }}>{microphone.error}</span>
                </div>
              )}
            </div>

            {/* Info box */}
            <div
              className="mt-6 p-4 rounded-lg"
              style={{ background: "rgba(67, 97, 238, 0.08)", border: "1px solid rgba(67, 97, 238, 0.2)" }}
            >
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span style={{ color: "#00f5d4", fontWeight: 600 }}>💡 Nota:</span>{" "}
                La frecuencia determina el tono (grave o agudo). La amplitud determina el volumen (decibeles).
                Cada vez que duplicas la amplitud, aumentas aproximadamente <span style={{ color: "#ffd60a" }}>6 dB</span>.
                Presiona <strong>Reproducir sonido</strong> para escuchar la onda en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RANGOS DE FRECUENCIA ── */}
      <section className="py-8">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // referencia
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Rangos de Frecuencia
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FREQ_RANGES.map((r) => (
              <div
                key={r.title}
                className="cyber-card rounded-xl p-5 text-center"
                style={{ borderColor: `${r.color}30` }}
              >
                <h4 className="font-bold text-sm mb-1" style={{ color: r.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {r.title}
                </h4>
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{r.desc}</p>
                <div className="text-base font-bold" style={{ color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESCALA DE DECIBELES ── */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(0, 245, 212, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
              // escala logarítmica
            </p>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Escala de Decibeles
            </h2>
            <p className="text-sm max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
              La escala de decibeles es <strong style={{ color: "#ffd60a" }}>logarítmica</strong>, no lineal.
              Cada aumento de 10 dB representa una multiplicación por 10 de la energía acústica,
              pero tu cerebro lo percibe como solo el doble de fuerte.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "rgba(13, 27, 42, 0.6)", border: "1px solid rgba(0, 245, 212, 0.1)" }}
          >
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { color: "#3B6D11", label: "Entorno tranquilo" },
                { color: "#BA7517", label: "Nivel de alerta" },
                { color: "#A32D2D", label: "Zona de daño" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="flex flex-col gap-2">
              {DB_DATA.map((item, i) => (
                <DbBar key={item.db} {...item} index={i} />
              ))}
            </div>

            {/* Key rules */}
            <div
              className="mt-6 p-5 rounded-xl"
              style={{ background: "rgba(0, 245, 212, 0.04)", border: "1px solid rgba(0, 245, 212, 0.1)" }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: "#00f5d4", fontFamily: "'Space Grotesk', sans-serif" }}>
                ⚠️ Reglas Clave
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { badge: "+10 dB", color: "#ffd60a", text: "Energía × 10, pero suena el doble de fuerte" },
                  { badge: "+20 dB", color: "#f72585", text: "Energía × 100, pero suena 4 veces más fuerte" },
                  { badge: "55 → 70 dB", color: "#E24B4A", text: "100 veces más energía, pero solo el doble de ruido percibido" },
                ].map((rule) => (
                  <div key={rule.badge} className="flex items-start gap-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: `${rule.color}15`, border: `1px solid ${rule.color}40`, color: rule.color, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {rule.badge}
                    </span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{rule.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
