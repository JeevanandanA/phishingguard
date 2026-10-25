import { useState } from 'react'
import { Link } from 'react-router-dom'

const features = [
  { title: 'URL Scanner', desc: 'Inspect domains, links, and redirect chains in seconds.', icon: '🔗', sample: 'https://secure-bank.example.com/login' },
  { title: 'Email Analyzer', desc: 'Identify impersonation, spoofing, and malicious payloads.', icon: '✉️', sample: 'Subject: Urgent invoice update. Please verify your payment details immediately.' },
  { title: 'QR Protection', desc: 'Decode embedded URLs and flag unsafe destinations.', icon: '📷', sample: 'QR payload: https://verify-paypal.example-secure.org/login' },
  { title: 'SMS Scam Detection', desc: 'Review text patterns for phishing intent and urgency.', icon: '💬', sample: 'Your account will be locked today. Click now to verify your credentials.' },
  { title: 'Domain Intelligence', desc: 'Assess age, registrar, and reputation data quickly.', icon: '🌐', sample: 'Domain check: recent registration and redirecting to a fake login portal' },
  { title: 'AI Threat Engine', desc: 'Blend heuristics and threat feeds for live scoring.', icon: '🛡️', sample: 'Threat feed: suspicious link pattern matched to known phishing clusters' },
]

const steps = [
  'Input suspicious content or a URL',
  'AI evaluates reputation, redirects, and signals',
  'Receive a risk score with explanation and actions',
]

function HomePage() {
  const [activeFeature, setActiveFeature] = useState('URL Scanner')

  const handleFeatureSelect = (feature) => {
    setActiveFeature(feature.title)
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">REAL-TIME PHISHING DETECTION</p>
          <h2>Stay safe from phishing attacks with a command-center view of every signal.</h2>
          <p className="hero-text">
            Detect suspicious URLs, emails, QR codes, SMS messages, and domains with a live AI security engine designed for modern SOC teams.
          </p>
          <div className="hero-actions">
            <Link to="/scanner" className="primary-btn">Start free scan</Link>
            <Link to="/dashboard" className="ghost-btn">View platform</Link>
          </div>
          <div className="hero-badges">
            <span>24/7 monitoring</span>
            <span>99.2% high confidence</span>
            <span>Enterprise-ready</span>
          </div>
        </div>

        <div className="scanner-card workspace-preview">
          <div className="scanner-head">
            <div>
              <p className="eyebrow">Live scan workspace</p>
              <h3>Move into a separate analysis room</h3>
            </div>
            <span className="status-pill live">● Live</span>
          </div>

          <p className="hero-text">
            Open the dedicated workspace for instant triage, deeper evidence review, and a full verdict view.
          </p>

          <Link to="/workspace" className="primary-btn full-width">Open live workspace</Link>

          <div className="workspace-list">
            <div>
              <span>Selected workflow</span>
              <strong>{activeFeature}</strong>
            </div>
            <div>
              <span>Response time</span>
              <strong>Under 2 min</strong>
            </div>
            <div>
              <span>Signal coverage</span>
              <strong>6 threat vectors</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <p className="eyebrow">PRODUCT SURFACE</p>
          <h3>Every threat vector is covered in one secure workspace.</h3>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <button
              type="button"
              className="feature-card"
              key={feature.title}
              onClick={() => handleFeatureSelect(feature)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h3>A simple workflow for reliable phishing triage.</h3>
        </div>
        <div className="steps-row">
          {steps.map((step, index) => (
            <div className="step-card" key={step}>
              <div className="step-index">0{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage
