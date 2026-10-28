import { useEffect, useState } from "react";

// Язык интерфейса главной страницы: предпочтение хранится в браузере.
export type Lang = "ru" | "en";

const KEY = "h2h-lang";

export function getLang(): Lang {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "ru";
  } catch {
    return "ru";
  }
}

export function applyLang(lang: Lang) {
  document.documentElement.lang = lang;
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* приватный режим: язык применится только до перезагрузки */
  }
  applyLang(lang);
  window.dispatchEvent(new Event("h2h-lang-change"));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setState] = useState<Lang>(getLang);

  useEffect(() => {
    const sync = () => setState(getLang());
    window.addEventListener("h2h-lang-change", sync);
    return () => window.removeEventListener("h2h-lang-change", sync);
  }, []);

  return [lang, (l) => setLang(l)];
}
