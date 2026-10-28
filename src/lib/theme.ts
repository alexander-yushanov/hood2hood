import { useEffect, useState } from "react";

// Тема — это предпочтение интерфейса, а не игровые данные: хранится в браузере и не связана с результатами.
export type Theme = "light" | "dark";

const KEY = "h2h-theme";

export function getTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* приватный режим: тема применится только до перезагрузки */
  }
  applyTheme(theme);
  window.dispatchEvent(new Event("h2h-theme-change"));
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setState] = useState<Theme>(getTheme);

  useEffect(() => {
    const sync = () => setState(getTheme());
    window.addEventListener("h2h-theme-change", sync);
    return () => window.removeEventListener("h2h-theme-change", sync);
  }, []);

  return [theme, (t) => setTheme(t)];
}
