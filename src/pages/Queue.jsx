import { useState } from 'react';
import MomentCard from '../components/MomentCard';

const FILTERS = [['all', 'All'], ['new', 'New'], ['review', 'In Review'], ['draft', 'Draft Ready'], ['sched', 'Scheduled'], ['risk', 'Risk']];

export default function Queue({ moments, onOpen, onStudio }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('score');

  let list = moments.filter(m => filter === 'all' ? true : m.status === filter);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m => (m.handle + m.name + m.text + m.pname).toLowerCase().includes(q));
  }
  list = [...list].sort((a, b) =>
    sort === 'score' ? b.score - a.score
      : sort === 'velocity' ? parseInt(b.velocity) - parseInt(a.velocity)
        : a.age.localeCompare(b.age)
  );

  return (
    <section className="page">
      <div className="page-head">
        <div className="eyebrow">Marketing Triage</div>
        <h1>Moment <span className="thin">Queue</span></h1>
        <p className="page-sub">Ranked by activation score — velocity × reach × brand-fit × safety. Open a moment for the full picture, or jump straight to drafting.</p>
      </div>
      <div className="toolbar">
        <div className="filters" role="tablist">
          {FILTERS.map(([f, label]) => (
            <button key={f} className={`fbtn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{label}</button>
          ))}
        </div>
        <div className="search-box">
          🔍
          <input placeholder="Search handle, text, platform…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort queue">
          <option value="score">Sort: Activation score</option>
          <option value="velocity">Sort: Velocity</option>
          <option value="recent">Sort: Most recent</option>
        </select>
        <span className="queue-count">{list.length} shown</span>
      </div>
      <div>
        {list.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: 40, color: 'var(--wash)' }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🧵</div>
            Nothing matches. Clear the search or switch filters — the scanner never sleeps.
          </div>
        ) : (
          list.map(m => <MomentCard key={m.id} moment={m} onOpen={onOpen} onStudio={onStudio} />)
        )}
      </div>
    </section>
  );
}
