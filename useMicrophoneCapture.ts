/* ============================================================
   useMicrophoneCapture — Microphone Input Capture
   Captura de audio del micrófono para análisis en tiempo real
   ============================================================ */
import { useEffect, useRef, useCallback, useState } from "react";

export function useMicrophoneCapture() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const initMicrophone = useCallback(async () => {
    try {
      setError(null);

      // Solicitar permiso del micrófono
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      setPermission("granted");

      // Crear contexto de audio si no existe
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Crear nodo fuente del micrófono
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaStreamSource(stream);
      }

      // Crear analizador
      if (!analyserRef.current) {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.85;
        sourceRef.current.connect(analyser);
        analyserRef.current = analyser;
      }

      setIsActive(true);
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setPermission("denied");
          setError("Permiso de micrófono denegado. Por favor, habilita el acceso al micrófono en la configuración del navegador.");
        } else if (err.name === "NotFoundError") {
          setError("No se encontró micrófono en este dispositivo.");
        } else {
          setError(`Error al acceder al micrófono: ${err.message}`);
        }
      } else {
        setError("Error desconocido al acceder al micrófono.");
      }
      setIsActive(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const getAnalyser = useCallback(() => {
    return analyserRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (isActive) {
        stop();
      }
    };
  }, [isActive, stop]);

  return {
    initMicrophone,
    stop,
    isActive,
    error,
    permission,
    getAnalyser,
  };
}
