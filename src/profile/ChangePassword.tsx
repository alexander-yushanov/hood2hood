import { useState, type FormEvent } from "react";
import { Check, KeyRound } from "lucide-react";
import { changePassword, useAuth } from "../auth/session";

const INPUT =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

export default function ChangePassword() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setForm({ current: "", next: "", confirm: "" });
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user?.email) {
      setError("Не удалось определить email аккаунта. Войдите снова.");
      return;
    }
    if (form.next.length < 8) {
      setError("Новый пароль — минимум 8 символов.");
      return;
    }
    if (form.next !== form.confirm) {
      setError("Пароли не совпадают.");
      return;
    }
    setBusy(true);
    try {
      await changePassword({ email: user.email, current: form.current, next: form.next });
      setDone(true);
      setOpen(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сменить пароль.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="glass rounded-[28px] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-indigo-500" />
          <p className="eyebrow">Пароль</p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setDone(false);
            }}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 active:scale-[0.98]"
          >
            Изменить пароль
          </button>
        )}
      </div>

      {done && !open && (
        <p role="status" className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          <Check className="h-4 w-4" /> Пароль изменён. Для входа используйте новый пароль.
        </p>
      )}

      {open && (
        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-3" noValidate>
          <div>
            <label htmlFor="pw-current" className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Текущий пароль
            </label>
            <input id="pw-current" type="password" autoComplete="current-password" className={INPUT} value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
          </div>
          <div>
            <label htmlFor="pw-new" className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Новый пароль
            </label>
            <input id="pw-new" type="password" autoComplete="new-password" className={INPUT} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
          </div>
          <div>
            <label htmlFor="pw-confirm" className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Повторите новый пароль
            </label>
            <input id="pw-confirm" type="password" autoComplete="new-password" className={INPUT} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
          {error && (
            <p role="alert" className="text-xs font-bold text-rose-500 sm:col-span-3">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2 sm:col-span-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,.9)] transition duration-200 hover:-translate-y-0.5 disabled:opacity-60 active:scale-[0.98]"
            >
              {busy ? "Сохраняем…" : "Сохранить новый пароль"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:bg-white"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
