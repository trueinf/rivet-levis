import { useEffect, useRef, useState } from 'react';

export default function KpiCounter({ to, dec = 0 }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const dur = 900;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal((to * e).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, dec]);

  return <>{val}</>;
}
