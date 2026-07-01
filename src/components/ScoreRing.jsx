import { scoreColor } from '../utils';

export default function ScoreRing({ moment, size = 54 }) {
  const r = (size / 2) - 4;
  const c = 2 * Math.PI * r;
  const off = c * (1 - moment.score / 100);
  const col = scoreColor(moment.score);
  return (
    <div className="score-ring" style={{ width: size, height: size }} title="Activation score — velocity × reach × brand-fit × safety">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--indigo-700)" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <b style={{ color: col }}>{moment.score}</b>
      <small>score</small>
    </div>
  );
}
