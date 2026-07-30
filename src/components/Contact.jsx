import { useState } from 'react'

function Contact() {
  const [message, setMessage] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  return (
    <section id="contact-page" className="section">
      <h2 className="section__title">Contact</h2>
      <div className="contact-form" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neon-green)' }}>
            $ enter_message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setShowHelp(true)}
            onBlur={() => setShowHelp(false)}
            rows="5"
            style={{
              width: '100%',
              padding: '0.5rem',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-card)',
              color: 'inherit',
              border: '1px solid var(--neon-green-dim)',
              borderRadius: '4px'
            }}
            placeholder="Type your message here..."
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Character count: {message.length}
          </div>
        </div>
        
        {showHelp && (
          <div style={{ fontSize: '0.85rem', color: 'var(--neon-green)', marginBottom: '1rem', animation: 'flicker 2s infinite' }}>
            &gt; SYSTEM TIP: Press submit to send your transmission.
          </div>
        )}
        
        <button 
          style={{
            padding: '0.5rem 1.5rem',
            fontFamily: 'var(--font-mono)',
            background: 'var(--neon-green-glow)',
            color: 'inherit',
            border: '1px solid var(--neon-green)',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
          onClick={() => alert(`Message sent: ${message}`)}
        >
          Submit
        </button>
      </div>
    </section>
  )
}

export default Contact
