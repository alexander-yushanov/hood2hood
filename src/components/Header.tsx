import { useEffect, useState } from "react";
import { ArrowRight, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "./ui";
import { useTheme } from "../lib/theme";
import { useLang } from "../lib/i18n";

const links = {
  ru: [
    { href: "#how", label: "Как работает" },
    { href: "#trainer", label: "Тренажёр" },
    { href: "#pricing", label: "Тарифы" },
    { href: "#faq", label: "FAQ" },
    { href: "#/learn", label: "Игры" },
    { href: "#/profile", label: "Профиль" },
  ],
  en: [
    { href: "#how", label: "How it works" },
    { href: "#trainer", label: "Trainer" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "#/learn", label: "Games" },
    { href: "#/profile", label: "Profile" },
  ],
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useTheme();
  const [lang, setLang] = useLang();
  const en = lang === "en";
  const nextTheme = theme === "dark" ? "light" : "dark";
  const navLinks = links[lang];

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
          scrolled || open ? "border-white/80 bg-white/75 shadow-[0_12px_40px_-16px_rgba(30,41,90,.3)]" : "border-transparent bg-transparent"
        }`}
      >
        <div className="shrink-0 whitespace-nowrap">
          <Logo />
        </div>
        <nav className="hidden items-center gap-0.5 md:flex" aria-label={en ? "Main navigation" : "Основная навигация"}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="whitespace-nowrap rounded-xl px-2 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-white hover:text-ink lg:px-3 lg:text-sm">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(en ? "ru" : "en")}
            aria-label={en ? "Switch to Russian" : "Switch to English"}
            title={en ? "Russian" : "English"}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:text-ink"
          >
            <Languages className="h-4 w-4" />
            {en ? "RU" : "EN"}
          </button>
          <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            aria-label={en ? (nextTheme === "dark" ? "Switch to dark theme" : "Switch to light theme") : nextTheme === "dark" ? "Включить тёмную тему" : "Включить светлую тему"}
            title={en ? (nextTheme === "dark" ? "Dark theme" : "Light theme") : nextTheme === "dark" ? "Тёмная тема" : "Светлая тема"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:-translate-y-0.5 hover:text-ink"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <a
            href="#/learn"
            className="group hidden items-center gap-1.5 whitespace-nowrap rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 xl:inline-flex"
          >
            {en ? "Try for free" : "Попробовать бесплатно"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={en ? (open ? "Close menu" : "Open menu") : open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/80 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl animate-pop rounded-2xl p-3 md:hidden">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-white">
              {l.label}
            </a>
          ))}
          <a href="#/textbook" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-white">
            {en ? "Textbook" : "Учебник"}
          </a>
          <a href="#/learn" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
            {en ? "Try for free" : "Попробовать бесплатно"}
          </a>
        </div>
      )}
    </header>
  );
}
