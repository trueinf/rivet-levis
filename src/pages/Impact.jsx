import { PUBLISHED } from '../data';
import KpiCounter from '../components/KpiCounter';

export default function Impact() {
  return (
    <section className="page">
      <div className="page-head">
        <div className="eyebrow">Closed-Loop Measurement</div>
        <h1>Activation <span className="thin">Impact</span></h1>
        <p className="page-sub">What happened after we jumped on a moment. Engagement lift vs. channel baseline, with downstream traffic where attribution holds.</p>
      </div>
      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Activations · 30d</div>
          <div className="kpi-val"><KpiCounter to={14} /></div>
          <div className="kpi-delta up">▲ 5 vs prior period</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg engagement lift</div>
          <div className="kpi-val">+<KpiCounter to={170} /><span className="unit">%</span></div>
          <div className="kpi-delta up">vs channel baseline</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Median time to post</div>
          <div className="kpi-val"><KpiCounter to={4.2} dec={1} /><span className="unit"> hrs</span></div>
          <div className="kpi-delta up">▼ from 31 hrs pre-RIVET</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Attributed PDP sessions</div>
          <div className="kpi-val"><KpiCounter to={212} /><span className="unit">K</span></div>
          <div className="kpi-delta up">▲ 38% MoM</div>
        </div>
      </div>
      <hr className="seam" data-label="Recent activations" />
      {PUBLISHED.map(p => (
        <div key={p.id} className="panel" style={{ marginBottom: 14, position: 'relative' }}>
          <span className="tab t-pub">PUBLISHED</span>
          <div className="impact-card">
            <div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: '10.5px', color: 'var(--wash)', letterSpacing: 1 }}>{p.id} · {p.channel} · {p.date}</div>
              <h3 style={{ fontFamily: 'var(--font-d)', fontWeight: 500, fontSize: 17, letterSpacing: '.5px', margin: '4px 0 14px' }}>{p.title}</h3>
              <div className="bar-pair">
                <label>Channel baseline</label>
                <div className="bar-track"><i className="bar-base" style={{ width: `${p.base}%` }} /></div>
              </div>
              <div className="bar-pair">
                <label>This activation</label>
                <div className="bar-track"><i className="bar-lift" style={{ width: `${p.lift}%` }} /></div>
              </div>
              <p style={{ fontFamily: 'var(--font-m)', fontSize: '10.5px', color: 'var(--canvas-dim)', marginTop: 8 }}>{p.extra}</p>
            </div>
            <div className="impact-num"><b>{p.metric}</b><span>{p.label}</span></div>
          </div>
        </div>
      ))}
      <hr className="seam" data-label="Reading the loop" />
      <div className="panel">
        <p style={{ color: 'var(--wash-lt)', fontSize: 13 }}>
          Speed is the whole game: activations published inside the velocity window (first ~12h) averaged <b style={{ color: 'var(--stitch)' }}>+214% lift</b>, while late posts (24h+) averaged +61%. RIVET's job is to buy your team those hours back.
        </p>
      </div>
    </section>
  );
}
