import { SENT_META } from '../data';

export default function SentimentBadge({ sentiment }) {
  const [cls, label] = SENT_META[sentiment];
  return (
    <span className={`sent ${cls}`}>
      <i />{label}
    </span>
  );
}
