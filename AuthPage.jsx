import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const DEFAULT_ADMIN_EMAIL = 'admin@phishguard.com'
const DEFAULT_ADMIN_PASSWORD = 'admin123'

function AuthPage() {
  const navigate = useNavigate()
  const { login, register, authLoading } = useAppContext()
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    username: 'Admin',
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await register(formData.username, formData.email, formData.password)
      } else {
        await login(formData.email, formData.password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro" aria-labelledby="auth-brand">
        <a className="auth-brand" href="/" aria-label="PhishingGuard home">
          <span className="auth-brand-mark" aria-hidden="true">PG</span>
          <span id="auth-brand">PhishingGuard</span>
        </a>
        <div className="auth-message">
          <p className="auth-kicker"><span /> YOUR FIRST LINE OF DEFENSE</p>
          <h1>Spot the threat.<br /><span>Stop the damage.</span></h1>
          <p className="auth-description">One clear view of suspicious links, messages, domains, and more. Sign in to protect what matters.</p>
        </div>
        <div className="auth-signal" aria-label="Protection available for URLs, email, SMS, and QR codes">
          <span className="auth-signal-label">THREAT COVERAGE</span>
          <div className="auth-signal-items">
            <span>URL</span><span>EMAIL</span><span>SMS</span><span>QR</span>
          </div>
        </div>
        <span className="auth-orbit auth-orbit-one" aria-hidden="true" />
        <span className="auth-orbit auth-orbit-two" aria-hidden="true" />
      </section>

      <section className="auth-panel" aria-labelledby="auth-heading">
        <div className="auth-panel-heading">
          <p className="eyebrow">SECURE ACCESS</p>
          <h2 id="auth-heading">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{mode === 'login' ? 'Sign in to your PhishingGuard workspace.' : 'Set up your PhishingGuard workspace.'}</p>
        </div>

        <div className="mode-toggle auth-mode-toggle" role="tablist" aria-label="Authentication mode">
          <button type="button" role="tab" aria-selected={mode === 'login'} className={`mode-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            Login
          </button>
          <button type="button" role="tab" aria-selected={mode === 'register'} className={`mode-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
            Create account
          </button>
        </div>

        {mode === 'login' ? (
          <p className="auth-demo-note">
            Default admin: {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}
          </p>
        ) : null}

        <form className="tool-panel auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label className="input-label" htmlFor="username">
              Username
              <input id="username" name="username" value={formData.username} onChange={handleChange} required />
            </label>
          ) : null}

          <label className="input-label" htmlFor="email">
            Email
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label className="input-label" htmlFor="password">
            Password
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength="6" />
          </label>

          {error ? <p className="status-pill status-danger">{error}</p> : null}

          <button type="submit" className="primary-btn full-width" disabled={loading || authLoading}>
            {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <p className="auth-footnote">Protected workspace access <span aria-hidden="true">·</span> PhishingGuard Security</p>
      </section>
    </main>
  )
}

export default AuthPage
