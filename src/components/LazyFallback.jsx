/**
 * LazyFallback — Suspense fallback UI for lazy-loaded route chunks.
 *
 * Practical 8: Displays a terminal-styled loading screen while
 * React.lazy() dynamically imports a route component.
 *
 * Uses inline styles so the fallback renders instantly without
 * depending on any CSS file that might still be loading.
 */
function LazyFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #00FF41',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)',
          overflow: 'hidden',
          fontFamily: "'Fira Code', monospace",
        }}
      >
        {/* ── Terminal title bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: '#1a1a1a',
            borderBottom: '1px solid #00FF41',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 'auto', color: '#888', fontSize: '0.75rem' }}>
            ~/loading-module
          </span>
        </div>

        {/* ── Terminal body ── */}
        <div style={{ padding: '1.2rem 1rem' }}>
          <div style={{ color: '#00FF41', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
            <span style={{ color: '#888' }}>guest@portfolio:~$</span>{' '}
            <span>import ./chunk</span>
          </div>

          <div style={{ color: '#00FF41', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
            [INFO] Dynamically loading route module...
          </div>

          {/* ── Animated progress bar ── */}
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '4px',
              overflow: 'hidden',
              height: '18px',
              border: '1px solid #333',
              marginBottom: '0.8rem',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #00FF41, #00cc33)',
                animation: 'lazyProgressBar 1.8s ease-in-out infinite',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ color: '#888', fontSize: '0.75rem' }}>
            <span style={{ color: '#febc2e' }}>⚡</span> Code splitting in action — loading only
            what you need.
          </div>
        </div>

        {/* ── Scanline effect ── */}
        <div
          style={{
            position: 'relative',
            height: '2px',
            background: 'transparent',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: '#00FF41',
              animation: 'lazyScanline 2s linear infinite',
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      {/* ── Keyframe animations (injected inline) ── */}
      <style>{`
        @keyframes lazyProgressBar {
          0%   { width: 0%; }
          50%  { width: 80%; }
          100% { width: 100%; }
        }
        @keyframes lazyScanline {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default LazyFallback
