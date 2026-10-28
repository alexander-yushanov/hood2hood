import { useEffect, useState } from "react";

// Масштаб страницы: предпочтение пользователя, хранится в браузере.
export const ZOOM_LEVELS = [0.8, 0.9, 1, 1.1, 1.25, 1.5] as const;

const KEY = "h2h-zoom";
const DEFAULT_INDEX = 2;

function readIndex(): number {
  try {
    const n = Number(localStorage.getItem(KEY));
    return Number.isInteger(n) && n >= 0 && n < ZOOM_LEVELS.length ? n : DEFAULT_INDEX;
  } catch {
    return DEFAULT_INDEX;
  }
}

export function applyZoom(index: number) {
  document.documentElement.style.zoom = String(ZOOM_LEVELS[index]);
}

export function useZoom(): [number, (i: number) => void] {
  const [index, setIndex] = useState<number>(readIndex);

  useEffect(() => {
    applyZoom(index);
    try {
      localStorage.setItem(KEY, String(index));
    } catch {
      /* приватный режим: масштаб сбросится при перезагрузке */
    }
  }, [index]);

  return [index, setIndex];
}

// Вызывается до рендера, чтобы масштаб применялся сразу после загрузки.
export function initZoom() {
  applyZoom(readIndex());
}
