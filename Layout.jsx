import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import FloatingAssistant from './FloatingAssistant'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workspace', label: 'Workspace' },
  { to: '/history', label: 'History' },
]

const scanLinks = [
  { to: '/url-scanner', label: 'URL Scanner' },
  { to: '/email-analyzer', label: 'Email Analyzer' },
  { to: '/qr-protection', label: 'QR Protection' },
  { to: '/sms-scanner', label: 'SMS Scanner' },
  { to: '/domain-intelligence', label: 'Domain Intelligence' },
  { to: '/ai-threat-engine', label: 'AI Threat Engine' },
  { to: '/image-scan', label: 'Image Scan' },
]

function Layout() {
  const navigate = useNavigate()
  const { theme, toggleTheme, authUser, logout } = useAppContext()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <div className={`app-shell ${theme}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">PG</div>
          <div>
            <p className="eyebrow">AI Threat Intelligence</p>
            <h1>PhishGuard</h1>
          </div>
        </div>

        <div className="sidebar-status">
          <span className="status-pill live">● Live</span>
          <p>24/7 phishing response stream</p>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section">
          <p className="section-label">Scan Modes</p>
          <nav className="nav-links scan-links" aria-label="Scan modes">
            {scanLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-actions">
          <button type="button" className="ghost-btn" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
          {authUser ? (
            <button type="button" className="ghost-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/auth" className="primary-btn">
              Sign in
            </NavLink>
          )}
          <NavLink to="/workspace" className="primary-btn">
            Open workspace
          </NavLink>
        </div>
      </aside>

      <main className="page-content">
        <Outlet />
      </main>

      <FloatingAssistant />
    </div>
  )
}

export default Layout
