import DemoScannerPage from '../components/DemoScannerPage'

const insightTemplates = [
  { label: 'QR decode', value: '✓ Payload extracted', tone: 'safe' },
  { label: 'Destination trust', value: '⚠ Redirect to spoofed portal', tone: 'warn' },
  { label: 'Risk cluster', value: '⚠ Similar to scam kits', tone: 'warn' },
  { label: 'Mobile safety', value: '✕ Opens fake login flow', tone: 'danger' },
]

function QrProtectionPage() {
  const realPresets = [
    { label: 'Safe QR', value: 'QR payload: https://example.org/event' },
    { label: 'Suspicious QR', value: 'QR payload: https://verify-paypal.example-secure.org/login' },
    { label: 'Phish QR', value: 'QR payload: https://login-secure.example-fake.net/reset' },
  ]

  const fakePresets = [
    { label: 'Fake checkout', value: 'QR payload: https://urgent-checkout.example-fake.org/verify' },
    { label: 'Threat card', value: 'QR payload: https://phish.example.net/collect' },
    { label: 'Scam lure', value: 'Threat note: fake login QR distributed in a scam campaign' },
  ]

  const analyzeInput = (value, mode) => {
    const lower = value.toLowerCase()
    let result = 'SAFE'
    let score = 24
    let breakdown = insightTemplates

    if (mode === 'fake') {
      result = 'PHISHING'
      score = 96
      breakdown = [
        { label: 'QR decode', value: '✓ Payload extracted', tone: 'safe' },
        { label: 'Destination trust', value: '✕ Redirect to spoofed portal', tone: 'danger' },
        { label: 'Risk cluster', value: '✕ Known scam kit match', tone: 'danger' },
        { label: 'Mobile safety', value: '✕ Fake login page launched', tone: 'danger' },
      ]
    } else if (lower.includes('paypal') || lower.includes('verify') || lower.includes('login')) {
      result = 'SUSPICIOUS'
      score = 73
      breakdown = [
        { label: 'QR decode', value: '✓ Payload extracted', tone: 'safe' },
        { label: 'Destination trust', value: '⚠ Redirect to spoofed portal', tone: 'warn' },
        { label: 'Risk cluster', value: '⚠ Similar to scam kits', tone: 'warn' },
        { label: 'Mobile safety', value: '⚠ Opens a fake login flow', tone: 'warn' },
      ]
    } else if (lower.includes('threat') || lower.includes('phish') || lower.includes('fake')) {
      result = 'PHISHING'
      score = 92
      breakdown = [
        { label: 'QR decode', value: '✓ Payload extracted', tone: 'safe' },
        { label: 'Destination trust', value: '✕ Redirect to spoofed portal', tone: 'danger' },
        { label: 'Risk cluster', value: '✕ High confidence scam pattern', tone: 'danger' },
        { label: 'Mobile safety', value: '✕ Fake login page launched', tone: 'danger' },
      ]
    }

    return { result, score, breakdown }
  }

  return (
    <DemoScannerPage
      title="QR Protection"
      description="Decode QR payloads and flag unsafe destinations before they open on mobile."
      initialValue="QR payload: https://verify-paypal.example-secure.org/login"
      placeholder="Paste QR payload or encoded content"
      sampleValue="QR payload: https://login-secure.example-fake.net/reset"
      sampleLabel="Load fake QR sample"
      analyzeInput={analyzeInput}
      insightTemplates={insightTemplates}
      realPresets={realPresets}
      fakePresets={fakePresets}
    />
  )
}

export default QrProtectionPage
