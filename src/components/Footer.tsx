import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Logo } from "./ui";
import { useLang } from "../lib/i18n";

const socials = [{ icon: MessageCircle, label: "VK" }];

function VkQrModal({ onClose }: { onClose: () => void }) {
  const [lang] = useLang();
  const en = lang === "en";
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="vk-qr-title">
      <button type="button" aria-label={en ? "Close dialog" : "Закрыть окно"} onClick={onClose} className="absolute inset-0 animate-fade-in bg-slate-900/35 backdrop-blur-md" />
      <div className="glass relative w-full max-w-xs animate-pop rounded-[28px] p-6 text-center sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={en ? "Close" : "Закрыть"}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:rotate-90 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 id="vk-qr-title" className="text-xl font-extrabold tracking-tight text-ink">
          {en ? "Our VK page" : "Наш ВКонтакте"}
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">{en ? "Point your phone camera at the QR code" : "Наведи камеру телефона на QR-код"}</p>
        <img
          src={import.meta.env.BASE_URL + "uploads/vk-qr.jpg"}
          alt={en ? "QR code to contact us on VK" : "QR-код для связи с нами во ВКонтакте"}
          className="mx-auto mt-5 h-56 w-56 rounded-2xl bg-white object-contain p-2 shadow-md"
        />
      </div>
    </div>
  );
}

export default function Footer() {
  const [qrOpen, setQrOpen] = useState(false);
  const [lang] = useLang();
  const en = lang === "en";
  return (
    <footer className="px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-slate-900 px-6 py-12 text-slate-300 sm:px-10">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/30 blur-[90px]" aria-hidden />
        <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed">
              {en
                ? "The Capital of the Future team builds a safe trainer where people learn to invest without fear and panic."
                : "Команда «Капитал будущего» делает безопасный тренажёр, где учатся инвестировать без страха и паники."}
            </p>
          </div>
          <div className="md:justify-self-end">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">{en ? "Social media" : "Мы в соцсетях"}</p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">
              {en ? "You can contact us on VK." : "Можно связаться с нами во ВКонтакте."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {socials.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setQrOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <s.icon className="h-4 w-4" /> {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-10 border-t border-white/10 pt-6">
          <p className="text-xs font-medium leading-relaxed text-slate-400">
            {en
              ? "Disclaimer: Capital of the Future · AI is an educational platform. All operations in the trainer are carried out with virtual capital on historical data and are not individual investment recommendations. Past results do not guarantee future returns. Trading on a real exchange involves the risk of losing money."
              : "Дисклеймер: Капитал будущего · AI — образовательная платформа. Все операции в тренажёре проводятся на виртуальном капитале на исторических данных и не являются индивидуальной инвестиционной рекомендацией. Прошлые результаты не гарантируют доходность в будущем. Торговля на реальной бирже связана с риском потери средств."}
          </p>
          <p className="mt-4 text-xs font-semibold text-slate-500">
            © {new Date().getFullYear()} {en ? "Capital of the Future" : "Капитал будущего"}. {en ? "All rights reserved." : "Все права защищены."}
          </p>
        </div>
      </div>
      {qrOpen && <VkQrModal onClose={() => setQrOpen(false)} />}
    </footer>
  );
}
