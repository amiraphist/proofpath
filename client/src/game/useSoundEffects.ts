// ProofPath style reminder: Paper Playground, tiny friendly sounds, never loud or distracting.

import { useCallback, useRef, useState } from "react";

type SoundName = "tap" | "connect-start" | "connect-done" | "error" | "delete" | "success";

export function useSoundEffects() {
  const audioRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const play = useCallback((name: SoundName) => {
    if (muted || typeof window === "undefined") return;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const context = audioRef.current ?? new AudioCtor();
    audioRef.current = context;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, now + (name === "success" ? 0.42 : 0.16));
    master.connect(context.destination);

    const notes: Record<SoundName, number[]> = {
      tap: [330],
      "connect-start": [392],
      "connect-done": [523],
      error: [180, 145],
      delete: [240, 190],
      success: [392, 523, 659],
    };
    notes[name].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = name === "error" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.07);
      gain.gain.setValueAtTime(0.0001, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.7, now + index * 0.07 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + (name === "success" ? 0.18 : 0.1));
      oscillator.connect(gain).connect(master);
      oscillator.start(now + index * 0.07);
      oscillator.stop(now + index * 0.07 + 0.22);
    });
  }, [muted]);

  return { muted, setMuted, play };
}
