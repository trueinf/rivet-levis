import { useState, useRef } from 'react';
import { CH_LABELS, TONE_LABELS, TONE_FIT } from '../data';
import { fmtWin } from '../utils';

function PreviewX({ text }) {
  return (
    <div className="pv-shell prev-x">
      <div className="ph">
        <div className="brand-av">LEVI'S</div>
        <div><b>Levi's® <span className="vbadge">✓</span></b><br /><small>@LEVIS · now</small></div>
      </div>
      <div className="body">{text}</div>
      <div className="pm"><span>💬 1.2K</span><span>🔁 3.4K</span><span>❤️ 18K</span><span>📊 2.1M</span></div>
    </div>
  );
}

function PreviewIG({ text, visual }) {
  return (
    <div className="pv-shell prev-ig">
      <div className="ph">
        <div className="brand-av">LEVI'S</div>
        <div><b>levis <span className="vbadge">✓</span></b><small>Original audio · sponsored-free</small></div>
      </div>
      <div className="media">🖼 {visual}</div>
      <div className="acts">♡ ⌲ ⌗</div>
      <div className="body"><b>levis</b> {text}</div>
    </div>
  );
}

function PreviewTT({ text }) {
  return (
    <div className="pv-shell prev-tt">
      <div className="vid" />
      <div className="rail">
        <div><span>❤️</span>248K</div>
        <div><span>💬</span>9.1K</div>
        <div><span>↗️</span>31K</div>
      </div>
      <div className="meta">
        <b>@levis <span className="vbadge">✓</span></b>
        <p>{text}</p>
        <div className="snd">🎵 original sound — levis</div>
      </div>
    </div>
  );
}

