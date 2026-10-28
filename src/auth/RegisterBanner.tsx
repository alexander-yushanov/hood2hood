import { Sparkles } from "lucide-react";
import { useAuth } from "./session";
import { useLang } from "../lib/i18n";

// Плашка для гостей на главной: регистрация не обязательна, она открывает форму по кнопке.
export default function RegisterBanner() {
  const { user, ready } = useAuth();
  const [lang] = useLang();
  const en = lang === "en";
  if (!ready || user) return null;
  return (
    <div className="mx-auto mb-6 mt-2 flex max-w-6xl flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-[0_12px_30px_-18px_rgba(79,70,229,.5)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        {en ? "Sign up to save your progress and see statistics" : "Зарегистрируйся, чтобы сохранять прогресс и видеть статистику"}
      </p>
      <a href="#/auth" className="btn-primary shrink-0 justify-center px-5 py-2.5 text-sm">
        {en ? "Create profile" : "Создать профиль"}
      </a>
    </div>
  );
}
