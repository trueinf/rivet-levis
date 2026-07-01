import { fmtWin } from '../utils';

export default function WindowChip({ moment }) {
  if (moment.status === 'sched') {
    return <span className="countdown cool">📅 {moment.sched}</span>;
  }
  const w = fmtWin(moment.win);
  if (!w) return <span className="countdown cool">⏱ window closed — evergreen play</span>;
  return <span className="countdown">⏱ {w} left in peak window</span>;
}
