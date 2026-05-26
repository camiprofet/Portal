/* ============================================================
   useAudioSynthesizer — Web Audio API
   Síntesis de ondas sinusoidales en tiempo real
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";
import * as React from "react";

export function useAudioSynthesizer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const [audioState, setAudioState] = React.useState<{ audioContext: AudioContext | null; gainNode: GainNode | null }>({
    audioContext: null,
    gainNode: null,
  });

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0; // Comienza silencioso

    audioContextRef.current = audioContext;
    gainNodeRef.current = gainNode;
  }, []);

  const start = useCallback(
    (frequency: number = 440, amplitude: number = 0.3) => {
      if (!audioContextRef.current) initAudio();
      if (!audioContextRef.current || !gainNodeRef.current) return;

      // Si ya está tocando, actualiza parámetros
      if (isPlayingRef.current) {
        if (oscillatorRef.current) {
          oscillatorRef.current.frequency.setTargetAtTime(
            frequency,
            audioContextRef.current.currentTime,
            0.01
          );
        }
        gainNodeRef.current.gain.setTargetAtTime(
          amplitude * 0.1,
          audioContextRef.current.currentTime,
          0.01
        );
        return;
      }

      // Crea nuevo oscilador
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNodeRef.current);

      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(
        amplitude * 0.1,
        audioContextRef.current.currentTime + 0.05
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillatorRef.current = oscillator;
      isPlayingRef.current = true;
    },
    [initAudio]
  );

  const update = useCallback((frequency: number, amplitude: number) => {
    if (!audioContextRef.current || !oscillatorRef.current || !gainNodeRef.current) return;

    oscillatorRef.current.frequency.setTargetAtTime(
      frequency,
      audioContextRef.current.currentTime,
      0.01
    );
    gainNodeRef.current.gain.setTargetAtTime(
      amplitude * 0.1,
      audioContextRef.current.currentTime,
      0.01
    );
  }, []);

  const stop = useCallback(() => {
    if (!audioContextRef.current || !oscillatorRef.current || !gainNodeRef.current) return;

    gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.1);

    setTimeout(() => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop(audioContextRef.current!.currentTime);
        oscillatorRef.current = null;
      }
      isPlayingRef.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        stop();
      }
    };
  }, [stop]);

  useEffect(() => {
    setAudioState({
      audioContext: audioContextRef.current,
      gainNode: gainNodeRef.current,
    });
  }, []);

  return {
    start,
    update,
    stop,
    isPlaying: isPlayingRef.current,
    audioContext: audioContextRef.current,
    gainNode: gainNodeRef.current,
  };
}
