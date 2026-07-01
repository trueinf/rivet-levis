import { useGeneratedImage } from '../hooks/useGeneratedImage';

export default function PostVisual({ moment: m }) {
  const { url, loading, error, retry } = useGeneratedImage(m.id, m.visual, m.platform);
  const hasKey = !!import.meta.env.VITE_XAI_API_KEY;

  return (
    <div className="post-visual">
      {/* AI image rendered as background to suppress browser media toolbar */}
      {url && (
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      )}

      {!url && (
        <>
          {!loading && <span className="pv-icon">{m.icon}</span>}
          {loading && (
            <div className="img-generating">
              <span className="img-spinner" />
            </div>
          )}
          {error && !loading && (
            <div className="img-error">
              <span>⚠ {error.message}</span>
              <button className="img-retry" onClick={retry}>Retry</button>
            </div>
          )}
          {!hasKey && !loading && !error && (
            <div className="img-no-key">
              Add <code>VITE_XAI_API_KEY</code> to <code>.env.local</code>
            </div>
          )}
        </>
      )}

      {/* dashed frame only shown on placeholder, not while loading */}
      {!url && !loading && <div className="pv-frame" />}

      {/* detection bounding box only shown on placeholder, not while loading */}
      {!url && !loading && m.box && (
        <div className="pv-detect" style={{ top: m.box.top, left: m.box.left, width: m.box.w, height: m.box.h }}>
          <span>{m.box.label}</span>
        </div>
      )}

      <div className="pv-caption">
        <div className="h">{m.visual}</div>
        <div className="s">
          {url ? 'AI-generated image' : 'Captured media frame · vision overlay shown when product detected'}
        </div>
      </div>
    </div>
  );
}
