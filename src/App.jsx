import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { MOMENTS, LIVE_MOMENT } from './data';
import Monitor from './pages/Monitor';
import Queue from './pages/Queue';
import Detail from './pages/Detail';
import Studio from './pages/Studio';
import Impact from './pages/Impact';

function Toast({ msg, actLabel, actFn, visible }) {
  return (
    <div className={`toast${visible ? ' show' : ''}`} role="status">
      <span className="tdot" />
      <span>{msg}</span>
      {actLabel && <span className="tact" onClick={actFn}>{actLabel}</span>}
    </div>
  );
}

export default function App() {
  const [moments, setMoments] = useState(() => MOMENTS.map(m => ({ ...m })));
  const [page, setPage] = useState('monitor');
  const [currentId, setCurrentId] = useState(null);
  const [syncSecs, setSyncSecs] = useState(14);
  const [toast, setToast] = useState({ visible: false, msg: '', actLabel: '', actFn: null });
  const toastTimer = useRef(null);
  const liveFired = useRef(false);

  const showToast = useCallback((msg, actLabel = '', actFn = null) => {
    setToast({ visible: true, msg, actLabel, actFn });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3800);
  }, []);

  useEffect(() => {
    const winInterval = setInterval(() => {
      setMoments(ms => ms.map(m => m.win > 0 ? { ...m, win: m.win - 1 } : m));
    }, 1000);
    const syncInterval = setInterval(() => {
      setSyncSecs(s => (s + 1) % 47 || 3);
    }, 1000);
    const liveTimeout = setTimeout(() => {
      if (liveFired.current) return;
      liveFired.current = true;
      setMoments(ms => [{ ...LIVE_MOMENT }, ...ms]);
      showToast('New detection: @vintagevaultshop — deadstock 90s 501s, score 88.', 'Open it', () => {
        setCurrentId('M-0148');
        setPage('detail');
      });
    }, 10000);

    return () => {
      clearInterval(winInterval);
      clearInterval(syncInterval);
      clearTimeout(liveTimeout);
    };
  }, [showToast]);

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') {
        if (page === 'studio') setPage('detail');
        else if (page === 'detail') setPage('queue');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [page]);

  const openDetail = id => { setCurrentId(id); setPage('detail'); setNavOpen(false); window.scrollTo({ top: 0 }); };
  const openStudio = id => { setCurrentId(id); setPage('studio'); setNavOpen(false); window.scrollTo({ top: 0 }); };

  const handleDismiss = id => {
    showToast(`Moment ${id} dismissed — the scanner keeps watching the thread.`);
    setPage('queue');
  };

  const handleApprove = (id, channel) => {
    const m = moments.find(x => x.id === id);
    if (m.status === 'risk') {
      showToast(`${id} routed to CX with the safe response attached.`);
    } else {
      setMoments(ms => ms.map(x => x.id === id ? { ...x, status: 'sched', sched: `Today · next peak slot · ${channel}` } : x));
      showToast(`${id} approved — scheduled for the next peak slot on ${channel}.`, 'View queue', () => setPage('queue'));
    }
    setPage('queue');
  };

  const currentMoment = moments.find(m => m.id === currentId);
  const awaitingCount = moments.filter(m => ['new', 'review', 'risk'].includes(m.status)).length;
  const isQueuePage = page === 'queue' || page === 'detail' || page === 'studio';
  const [navOpen, setNavOpen] = useState(false);

  const navigate = p => { setPage(p); setNavOpen(false); window.scrollTo({ top: 0 }); };

  return (
    <div className="app">
      <header>
        <div className="logo" onClick={() => navigate('monitor')} tabIndex={0} role="button" aria-label="RIVET home"
          onKeyDown={e => e.key === 'Enter' && navigate('monitor')}>
          <div className="logo-batwing">RIVET</div>
          <div className="logo-sub">
            <b>Viral Moment Engine</b>
            <span>Levi Strauss &amp; Co. · Social Command</span>
          </div>
        </div>

        {/* hamburger on mobile */}
        <button className="hamburger" onClick={() => setNavOpen(o => !o)} aria-label="Toggle navigation">
          <span /><span /><span />
        </button>

        <nav className={navOpen ? 'nav-open' : ''}>
          <button className={`nav-btn${page === 'monitor' ? ' active' : ''}`} onClick={() => navigate('monitor')}>Monitor</button>
          <button className={`nav-btn${isQueuePage ? ' active' : ''}`} onClick={() => navigate('queue')}>
            Queue <span className="badge">{awaitingCount}</span>
          </button>
          <button className={`nav-btn${page === 'impact' ? ' active' : ''}`} onClick={() => navigate('impact')}>Impact</button>
        </nav>

        <div className="live-dot">
          <div className="row"><i />LIVE · SCANNING 4 PLATFORMS</div>
          <span className="sync">last sync {syncSecs}s ago</span>
        </div>
      </header>

      <main>
        {page === 'monitor' && <Monitor moments={moments} onOpen={openDetail} onStudio={openStudio} />}
        {page === 'queue' && <Queue moments={moments} onOpen={openDetail} onStudio={openStudio} />}
        {page === 'detail' && <Detail moment={currentMoment} onBack={() => setPage('queue')} onStudio={openStudio} onDismiss={handleDismiss} />}
        {page === 'studio' && <Studio moment={currentMoment} onBack={dest => setPage(dest)} onApprove={handleApprove} onToast={showToast} />}
        {page === 'impact' && <Impact />}
      </main>

      <Toast
        visible={toast.visible}
        msg={toast.msg}
        actLabel={toast.actLabel}
        actFn={() => { toast.actFn?.(); setToast(t => ({ ...t, visible: false })); }}
      />
    </div>
  );
}
