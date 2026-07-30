import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Projects from './components/Projects'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import Footer from './components/Footer'

function App() {
  /* ── Data definitions (single source of truth) ── */
  const studentName = 'Chetan Dabhi'
  const headerTheme = '#00FF41'

  const skillsArray = [
    'Web Development',
    'Cybersecurity & Red Teaming',
    'Bug Bounty (IDOR, XSS, SQLi)',
    'IoT (ESP32/ESP8266)',
    'Python',
    'MySQL',
  ]

  /* ── State Management ── */
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  /* Apply theme styles to body directly to override index.css globals */
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#0D0D0D'
      document.body.style.color = '#00FF41'
    } else {
      document.body.style.backgroundColor = '#f0f0f0'
      document.body.style.color = '#003300'
    }
  }, [isDarkMode])

  /* ── Composition & Routing ── */
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header name={studentName} themeColor={isDarkMode ? headerTheme : '#003300'} />
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home skillsList={skillsArray} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
