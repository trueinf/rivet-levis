import ScoreRing from './ScoreRing';
import SparkLine from './SparkLine';
import StatusTab from './StatusTab';
import SentimentBadge from './SentimentBadge';
import WindowChip from './WindowChip';

export default function MomentCard({ moment: m, incoming = false, onOpen, onStudio }) {
  const isRisk = m.status === 'risk';
  return (
    <article
      className={`moment-card${incoming ? ' incoming' : ''}`}
      onClick={() => onOpen(m.id)}
      tabIndex={0}
      role="button"
      onKeyDown={e => e.key === 'Enter' && onOpen(m.id)}
      aria-label={`Open moment ${m.id}, score ${m.score}`}
    >
      <StatusTab status={m.status} />
      <div className="mc-row">
        <ScoreRing moment={m} />
        <div className="mc-body">
          <div className="mc-handle">
            <b>{m.handle}</b>
            <span className={`platform-chip ${m.pclass}`}>{m.pname}</span>
            <SentimentBadge sentiment={m.sentiment} />
            <span style={{ fontFamily: 'var(--font-m)', fontSize: '10.5px', color: 'var(--canvas-dim)' }}>· {m.age} ago</span>
          </div>
          <p className="mc-text">{m.text}</p>
          <div className="mc-meta">
            <span>👁 <b>{m.views}</b></span>
            <span>⚡ <b style={{ color: 'var(--red-bright)' }}>{m.velocity}</b></span>
            <WindowChip moment={m} />
          </div>
          <div className="mc-foot">
            <div className="detect-chips">
              {m.vision.slice(0, 2).map((v, i) => (
                <span key={i} className="dchip vision">👁 {v[0]}{v[1] != null ? ` · ${v[1]}%` : ''}</span>
              ))}
            </div>
            <button className="quick-act" onClick={e => { e.stopPropagation(); onStudio(m.id); }}>
              {isRisk ? 'Route to CX →' : 'Draft Response →'}
            </button>
          </div>
        </div>
        <SparkLine arr={m.spark} />
      </div>
    </article>
  );
}
