import { useState, useEffect, useRef } from 'react'

const TERMINAL_LINES = [
  { prompt: 'Chetan@Kali:~$', cmd: 'cat role.txt', output: 'Full-Stack Developer & Security Researcher' },
  { prompt: 'Chetan@Kali:~$', cmd: 'whoami', output: 'Chetan Dabhi' },
  { prompt: 'Chetan@Kali:~$', cmd: 'cat bio.txt', output: 'I live at the intersection of building and breaking. I develop web applications and hunt for vulnerabilities (like IDOR and XSS) through bug bounty programs.' },
  { prompt: 'Chetan@Kali:~$', cmd: 'cat interests.conf', output: 'Offensive Security • IoT Exploitation (ESP32) • Web App Pentesting • Quantum Computing Research • Live Sports Prediction Algorithms' },
  { prompt: 'Chetan@Kali:~$', cmd: 'cat mission.log', output: 'Currently pursuing academics with a razor-sharp focus on red teaming, hardware hacking, and full-stack engineering. When I\'m not in a terminal, I\'m probably breaking into one.' },
  { prompt: 'Chetan@Kali:~$', cmd: 'echo $STATUS', output: '☕ Caffeinated and ready to hack.' },
]

const TYPE_SPEED = 22          // ms per character for commands
const OUTPUT_SPEED = 12        // ms per character for output (faster)
const LINE_PAUSE = 300         // pause between lines

function About() {
  const [lines, setLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [phase, setPhase] = useState('cmd')    // 'cmd' | 'output' | 'done'
  const [charIndex, setCharIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    if (currentLine >= TERMINAL_LINES.length) {
      setPhase('done')
      return
    }

    const entry = TERMINAL_LINES[currentLine]

    if (phase === 'cmd') {
      if (charIndex < entry.cmd.length) {
        const timer = setTimeout(() => setCharIndex(c => c + 1), TYPE_SPEED)
        return () => clearTimeout(timer)
      }
      // command finished typing → pause then show output
      const timer = setTimeout(() => {
        setPhase('output')
        setCharIndex(0)
      }, 200)
      return () => clearTimeout(timer)
    }

    if (phase === 'output') {
      if (charIndex < entry.output.length) {
        const timer = setTimeout(() => setCharIndex(c => c + 1), OUTPUT_SPEED)
        return () => clearTimeout(timer)
      }
      // output finished → commit this line and move to next
      const timer = setTimeout(() => {
        setLines(prev => [...prev, { ...entry }])
        setCurrentLine(i => i + 1)
        setPhase('cmd')
        setCharIndex(0)
      }, LINE_PAUSE)
      return () => clearTimeout(timer)
    }
  }, [currentLine, phase, charIndex])

  // auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  })

  const currentEntry = TERMINAL_LINES[currentLine]

  return (
    <section id="about" className="section">
      <h2 className="section__title">About Me</h2>
      <div className="terminal" ref={containerRef}>
        <div className="terminal__bar">
          <span className="terminal__dot terminal__dot--red" />
          <span className="terminal__dot terminal__dot--yellow" />
          <span className="terminal__dot terminal__dot--green" />
          <span className="terminal__bar-title">chetan@kali: ~/about</span>
        </div>
        <div className="terminal__body">
          {/* already completed lines */}
          {lines.map((line, i) => (
            <div key={i} className="terminal__line">
              <div className="terminal__cmd-row">
                <span className="terminal__prompt">{line.prompt}</span>
                <span className="terminal__cmd">{line.cmd}</span>
              </div>
              <div className="terminal__output">{line.output}</div>
            </div>
          ))}

          {/* currently typing line */}
          {phase !== 'done' && currentEntry && (
            <div className="terminal__line">
              <div className="terminal__cmd-row">
                <span className="terminal__prompt">{currentEntry.prompt}</span>
                <span className="terminal__cmd">
                  {phase === 'cmd'
                    ? currentEntry.cmd.slice(0, charIndex)
                    : currentEntry.cmd}
                  {phase === 'cmd' && <span className="terminal__cursor" />}
                </span>
              </div>
              {phase === 'output' && (
                <div className="terminal__output terminal__output--typing">
                  {currentEntry.output.slice(0, charIndex)}
                  <span className="terminal__cursor" />
                </div>
              )}
            </div>
          )}

          {/* final blinking cursor */}
          {phase === 'done' && (
            <div className="terminal__line">
              <div className="terminal__cmd-row">
                <span className="terminal__prompt">chetan@kali:~$</span>
                <span className="terminal__cursor" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default About
