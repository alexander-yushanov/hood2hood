import { TICKS_PER_MOVE } from "./scenarios";

const W = 640;
const H = 280;
const PAD = { l: 12, r: 16, t: 22, b: 22 };

type Props = { series: number[]; move: number; start: number };

export default function PriceChart({ series, move, start }: Props) {
  const last = Math.min(move * TICKS_PER_MOVE, series.length - 1);
  const pts = series.slice(0, last + 1);
  const min = Math.min(...series) - 2;
  const max = Math.max(...series) + 2;
  const x = (i: number) => PAD.l + (i / (series.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);

  const line = pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(last).toFixed(1)} ${H - PAD.b} L${x(0).toFixed(1)} ${H - PAD.b} Z`;
  const cur = series[last];
  const down = cur < start;
  const color = down ? "#f43f5e" : "#10b981";
  const gid = down ? "gDown" : "gUp";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="График цены акции">
      <defs>
        <linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10b981" stopOpacity=".25" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f43f5e" stopOpacity=".22" />
          <stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <line key={t} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + t * (H - PAD.t - PAD.b)} y2={PAD.t + t * (H - PAD.t - PAD.b)} stroke="#cbd5e1" strokeOpacity=".6" strokeDasharray="3 6" />
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={y(start)} y2={y(start)} stroke="#94a3b8" strokeDasharray="4 5" strokeOpacity=".8" />
      <text x={W - PAD.r} y={y(start) - 6} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
        старт {start.toFixed(1).replace(".", ",")}
      </text>
      {pts.length > 1 && (
        <>
          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      <circle cx={x(last)} cy={y(cur)} r="10" fill={color} opacity=".2" className="animate-ping2" />
      <circle cx={x(last)} cy={y(cur)} r="5" fill="#fff" stroke={color} strokeWidth="2.5" />
    </svg>
  );
}
