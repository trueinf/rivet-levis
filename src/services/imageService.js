const cache = new Map();

export function clearImageCache(momentId) {
  cache.delete(momentId);
}

const PLATFORM_STYLE = {
  tiktok: 'lifestyle fashion photography',
  instagram: 'lifestyle fashion photography',
  x: 'editorial photography',
  reddit: 'documentary photography',
};

export async function generateMomentImage(momentId, visual, platform) {
  if (cache.has(momentId)) return cache.get(momentId);

  const key = import.meta.env.VITE_XAI_API_KEY;
  if (!key) throw new Error('No XAI API key — add VITE_XAI_API_KEY to .env.local');

  const style = PLATFORM_STYLE[platform] || 'editorial photography';
  const prompt = `${style} for a denim clothing brand. ${visual}. High quality commercial photography, natural lighting, no text or overlaid graphics.`;

  const res = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'grok-imagine-image-quality',
      prompt,
      n: 1,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error('xAI image error:', res.status, errBody);
    throw new Error(errBody?.error?.message || `xAI API error ${res.status}`);
  }

  const data = await res.json();
  const url = data.data[0].url;
  cache.set(momentId, url);
  return url;
}
