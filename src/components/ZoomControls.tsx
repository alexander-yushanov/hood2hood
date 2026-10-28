import { Minus, Plus } from "lucide-react";
import { ZOOM_LEVELS, useZoom } from "../lib/zoom";
import { useLang } from "../lib/i18n";

export default function ZoomControls() {
  const [index, setIndex] = useZoom();
  const [lang] = useLang();
  const en = lang === "en";
  const canZoomOut = index > 0;
  const canZoomIn = index < ZOOM_LEVELS.length - 1;
  const percent = Math.round(ZOOM_LEVELS[index] * 100);

  const btn =
    "grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className="glass fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-2xl p-1 shadow-[0_12px_30px_-12px_rgba(30,41,90,.35)]"
      role="group"
      aria-label={en ? "Page zoom" : "Масштаб страницы"}
    >
      <button
        type="button"
        onClick={() => setIndex(index - 1)}
        disabled={!canZoomOut}
        aria-label={en ? "Zoom out" : "Уменьшить масштаб"}
        title={en ? "Zoom out" : "Уменьшить"}
        className={btn}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[3.25rem] text-center text-xs font-bold tabular-nums text-slate-600" aria-live="polite">
        {percent}%
      </span>
      <button
        type="button"
        onClick={() => setIndex(index + 1)}
        disabled={!canZoomIn}
        aria-label={en ? "Zoom in" : "Увеличить масштаб"}
        title={en ? "Zoom in" : "Увеличить"}
        className={btn}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
