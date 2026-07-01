export default function SparkLine({ arr, w = 78, h = 30, color = 'var(--stitch)' }) {
  const max = Math.max(...arr);
  const pts = arr.map((v, i) => `${(i / (arr.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
  const lastPt = pts.split(' ').pop().split(',');
  return (
    <svg className="spark-svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        pathLength="100" strokeDasharray="100" strokeDashoffset="100"
        style={{ animation: 'dash 1.1s ease forwards' }} />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill="var(--red-bright)" />
      <style>{`@keyframes dash{to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}
