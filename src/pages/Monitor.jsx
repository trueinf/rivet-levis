import { TICKS } from '../data';
import { fmtWin } from '../utils';
import MomentCard from '../components/MomentCard';
import KpiCounter from '../components/KpiCounter';

export default function Monitor({ moments, onOpen, onStudio }) {
  const fresh = [...moments].filter(m => ['new', 'review'].includes(m.status)).sort((a, b) => b.score - a.score);
  const top = [...moments].sort((a, b) => b.score - a.score)[0];
  const byVelocity = [...moments].sort((a, b) => parseInt(b.velocity) - parseInt(a.velocity)).slice(0, 5);
  const awaitingCount = moments.filter(m => ['new', 'review', 'risk'].includes(m.status)).length;

  const detectionMix = [
    ['Vision: product match', 62, 'var(--denim)'],
    ['Vision: logo / Red Tab™', 48, 'var(--wash)'],
    ['Text: explicit mention', 81, 'var(--stitch)'],
    ['Trend / audio context', 37, 'var(--copper)'],
    ['Creator watchlist', 24, 'var(--red)'],
  ];

  const ticksDouble = [...TICKS, ...TICKS];

  return (
    <section className="page">
      <div className="page-head">
        <div className="eyebrow">Live Social Intelligence · TikTok / Instagram / X / Reddit</div>
        <h1>Brand Moment <span className="thin">Monitor</span></h1>
        <p className="page-sub">Every viral post wearing the red tab, caught while it's still climbing. Vision AI spots the product, NLP reads the room, and the hottest moments land in your queue with a recommended play.</p>
      </div>

      {top && (
        <div className="attention">
          <span className="pulse-ring" />
          <p>
            <b>Highest-scoring moment right now:</b> {top.handle} on {top.pname} — activation score <b>{top.score}</b>, velocity {top.velocity}.{' '}
            {fmtWin(top.win) ? <>Peak window closes in <b>{fmtWin(top.win)}</b>.</> : ''}
          </p>
          <button className="btn btn-red" onClick={() => onStudio(top.id)}>Act on it →</button>
        </div>
      )}

      <div className="ticker-wrap" aria-label="Trending now">
        <div className="ticker">
          {ticksDouble.map(([icon, label, val, cls], i) => (
            <span key={i} className="tick">
              {icon} <b className={cls}>{label}</b> {val}
            </span>
          ))}
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Posts scanned · 24h</div>
          <div className="kpi-val"><KpiCounter to={1.84} dec={2} /><span className="unit">M</span></div>
          <div className="kpi-delta up">▲ 12% vs yesterday</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Levi's detections</div>
          <div className="kpi-val"><KpiCounter to={3412} /></div>
          <div className="kpi-delta up">▲ 31% — trend surge</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Queue-worthy moments</div>
          <div className="kpi-val"><KpiCounter to={moments.length} /></div>
          <div className="kpi-delta neut">{awaitingCount} awaiting action</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Median time to detect</div>
          <div className="kpi-val"><KpiCounter to={19} /><span className="unit"> min</span></div>
          <div className="kpi-delta up">▼ from 26 min</div>
        </div>
      </div>

      <div className="pipeline" aria-label="Detection pipeline">
        {[
          ['STAGE 1', 'Ingest', 'Firehose + hashtag, audio & creator watchlists', '● 21.3K posts/min', false],
          ['STAGE 2', 'Vision AI', 'Product, logo, Red Tab™ & stitch recognition', '● 142ms avg', false],
          ['STAGE 3', 'NLP', 'Mentions, sentiment, intent & trend context', '● 14 languages', false],
          ['STAGE 4', 'Score', 'Velocity × reach × brand-fit × safety', '● threshold ≥ 65', false],
          ['STAGE 5', 'Queue', 'Ranked moments with a recommended play', `● ${awaitingCount} awaiting`, true],
        ].map(([num, title, desc, stat, hot]) => (
          <div key={num} className={`pipe-step${hot ? ' hot' : ''}`}>
            <div className="pnum">{num}</div>
            <h4>{title}</h4>
            <p>{desc}</p>
            <div className="pstat" style={hot ? { color: 'var(--red-bright)' } : {}}>{stat}</div>
          </div>
        ))}
      </div>

      <hr className="seam" data-label="Hottest right now · by activation score" />
      <div className="grid-2">
        <div>
          {fresh.map(m => (
            <MomentCard key={m.id} moment={m} onOpen={onOpen} onStudio={onStudio} />
          ))}
        </div>
        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-title"><h3>Velocity Leaders</h3><small>Δ/hr</small></div>
            {byVelocity.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px dashed rgba(224,159,62,.18)', cursor: 'pointer' }} onClick={() => onOpen(m.id)}>
                <span style={{ fontFamily: 'var(--font-d)', fontSize: 16, color: i === 0 ? 'var(--red-bright)' : 'var(--wash)', width: 20 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.handle}</span>
                <span className={`platform-chip ${m.pclass}`} style={{ fontSize: '8.5px' }}>{m.pname}</span>
                <b style={{ fontFamily: 'var(--font-m)', fontSize: '11px', color: 'var(--red-bright)' }}>{m.velocity}</b>
              </div>
            ))}
          </div>
          <div className="panel">
            <div className="panel-title"><h3>Detection Mix · 24h</h3><small>by signal</small></div>
            {detectionMix.map(([label, pct, color]) => (
              <div key={label} className="conf-row">
                <label style={{ flex: '0 0 150px' }}>{label}</label>
                <div className="conf-bar"><i style={{ width: `${pct}%`, background: color }} /></div>
                <b>{pct}%</b>
              </div>
            ))}
            <p style={{ fontFamily: 'var(--font-m)', fontSize: '10px', color: 'var(--canvas-dim)', marginTop: 10 }}>Signals overlap — a moment usually carries 2–3.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
