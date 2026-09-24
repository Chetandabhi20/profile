import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'

/**
 * Login — Terminal-styled authentication form (Practical 7).
 * Toggles between Login and Register modes.
 * On success: stores JWT token and navigates to /tasks.
 */
function Login({ onAuthChange }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      if (isRegisterMode) {
        await register({ name: name.trim(), email: email.trim(), password })
        setSuccessMsg('Registration successful! Switching to login...')
        // Auto-switch to login mode after successful registration
        setTimeout(() => {
          setIsRegisterMode(false)
          setSuccessMsg(null)
          setName('')
          setPassword('')
        }, 1500)
      } else {
        await login({ email: email.trim(), password })
        // Notify parent that auth state changed
        if (onAuthChange) onAuthChange()
        navigate('/tasks')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setError(null)
    setSuccessMsg(null)
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <section id="login" className="section">
      <h2 className="section__title">
        {isRegisterMode ? 'Register' : 'Login'}
      </h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* terminal title bar */}
        <div className="auth-form__bar">
          <span className="auth-form__dot" />
          <span className="auth-form__dot" />
          <span className="auth-form__dot" />
          <span className="auth-form__bar-title">
            ~/{isRegisterMode ? 'register' : 'login'}
          </span>
        </div>

        <div className="auth-form__body">
          {/* Error display */}
          {error && (
            <div className="auth-form__error">
              <span className="auth-form__error-label">[ERROR]</span> {error}
            </div>
          )}

          {/* Success display */}
          {successMsg && (
            <div className="auth-form__success">
              <span className="auth-form__success-label">[OK]</span> {successMsg}
            </div>
          )}

          {/* Name field (register only) */}
          {isRegisterMode && (
            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="auth-name">
                <span className="auth-form__prompt">$</span> name
                <span className="auth-form__required">*</span>
              </label>
              <input
                id="auth-name"
                type="text"
                className="auth-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                required
                autoFocus
              />
            </div>
          )}

          {/* Email field */}
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="auth-email">
              <span className="auth-form__prompt">$</span> email
              <span className="auth-form__required">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              autoFocus={!isRegisterMode}
            />
          </div>

          {/* Password field */}
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="auth-password">
              <span className="auth-form__prompt">$</span> password
              <span className="auth-form__required">*</span>
              {isRegisterMode && (
                <span className="auth-form__hint">(min 6 chars)</span>
              )}
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              required
              minLength={isRegisterMode ? 6 : undefined}
            />
          </div>

          {/* Actions */}
          <div className="auth-form__actions">
            <button
              type="submit"
              className="auth-form__btn auth-form__btn--submit"
              disabled={loading}
            >
              <span className="auth-form__btn-prompt">$</span>
              {loading
                ? 'authenticating...'
                : isRegisterMode
                  ? 'sudo useradd --create'
                  : 'ssh connect@server'}
            </button>
          </div>

          {/* Toggle between Login / Register */}
          <div className="auth-form__toggle">
            <span className="auth-form__toggle-text">
              {isRegisterMode
                ? 'Already have an account?'
                : "Don't have an account?"}
            </span>
            <button
              type="button"
              className="auth-form__toggle-btn"
              onClick={toggleMode}
            >
              {isRegisterMode ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default Login
