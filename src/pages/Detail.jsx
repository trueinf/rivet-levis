import ScoreRing from '../components/ScoreRing';
import SparkLine from '../components/SparkLine';
import StatusTab from '../components/StatusTab';
import SentimentBadge from '../components/SentimentBadge';
import WindowChip from '../components/WindowChip';
import PostVisual from '../components/PostVisual';
import { fmtWin, scoreColor } from '../utils';

const STEPS = ['Detected', 'In Review', 'Draft', 'Scheduled', 'Published'];
const STEP_IDX = { new: 0, review: 1, draft: 2, sched: 3, pub: 4, risk: 1 };

function Stepper({ moment: m }) {
  if (m.status === 'risk') {
    return (
      <div className="stepper">
        {['Detected', 'Risk Flagged', 'CX Routed', 'Resolved'].map((s, i) => (
          <div key={s} className={`step${i < 1 ? ' done' : i === 1 ? ' current' : ''}`}>{s}</div>
        ))}
      </div>
    );
  }
  const cur = STEP_IDX[m.status];
  return (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <div key={s} className={`step${i < cur ? ' done' : i === cur ? ' current' : ''}`}>{s}</div>
      ))}
    </div>
  );
}

function WhyLine({ moment: m }) {
  const w = fmtWin(m.win);
  const col = scoreColor(m.score);
  return (
    <div className="why">
      <b>Why this surfaced</b>
      Scored{' '}
      <span style={{ color: col, fontFamily: 'var(--font-d)', fontSize: 15 }}>{m.score}/100</span>
      {' '}— {m.nlp[0][1]} detected with {m.vision[0][1] ?? 'high'}% vision confidence,{' '}
      {m.velocity} velocity across {m.followers} reach,{' '}
      {m.sentiment === 'neg' ? 'negative sentiment (risk-routed)' : 'positive brand-fit'}.{' '}
      {w ? <>Peak window closes in {w}.</> : 'Velocity has settled — this is now an evergreen play.'}
    </div>
  );
}

export default function Detail({ moment: m, onBack, onStudio, onDismiss }) {
  if (!m) return null;

  return (
    <section className="page">
      <div className="crumb">
        <a onClick={onBack}>Queue</a> / {m.id} · {m.handle}
      </div>
      <button className="back-btn" onClick={onBack}>← Back to Queue</button>
      <div className="page-head detail-head">
        <div className="detail-head-info">
          <div className="eyebrow">{m.id} · Detected {m.age} ago · {m.pname}</div>
          <h1 style={{ fontSize: 28 }}>{m.handle} <span className="thin">· {m.name}</span></h1>
          <div className="detail-meta-row">
            <SentimentBadge sentiment={m.sentiment} />
            <span className={`platform-chip ${m.pclass}`}>{m.pname}</span>
            <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--wash)' }}>{m.followers} reach</span>
            <WindowChip moment={m} />
          </div>
        </div>
        <div className="detail-head-badge">
          <ScoreRing moment={m} size={64} />
          <StatusTab status={m.status} isStatic />
        </div>
      </div>

      <Stepper moment={m} />
      <WhyLine moment={m} />

      <div className="detail-grid">
        <div>
          <div className="post-mock">
            <PostVisual moment={m} />
            <div className="post-body">
              <p className="quote">"{m.text}"</p>
              <div className="stat-row">
                <div className="stat"><b>{m.views}</b><span>Views</span></div>
                <div className="stat"><b>{m.engagement}</b><span>Engagement</span></div>
                <div className="stat"><b style={{ color: 'var(--red-bright)' }}>{m.velocity}</b><span>Velocity</span></div>
                <div className="stat"><b>{m.shares}</b><span>Shares</span></div>
              </div>
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontFamily: 'var(--font-d)', fontSize: 12, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--stitch)', marginBottom: 6 }}>Virality Curve · last 9 hrs</h4>
                <div style={{ overflowX: 'auto' }}>
                  <SparkLine arr={m.spark} w={500} h={70} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="panel det-block">
            <h4>👁 Vision AI Findings</h4>
            {m.vision.map((v, i) =>
              v[1] != null ? (
                <div key={i} className="conf-row">
                  <label>{v[0]}</label>
                  <div className="conf-bar"><i style={{ width: `${v[1]}%` }} /></div>
                  <b>{v[1]}%</b>
                </div>
              ) : (
                <div key={i} className="conf-row"><label style={{ flex: 1 }}>{v[0]}</label></div>
              )
            )}
          </div>
          <div className="panel det-block">
            <h4>✦ NLP &amp; Context Signals</h4>
            {m.nlp.map((n, i) => (
              <span key={i} className="entity">{n[0]}: <b>{n[1]}</b> · {n[2]}</span>
            ))}
          </div>
          <div className="reco">
            <h4>⚡ Recommended Play</h4>
            <p>{m.reco}</p>
            <div className="cta-row">
              <button className="btn btn-red" onClick={() => onStudio(m.id)}>
                {m.status === 'risk' ? 'Open CX Routing →' : 'Open Activation Studio →'}
              </button>
              <button className="btn btn-ghost" onClick={() => onDismiss(m.id)}>Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