export default function Studio({ moment: m, onBack, onApprove, onToast }) {
  if (!m) return null;
  const isRisk = m.status === 'risk';
  const availableChannels = Object.keys(m.drafts);
  const [channel, setChannel] = useState(availableChannels[0]);
  const [tone, setTone] = useState(isRisk ? 'appreciative' : 'witty');
  const [draftText, setDraftText] = useState(m.drafts[availableChannels[0]][isRisk ? 'appreciative' : 'witty']);
  const [editing, setEditing] = useState(false);

  const handleChannelChange = ch => {
    setChannel(ch);
    setDraftText(m.drafts[ch][tone]);
    setEditing(false);
  };

  const handleToneChange = t => {
    if (isRisk && t !== 'appreciative') {
      onToast('Tone locked — risk-flagged moments use the CX-safe voice only.');
      return;
    }
    setTone(t);
    setDraftText(m.drafts[channel][t]);
    setEditing(false);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(draftText).then(() => onToast('Draft copied to clipboard.'));
    } else {
      onToast('Draft selected — copy manually.');
    }
  };

  const chInfo = CH_LABELS[channel];

  return (
    <section className="page">
      <div className="crumb">
        <a onClick={() => onBack('queue')}>Queue</a> / <a onClick={() => onBack('detail')}>{m.id}</a> / Activation Studio
      </div>
      <button className="back-btn" onClick={() => onBack('detail')}>← Back to Moment</button>
      <div className="page-head">
        <div className="eyebrow">Activation Studio · {m.id} · {fmtWin(m.win) ? `window closes in ${fmtWin(m.win)}` : 'evergreen'}</div>
        <h1>Draft the <span className="thin">Response</span></h1>
        <p className="page-sub">
          {isRisk
            ? 'Risk-flagged moment — marketing tones are locked. CX-safe response and counter-programming assets only.'
            : 'Pick a channel, compare the three tones side by side, edit inline, and watch the live preview update. Nothing posts without your approval.'}
        </p>
      </div>

      <div className="studio-grid">
        <div className="panel context-card">
          <div className="panel-title"><h3>Source</h3><small>{m.pname}</small></div>
          <p style={{ fontSize: '12.5px', color: 'var(--wash-lt)', fontStyle: 'italic' }}>"{m.text.slice(0, 130)}…"</p>
          <div className="mc-meta" style={{ marginTop: 12 }}>
            <span>👁 <b>{m.views}</b></span>
            <span>⚡ <b style={{ color: 'var(--red-bright)' }}>{m.velocity}</b></span>
          </div>
          <hr className="seam" data-label="Guardrails" style={{ margin: '18px 0 14px' }} />
          <div className="guard ok">✓ Trademark — 501® / Red Tab™ correct</div>
          <div className="guard ok">✓ Tone within brand voice range</div>
          <div className="guard ok">✓ No competitor mentions</div>
          <div className={`guard ${isRisk ? 'warn' : 'ok'}`}>
            {isRisk ? '⚠ Risk-flagged: CX routing enforced' : '✓ Creator brand-safety: cleared'}
          </div>
          <hr className="seam" data-label="Attach" style={{ margin: '18px 0 14px' }} />
          <div className="asset">🖼 Licensed frame from source (pending creator OK)</div>
          <div className="asset">🛍 PDP link: {m.vision[0][0]}</div>
          <div className="asset">🎬 Brand b-roll: heritage stitch close-ups</div>
        </div>

        <div>
          <div className="channel-tabs" role="tablist">
            {availableChannels.map(ch => (
              <button key={ch} className={`ch-tab${ch === channel ? ' active' : ''}`} onClick={() => handleChannelChange(ch)}>
                {CH_LABELS[ch][0]} {CH_LABELS[ch][1]}
              </button>
            ))}
          </div>
          <div className="tone-cards">
            {['witty', 'appreciative', 'hype'].map(t => {
              const locked = isRisk && t !== 'appreciative';
              return (
                <div key={t} className={`tone-card${t === tone ? ' active' : ''}${locked ? ' locked' : ''}`} onClick={() => handleToneChange(t)}>
                  <h5>{TONE_LABELS[t]}<span className="fit">{TONE_FIT[t]}</span></h5>
                  <p>{m.drafts[channel][t]}</p>
                </div>
              );
            })}
          </div>
          <hr className="seam" data-label="Edit & finalize" style={{ margin: '20px 0 16px' }} />
          <div className={`draft-box${editing ? ' editing' : ''}`}>
            <textarea
              aria-label="Draft copy"
              value={draftText}
              onChange={e => { setDraftText(e.target.value); setEditing(true); }}
            />
            <div className="draft-meta">
              <span>Channel: <b>{chInfo[1]}</b></span>
              <span>Tone: <b>{TONE_LABELS[tone]}</b></span>
              <span>{draftText.length} chars</span>
              <span>Predicted: <b>{isRisk ? 'n/a' : 'top 8% engagement'}</b></span>
            </div>
          </div>
          <div className="cta-row">
            <button className="btn btn-red" onClick={() => onApprove(m.id, channel)}>
              {isRisk ? 'Route to CX Team' : 'Approve & Schedule'}
            </button>
            <button className="btn btn-stitch" onClick={handleCopy}>Copy Draft</button>
            <button className="btn btn-ghost" onClick={() => onToast('Sent to the brand team channel for a second pair of eyes.')}>Request Review</button>
          </div>
          <p style={{ fontFamily: 'var(--font-m)', fontSize: '10.5px', color: 'var(--canvas-dim)', marginTop: 14 }}>
            Scheduling picks the next peak slot for {chInfo[1]} inside the velocity window. Nothing posts without human approval.
          </p>
        </div>

        <div className="preview-wrap">
          <div className="preview-label"><i />Live preview · as it will appear on {chInfo[1]}</div>
          {channel === 'x' && <PreviewX text={draftText} />}
          {channel === 'instagram' && <PreviewIG text={draftText} visual={m.visual} />}
          {(channel === 'tiktok' || channel === 'reddit') && <PreviewTT text={draftText} />}
        </div>
      </div>
    </section>
  );
}
