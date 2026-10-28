import { Languages } from "lucide-react";
import { useLang } from "../lib/i18n";

// Переключатель языка для любой страницы. Выбор хранится в браузере, поэтому переживает переход между экранами.
export default function LangToggle({ className = "" }: { className?: string }) {
  const [lang, setLang] = useLang();
  const en = lang === "en";
  return (
    <button
      type="button"
      onClick={() => setLang(en ? "ru" : "en")}
      aria-label={en ? "Switch to Russian" : "Switch to English"}
      title={en ? "Russian" : "English"}
      className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:text-ink ${className}`}
    >
      <Languages className="h-4 w-4" />
      {en ? "RU" : "EN"}
    </button>
  );
}
