import { STATUS_META } from '../data';

export default function StatusTab({ status, isStatic = false }) {
  const [label, cls] = STATUS_META[status];
  return <span className={`tab ${cls}${isStatic ? ' static' : ''}`}>{label}</span>;
}
