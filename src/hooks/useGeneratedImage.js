import { useState, useEffect, useCallback } from 'react';
import { generateMomentImage, clearImageCache } from '../services/imageService';

export function useGeneratedImage(momentId, visual, platform) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!import.meta.env.VITE_XAI_API_KEY || !momentId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    generateMomentImage(momentId, visual, platform)
      .then(u => { if (!cancelled) { setUrl(u); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });
    return () => { cancelled = true; };
  }, [momentId, visual, platform, retryCount]);

  const retry = useCallback(() => {
    clearImageCache(momentId);
    setError(null);
    setUrl(null);
    setRetryCount(n => n + 1);
  }, [momentId]);

  return { url, loading, error, retry };
}
