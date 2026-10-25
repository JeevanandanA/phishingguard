import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const scanGuideMap = {
  '/url-scanner': {
    title: 'URL Scanner',
    steps: ['Paste a suspicious URL.', 'Choose the scan mode.', 'Run the AI review to see the verdict.'],
  },
  '/email-analyzer': {
    title: 'Email Analyzer',
    steps: ['Paste the email body or headers.', 'Look for urgency cues and impersonation markers.', 'Run the AI review for a live verdict.'],
  },
  '/qr-protection': {
    title: 'QR Protection',
    steps: ['Paste the QR payload or destination.', 'Check whether it points to a spoofed portal.', 'Let the AI scan validate the risk.'],
  },
  '/sms-scanner': {
    title: 'SMS Scanner',
    steps: ['Paste the SMS content.', 'Watch for pressure language and shortened links.', 'Use the live AI scan for a quick verdict.'],
  },
  '/domain-intelligence': {
    title: 'Domain Intelligence',
    steps: ['Paste the domain or WHOIS hints.', 'Review age, registrar, and reputation signals.', 'Run the AI insight engine to rank the threat.'],
  },
  '/ai-threat-engine': {
    title: 'AI Threat Engine',
    steps: ['Paste evidence or threat notes.', 'Let the engine connect the signals.', 'Run the AI verdict for a SOC-style response.'],
  },
  '/image-scan': {
    title: 'Image Scan',
    steps: ['Upload or reference an image.', 'Inspect visual spoofing indicators.', 'Use the AI review to confirm suspicious content.'],
  },
  '/workspace': {
    title: 'Workspace',
    steps: ['Pick a scan module.', 'Drop in real-world evidence.', 'Run the AI scan to get instant context.'],
  },
}

const qaBank = [
  {
    question: 'How do I scan a suspicious URL?',
    answer: 'Paste the URL into the URL Scanner, then run the scan. The assistant will identify suspicious structure, impersonation cues, and redirect risk.',
  },
  {
    question: 'How can I spot a phishing email?',
    answer: 'Look for urgency, spoofed sender names, unexpected payment requests, and password-reset language. The Email Analyzer can flag those signals quickly.',
  },
  {
    question: 'What should I do with a risky QR code?',
    answer: 'Decode the destination and inspect whether it leads to a fake portal. The QR Protection flow is designed for that exact review.',
  },
  {
    question: 'How does the SMS scanner help?',
    answer: 'It detects pressure language, short-link usage, and account-lock warnings that often appear in scam messages.',
  },
  {
    question: 'How do I analyze a suspicious domain?',
    answer: 'Check the domain age, registrar details, and reputation signals. Domain Intelligence highlights newly registered or low-trust indicators.',
  },
  {
    question: 'What is the AI threat engine for?',
    answer: 'It combines multiple signals into a single verdict so analysts can review the threat with more context in one place.',
  },
  {
    question: 'Can the bot help with live analysis?',
    answer: 'Yes. As you type or paste content into the scanner, the assistant evaluates the input and suggests whether it looks safe, suspicious, or phishing-like.',
  },
  {
    question: 'How do I use the workspace?',
    answer: 'Open the Workspace, pick a scan module, enter content, and run the analysis. The results will feed into the dashboard and history.',
  },
  {
    question: 'What does a suspicious result mean?',
    answer: 'It means the sample contains enough indicators to warrant review, but it may not be a confirmed phishing attack yet.',
  },
  {
    question: 'What should I do if the result is phishing likely?',
    answer: 'Escalate it for immediate review, block the sender or destination, and document the evidence in the workspace or history.',
  },
  {
    question: 'How is the score calculated?',
    answer: 'The score is based on the signals found in your input, including urgency, impersonation language, link structure, and known phishing markers.',
  },
  {
    question: 'Can I use this for real-world incident response?',
    answer: 'Yes, this workflow is designed to mimic a practical SOC-style response process for investigating suspicious messages, URLs, and evidence.',
  },
]

function getCurrentTextValue() {
  if (typeof document === 'undefined') return ''

  const textarea = document.querySelector('textarea')
  if (textarea && textarea.value) {
    return textarea.value
  }

  const textInput = document.querySelector('input[type="text"], input:not([type]), input[type="search"]')
  return textInput?.value || ''
}

