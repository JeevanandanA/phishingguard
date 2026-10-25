import DemoScannerPage from '../components/DemoScannerPage'

const insightTemplates = [
  { label: 'Intent signal', value: '⚠ Strong urgency language', tone: 'warn' },
  { label: 'Link trust', value: '⚠ Shortened URL present', tone: 'warn' },
  { label: 'CTA demand', value: '✕ Immediate action demanded', tone: 'danger' },
  { label: 'Sender pattern', value: '⚠ Unverified origin', tone: 'warn' },
]

function SmsScannerPage() {
  const realPresets = [
    { label: 'Safe text', value: 'Your appointment is confirmed for tomorrow.' },
    { label: 'Urgent lock', value: 'Your account will be locked today. Verify your credentials.' },
    { label: 'Reset now', value: 'Click now to reset your password and secure your account.' },
  ]

  const fakePresets = [
    { label: 'Bank lure', value: 'Your bank account requires immediate confirmation. Click the link now.' },
    { label: 'Code scam', value: 'A verification code was sent. Open the link to continue.' },
    { label: 'Threat note', value: 'Threat report: scam SMS impersonating a delivery service' },
  ]

  const analyzeInput = (value, mode) => {
    const lower = value.toLowerCase()
    let result = 'SAFE'
    let score = 24
    let breakdown = insightTemplates

    if (mode === 'fake') {
      result = 'PHISHING'
      score = 93
      breakdown = [
        { label: 'Intent signal', value: '✕ Strong urgency language', tone: 'danger' },
        { label: 'Link trust', value: '✕ Shortened malicious URL', tone: 'danger' },
        { label: 'CTA demand', value: '✕ Immediate action demanded', tone: 'danger' },
        { label: 'Sender pattern', value: '✕ Impersonated bank sender', tone: 'danger' },
      ]
    } else if (lower.includes('account') || lower.includes('locked') || lower.includes('verify')) {
      result = 'SUSPICIOUS'
      score = 68
      breakdown = [
        { label: 'Intent signal', value: '⚠ Urgency language present', tone: 'warn' },
        { label: 'Link trust', value: '⚠ Shortened URL present', tone: 'warn' },
        { label: 'CTA demand', value: '✕ Immediate action demanded', tone: 'danger' },
        { label: 'Sender pattern', value: '⚠ Unverified origin', tone: 'warn' },
      ]
    } else if (lower.includes('click') || lower.includes('password') || lower.includes('now')) {
      result = 'PHISHING'
      score = 90
      breakdown = [
        { label: 'Intent signal', value: '✕ Strong scam language', tone: 'danger' },
        { label: 'Link trust', value: '✕ Suspicious link attached', tone: 'danger' },
        { label: 'CTA demand', value: '✕ Immediate action demanded', tone: 'danger' },
        { label: 'Sender pattern', value: '✕ Impersonated sender', tone: 'danger' },
      ]
    }

    return { result, score, breakdown }
  }

  return (
    <DemoScannerPage
      title="SMS Scanner"
      description="Scan SMS messages for urgency patterns, scam intent, and suspicious links."
      initialValue="Your account will be locked today. Click now to verify your credentials."
      placeholder="Paste SMS content"
      sampleValue="A code has been sent. Click the link to confirm your identity now."
      sampleLabel="Load scam sample"
      analyzeInput={analyzeInput}
      insightTemplates={insightTemplates}
      realPresets={realPresets}
      fakePresets={fakePresets}
    />
  )
}

export default SmsScannerPage
