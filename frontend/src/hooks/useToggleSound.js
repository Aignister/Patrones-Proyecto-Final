import { useRef } from "react";

import SoundMaster from "../sounds/master_on.mp3";
import SoundWindows from "../sounds/windows_on.mp3";
import SoundDoors from "../sounds/doors_on.mp3";
import SoundSeatbelt from "../sounds/seatbelt_on.mp3";
import SoundSpeed from "../sounds/speed_on.mp3";

const SOUNDS = {
  master: SoundMaster,
  windows: SoundWindows,
  doors: SoundDoors,
  seatbelt: SoundSeatbelt,
  speed: SoundSpeed,
};

export function useToggleSound() {
  const ctxRef = useRef(null);
  const bufferCache = useRef({});

  function getContext() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }

  async function playSound(key) {
    const src = SOUNDS[key];
    if (!src) return;

    try {
      const ctx = getContext();

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (!bufferCache.current[src]) {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        bufferCache.current[src] = await ctx.decodeAudioData(arrayBuffer);
      }

      const source = ctx.createBufferSource();
      source.buffer = bufferCache.current[src];
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // Archivo no encontrado o contexto bloqueado 
    }
  }

  const playMaster = (willBeOn) => {
    if (willBeOn) playSound("master");
  };

  const playControl = (key, willBeOn) => {
    if (willBeOn) playSound(key);
  };

  return { playMaster, playControl };
}