function analyzeLiveData(value, route) {
  const lower = (value || '').toLowerCase()
  const keywords = ['verify', 'urgent', 'reset', 'login', 'paypal', 'bank', 'click', 'phish', 'fake', 'password', 'secure', 'invoice', 'suspicious', 'qr', 'sms', 'domain']
  const hits = keywords.filter((word) => lower.includes(word))
  const hasUrl = /https?:\/\//.test(lower)
  const hasUrgency = /(urgent|immediately|now|verify|reset|password)/.test(lower)
  const hasSpoof = /(paypal|bank|secure|login|fake|phish|invoice)/.test(lower)

  let verdict = 'Low risk'
  let score = 24
  let summary = 'No strong threat indicators surfaced yet. The assistant is waiting for stronger signals.'
  let nextAction = 'Paste a suspicious sample and the assistant will highlight the likely risk.'

  if (hasUrl || hits.length >= 3) {
    verdict = 'Suspicious'
    score = 72
    summary = `The assistant detected ${hits.slice(0, 3).join(', ')} cues and is flagging the entry as suspicious.`
    nextAction = 'Review the URL or text structure closely and compare it with known impersonation patterns.'
  }

  if (hasUrgency && hasSpoof || hits.length >= 5 || /(phish|fake|urgent|verify|password)/.test(lower)) {
    verdict = 'Phishing likely'
    score = 94
    summary = 'The assistant found strong impersonation language and high-pressure behavior that closely matches phishing patterns.'
    nextAction = 'Escalate this sample to the workspace review queue and block the sender or destination immediately.'
  }

  return {
    verdict,
    score,
    summary,
    nextAction,
    routeLabel: scanGuideMap[route]?.title || 'Live scanner',
  }
}

function FloatingAssistant() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [liveInput, setLiveInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I can help you understand the scan workflow, explain the result, and guide you through the live analysis process.',
    },
  ])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const syncInput = () => setLiveInput(getCurrentTextValue())
    syncInput()

    document.addEventListener('input', syncInput, true)
    return () => document.removeEventListener('input', syncInput, true)
  }, [location.pathname])

  const guide = useMemo(() => scanGuideMap[location.pathname] ?? scanGuideMap['/workspace'], [location.pathname])
  const aiResult = useMemo(() => analyzeLiveData(liveInput, location.pathname), [liveInput, location.pathname])
  const suggestedQuestions = useMemo(() => qaBank.slice(0, 6), [])

  const handleSend = (event) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return

    const lower = trimmed.toLowerCase()
    let answer = 'I can help with scan setup, threat explanation, and live response steps. Try one of the suggested questions above.'

    if (lower.includes('url') || lower.includes('link')) {
      answer = 'Paste the URL into the scanner and review the trust signals. If the link uses urgency or impersonation cues, the result will move toward suspicious or phishing likely.'
    } else if (lower.includes('email')) {
      answer = 'Check for spoofed sender names, urgent payment requests, and password-reset language. The Email Analyzer is designed to highlight those signals.'
    } else if (lower.includes('qr')) {
      answer = 'Decode the QR payload and inspect the destination. If it points to a fake login page, it should be treated as suspicious.'
    } else if (lower.includes('sms')) {
      answer = 'Look for pressure tactics, shortened links, and account lock warnings. Those are common indicators in scam SMS content.'
    } else if (lower.includes('domain')) {
      answer = 'Review the domain age, registrar details, and reputation signals. New or low-trust domains often appear in phishing campaigns.'
    } else if (lower.includes('score')) {
      answer = 'The score rises when the input contains more risk indicators such as urgency, impersonation phrases, suspicious URLs, or fake login language.'
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: 'user', text: trimmed },
      { id: Date.now() + 1, sender: 'bot', text: answer },
    ])
    setDraft('')
  }

  return (
    <>
      <button type="button" className="assistant-launcher" onClick={() => setOpen((value) => !value)} aria-label="Open AI assistant">
        <span>🤖</span>
      </button>

      {open ? (
        <div className="assistant-panel" role="dialog" aria-label="PhishGuard AI assistant">
          <div className="assistant-head">
            <div>
              <p className="eyebrow">PHISHGUARD AI</p>
              <h4>Mini assistant</h4>
            </div>
            <button type="button" className="ghost-btn compact-btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="assistant-card live-card">
            <p className="assistant-title">Live AI scan</p>
            <strong>{aiResult.verdict}</strong>
            <p>{aiResult.summary}</p>
            <p>{aiResult.nextAction}</p>
            <span>{aiResult.routeLabel}</span>
          </div>

          <div className="assistant-card chat-card">
            <div className="assistant-chat">
              {messages.map((message) => (
                <div key={message.id} className={`chat-bubble ${message.sender}`}>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <form className="assistant-form" onSubmit={handleSend}>
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about scanning, results, or workflow..."
              />
              <button type="submit" className="primary-btn">Send</button>
            </form>
          </div>

          <div className="assistant-card">
            <p className="assistant-title">How to use this scan</p>
            <ul>
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="assistant-card">
            <p className="assistant-title">Suggested questions</p>
            <div className="assistant-qa-list">
              {suggestedQuestions.map((item) => (
                <div key={item.question} className="assistant-qa-item">
                  <strong>{item.question}</strong>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="assistant-card">
            <p className="assistant-title">All scan types</p>
            <div className="assistant-tags">
              <span>URL</span>
              <span>Email</span>
              <span>QR</span>
              <span>SMS</span>
              <span>Domain</span>
              <span>AI</span>
              <span>Image</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default FloatingAssistant
