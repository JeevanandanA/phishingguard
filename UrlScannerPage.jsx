import DemoScannerPage from '../components/DemoScannerPage'

const insightTemplates = [
  { label: 'HTTPS check', value: '✓ Secure handshake', tone: 'safe' },
  { label: 'Domain age', value: '⚠ Recent registration', tone: 'warn' },
  { label: 'Redirect trail', value: '⚠ Suspicious hop', tone: 'warn' },
  { label: 'Threat match', value: '✕ Known phishing pattern', tone: 'danger' },
]

function UrlScannerPage() {
  const realPresets = [
    { label: 'Safe URL', value: 'https://example.org/news' },
    { label: 'Suspicious login', value: 'https://secure-bank.example.com/login' },
    { label: 'Phish verify', value: 'https://verify-paypal.example-secure.org/login' },
  ]

  const fakePresets = [
    { label: 'Fake reset', value: 'https://login-secure.example-fake.net/reset' },
    { label: 'Urgent payment', value: 'https://urgent-verify.example-fake.org/payment' },
    { label: 'Threat cluster', value: 'Threat feed: suspicious link pattern matched to known phishing clusters' },
  ]

  const analyzeInput = (value, mode) => {
    const lower = value.toLowerCase()
    const hasUrl = /https?:\/\//.test(lower)
    const hasUrgency = /(urgent|immediately|verify|reset|now|update)/.test(lower)
    const hasBanking = /(paypal|bank|login|secure|invoice|payment)/.test(lower)
    const hasThreat = /(phish|fake|scam|threat|malicious|suspicious)/.test(lower)

    let result = 'SAFE'
    let score = 24 + Math.min(20, Math.max(0, lower.length / 20))
    let breakdown = insightTemplates

    if (mode === 'fake' || hasThreat) {
      result = 'PHISHING'
      score = Math.min(99, 78 + (hasUrgency ? 8 : 0) + (hasBanking ? 6 : 0) + (hasUrl ? 5 : 0))
      breakdown = [
        { label: 'HTTPS check', value: hasUrl ? '⚠ TLS present but deceptive' : '✓ Secure handshake', tone: hasUrl ? 'warn' : 'safe' },
        { label: 'Domain age', value: '⚠ Fresh domain', tone: 'warn' },
        { label: 'Redirect trail', value: '✕ Fake login redirect', tone: 'danger' },
        { label: 'Threat match', value: '✕ Linked to scam campaign', tone: 'danger' },
      ]
    } else if (hasUrgency || hasBanking) {
      result = 'SUSPICIOUS'
      score = Math.min(90, 54 + (hasUrgency ? 12 : 0) + (hasBanking ? 10 : 0) + (hasUrl ? 6 : 0))
      breakdown = [
        { label: 'HTTPS check', value: hasUrl ? '✓ Secure handshake' : '⚠ Partial trust signal', tone: hasUrl ? 'safe' : 'warn' },
        { label: 'Domain age', value: '⚠ Recent registration', tone: 'warn' },
        { label: 'Redirect trail', value: '⚠ Suspicious hop', tone: 'warn' },
        { label: 'Threat match', value: '⚠ Similar to impersonation kits', tone: 'warn' },
      ]
    }

    return { result, score, breakdown }
  }

  return (
    <DemoScannerPage
      title="URL Scanner"
      description="Inspect suspicious URLs, check redirect flows, and isolate impersonation landing pages."
      initialValue="https://secure-bank.example.com/login"
      placeholder="Paste a suspicious URL"
      sampleValue="https://verify-paypal.example-secure.org/login"
      sampleLabel="Load phishing sample"
      analyzeInput={analyzeInput}
      insightTemplates={insightTemplates}
      realPresets={realPresets}
      fakePresets={fakePresets}
    />
  )
}

export default UrlScannerPage
