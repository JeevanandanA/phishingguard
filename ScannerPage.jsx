import { useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const toolProfiles = [
  {
    id: 'url',
    title: 'URL Scanner',
    description: 'Inspect domains, redirect chains, and malicious landing pages.',
    sample: 'https://secure-bank.example.com/login',
    placeholder: 'Paste a suspicious URL...',
    insights: [
      { label: 'HTTPS check', value: '✓ Secure handshake', tone: 'safe' },
      { label: 'Domain age', value: '⚠ Recent registration', tone: 'warn' },
      { label: 'Redirect chain', value: '⚠ Suspicious hop', tone: 'warn' },
      { label: 'Threat match', value: '✕ Known phishing pattern', tone: 'danger' },
    ],
  },
  {
    id: 'email',
    title: 'Email Analyzer',
    description: 'Review sender signals, urgency cues, and impersonation text.',
    sample: 'Subject: Urgent invoice update. Please verify your payment details immediately.',
    placeholder: 'Paste email content or headers...',
    insights: [
      { label: 'Sender trust', value: '⚠ Display name spoofed', tone: 'warn' },
      { label: 'Urgency cues', value: '✕ High-pressure language', tone: 'danger' },
      { label: 'Payload check', value: '✓ No attachment detected', tone: 'safe' },
      { label: 'Impersonation', value: '⚠ Finance brand mimicry', tone: 'warn' },
    ],
  },
  {
    id: 'qr',
    title: 'QR Protection',
    description: 'Decode QR payloads and flag unsafe destinations before they open.',
    sample: 'QR payload: https://verify-paypal.example-secure.org/login',
    placeholder: 'Paste QR payload or encoded content...',
    insights: [
      { label: 'QR decode', value: '✓ Payload extracted', tone: 'safe' },
      { label: 'Destination trust', value: '⚠ Redirect to spoofed portal', tone: 'warn' },
      { label: 'Risk cluster', value: '✕ Similar to known scam kits', tone: 'danger' },
      { label: 'Mobile safety', value: '⚠ Opens a fake login flow', tone: 'warn' },
    ],
  },
  {
    id: 'sms',
    title: 'SMS Scanner',
    description: 'Flag scam-language patterns and account-pressure messaging.',
    sample: 'Your account will be locked today. Click now to verify your credentials.',
    placeholder: 'Paste SMS content...',
    insights: [
      { label: 'Intent signal', value: '✕ Strong urgency language', tone: 'danger' },
      { label: 'Link trust', value: '⚠ Shortened URL present', tone: 'warn' },
      { label: 'Call-to-action', value: '✕ Immediate action demanded', tone: 'danger' },
      { label: 'Sender pattern', value: '✓ Unverified origin', tone: 'warn' },
    ],
  },
  {
    id: 'domain',
    title: 'Domain Intelligence',
    description: 'Assess reputation, age, and registrar signals for suspicious domains.',
    sample: 'Domain check: recent registration and redirecting to a fake login portal',
    placeholder: 'Paste domain or WHOIS-style details...',
    insights: [
      { label: 'Age signal', value: '⚠ Newly registered', tone: 'warn' },
      { label: 'Registrar', value: '⚠ Private registration', tone: 'warn' },
      { label: 'Reputation', value: '✕ Low trust cluster', tone: 'danger' },
      { label: 'DNS behavior', value: '⚠ Rapid redirect pattern', tone: 'warn' },
    ],
  },
  {
    id: 'ai',
    title: 'AI Threat Engine',
    description: 'Blend live heuristics and threat feeds for a unified verdict.',
    sample: 'Threat feed: suspicious link pattern matched to known phishing clusters',
    placeholder: 'Paste evidence or threat summary...',
    insights: [
      { label: 'Feed match', value: '✕ Known campaign overlap', tone: 'danger' },
      { label: 'Heuristic score', value: '⚠ High confidence impersonation', tone: 'warn' },
      { label: 'Behavior model', value: '✓ Adaptive anomaly check', tone: 'safe' },
      { label: 'Verdict', value: '⚠ Escalate to SOC queue', tone: 'warn' },
    ],
  },
]

function ScannerPage() {
  const [selectedTool, setSelectedTool] = useState(toolProfiles[0].id)
  const [inputValue, setInputValue] = useState(toolProfiles[0].sample)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('SUSPICIOUS')
  const [score, setScore] = useState(71)
  const { addScanReport } = useAppContext()

  const activeTool = toolProfiles.find((tool) => tool.id === selectedTool) ?? toolProfiles[0]

  const evaluateInput = (value, toolId) => {
    const lower = value.toLowerCase()
    let nextResult = 'SAFE'
    let nextScore = 24

    if (toolId === 'url' || toolId === 'email' || toolId === 'qr' || toolId === 'sms' || toolId === 'domain' || toolId === 'ai') {
      if (lower.includes('secure') || lower.includes('paypal') || lower.includes('bank') || lower.includes('login')) {
        nextResult = 'SUSPICIOUS'
        nextScore = 71
      }
      if (lower.includes('verify') || lower.includes('urgent') || lower.includes('update') || lower.includes('threat') || lower.includes('phishing') || lower.includes('fake')) {
        nextResult = 'PHISHING'
        nextScore = 95
      }
    }

    return { nextResult, nextScore }
  }

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, mode: 'real', source: activeTool.title }),
      })

      const evaluation = await response.json()
      if (!response.ok || !evaluation?.ok) {
        throw new Error('Backend scan failed')
      }

      setResult(evaluation.result)
      setScore(evaluation.score)
      addScanReport({
        source: activeTool.title,
        title: activeTool.title,
        result: evaluation.result,
        score: evaluation.score,
        summary: `${inputValue.slice(0, 80)}${inputValue.length > 80 ? '…' : ''}`,
      })
    } catch {
      const { nextResult, nextScore } = evaluateInput(inputValue, selectedTool)
      setResult(nextResult)
      setScore(nextScore)
    } finally {
      setLoading(false)
    }
  }

  const handleToolSelect = (toolId) => {
    const tool = toolProfiles.find((profile) => profile.id === toolId) ?? toolProfiles[0]
    setSelectedTool(tool.id)
    setInputValue(tool.sample)
    const { nextResult, nextScore } = evaluateInput(tool.sample, tool.id)
    setResult(nextResult)
    setScore(nextScore)
  }

  const statusClass = useMemo(() => {
    if (result === 'PHISHING') return 'status-danger'
    if (result === 'SUSPICIOUS') return 'status-warn'
    return 'status-safe'
  }, [result])

  const breakdown = useMemo(() => {
    return activeTool.insights.map((item) => ({ ...item }))
  }, [activeTool])

  return (
    <section className="scanner-page">
      <div className="scanner-card workspace-banner">
        <div>
          <p className="eyebrow">LIVE SCAN WORKSPACE</p>
          <h3>Operate every threat signal from one dedicated response surface.</h3>
        </div>
        <div className="workspace-badge-row">
          <span className="status-pill live">● Active</span>
          <span className="status-pill status-warn">Queue 8</span>
        </div>
      </div>

      <div className="scanner-layout">
        <div className="scanner-card large-card">
          <div className="tool-grid" role="list">
            {toolProfiles.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`tool-chip ${selectedTool === tool.id ? 'active' : ''}`}
                onClick={() => handleToolSelect(tool.id)}
              >
                {tool.title}
              </button>
            ))}
          </div>

          <div className="tool-panel">
            <div className="tool-panel-head">
              <div>
                <p className="eyebrow">Selected module</p>
                <h4>{activeTool.title}</h4>
              </div>
              <span className="status-pill status-safe">Ready</span>
            </div>
            <p className="hero-text">{activeTool.description}</p>
            <div className="quick-links">
              <a href="/url-scanner">URL Scanner</a>
              <a href="/email-analyzer">Email Analyzer</a>
              <a href="/qr-protection">QR Protection</a>
              <a href="/sms-scanner">SMS Scanner</a>
              <a href="/domain-intelligence">Domain Intelligence</a>
              <a href="/ai-threat-engine">AI Threat Engine</a>
              <a href="/image-scan">Image Scan</a>
            </div>
            <label className="input-label" htmlFor="scanner-input">{activeTool.placeholder}</label>
            <textarea
              id="scanner-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              rows="5"
            />
            <button type="button" className="primary-btn full-width" onClick={handleAnalyze}>
              {loading ? 'Scanning…' : 'Analyze now'}
            </button>
          </div>
        </div>

        <div className="scanner-card results-card">
          <div className="result-row">
            <div>
              <p className="eyebrow">Current assessment</p>
              <strong>{score}/100</strong>
            </div>
            <span className={`status-pill ${statusClass}`}>{result}</span>
          </div>

          <div className="gauge" style={{ background: `conic-gradient(${result === 'PHISHING' ? '#ef4444' : result === 'SUSPICIOUS' ? '#f59e0b' : '#4ade80'} 0 ${score}%, rgba(255,255,255,0.08) ${score}% 100%)` }}>
            <div className="gauge-inner">
              <span>{score}</span>
            </div>
          </div>

          <div className="analysis-breakdown">
            {breakdown.map((item) => (
              <div key={item.label} className={`analysis-item ${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScannerPage
