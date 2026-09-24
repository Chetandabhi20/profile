import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

/* ── Static imports: app shell (always visible on every page) ── */
import Header from './components/Header'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import LazyFallback from './components/LazyFallback'
import { isAuthenticated, clearToken } from './services/api'

/* ── Lazy imports: route-based code splitting (Practical 8) ──────
 *  Each of these generates a separate chunk file at build time.
 *  The chunk is downloaded only when the user first visits the route.
 *  React.lazy() requires the module to have a default export.
 */
const Home = lazy(() => import('./components/Home'))
const Projects = lazy(() => import('./components/Projects'))
const Tasks = lazy(() => import('./components/Tasks'))
const Contact = lazy(() => import('./components/Contact'))
const Login = lazy(() => import('./components/Login'))
const NotFound = lazy(() => import('./components/NotFound'))

/**
 * ProtectedRoute — Redirects to /login if no valid token exists.
 * (Supplementary Problem #2: Frontend 401 handling)
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

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
  const [loggedIn, setLoggedIn] = useState(isAuthenticated())

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  // Refresh auth state (called after login/logout)
  const refreshAuth = useCallback(() => {
    setLoggedIn(isAuthenticated())
  }, [])

  // Supplementary Problem #3: Logout — clears token from client
  const handleLogout = useCallback(() => {
    clearToken()
    setLoggedIn(false)
  }, [])

  // Listen for 'auth:expired' event (fired by api.js on 401)
  useEffect(() => {
    const onExpired = () => {
      setLoggedIn(false)
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [])

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
      <NavBar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isLoggedIn={loggedIn}
        onLogout={handleLogout}
      />
      
      <div style={{ flex: 1 }}>
        {/* ── Practical 8: Suspense boundary for lazy-loaded routes ──
         *  While a chunk is being downloaded, <LazyFallback /> renders.
         *  On fast connections the fallback flashes briefly; throttle to
         *  Slow 3G in DevTools Network tab to observe it clearly.
         */}
        <Suspense fallback={<LazyFallback />}>
          <Routes>
            <Route path="/" element={<Home skillsList={skillsArray} />} />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login onAuthChange={refreshAuth} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}

export default App
