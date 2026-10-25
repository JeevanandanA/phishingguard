import DemoScannerPage from '../components/DemoScannerPage'

const insightTemplates = [
  { label: 'Age signal', value: '⚠ Newly registered', tone: 'warn' },
  { label: 'Registrar', value: '⚠ Private registration', tone: 'warn' },
  { label: 'Reputation', value: '⚠ Low trust cluster', tone: 'warn' },
  { label: 'DNS behavior', value: '✕ Rapid redirect pattern', tone: 'danger' },
]

function DomainIntelligencePage() {
  const realPresets = [
    { label: 'Stable domain', value: 'Domain check: established brand with stable DNS and verified owner.' },
    { label: 'Recent domain', value: 'Domain check: recent registration and redirecting to a fake login portal' },
    { label: 'Impersonation', value: 'Domain check: brand impersonation with private registration' },
  ]

  const fakePresets = [
    { label: 'Fake portal', value: 'Domain check: hidden owner and fake login portal detected' },
    { label: 'Threat host', value: 'Domain check: suspicious hosting cluster linked to scam activity' },
    { label: 'Campaign note', value: 'Threat note: impersonation domain used in phishing campaign' },
  ]

  const analyzeInput = (value, mode) => {
    const lower = value.toLowerCase()
    let result = 'SAFE'
    let score = 24
    let breakdown = insightTemplates

    if (mode === 'fake') {
      result = 'PHISHING'
      score = 97
      breakdown = [
        { label: 'Age signal', value: '✕ Newly registered domain', tone: 'danger' },
        { label: 'Registrar', value: '✕ Private registration', tone: 'danger' },
        { label: 'Reputation', value: '✕ Low trust cluster', tone: 'danger' },
        { label: 'DNS behavior', value: '✕ Rapid redirect pattern', tone: 'danger' },
      ]
    } else if (lower.includes('domain') || lower.includes('registration') || lower.includes('redirect')) {
      result = 'SUSPICIOUS'
      score = 72
      breakdown = [
        { label: 'Age signal', value: '⚠ Recently registered', tone: 'warn' },
        { label: 'Registrar', value: '⚠ Private registration', tone: 'warn' },
        { label: 'Reputation', value: '⚠ Low trust cluster', tone: 'warn' },
        { label: 'DNS behavior', value: '⚠ Redirecting to lookalike portal', tone: 'warn' },
      ]
    } else if (lower.includes('fake') || lower.includes('portal') || lower.includes('login')) {
      result = 'PHISHING'
      score = 93
      breakdown = [
        { label: 'Age signal', value: '✕ Very new domain', tone: 'danger' },
        { label: 'Registrar', value: '✕ Hidden ownership', tone: 'danger' },
        { label: 'Reputation', value: '✕ Low trust cluster', tone: 'danger' },
        { label: 'DNS behavior', value: '✕ Redirecting to fake login portal', tone: 'danger' },
      ]
    }

    return { result, score, breakdown }
  }

  return (
    <DemoScannerPage
      title="Domain Intelligence"
      description="Assess reputation, age, and registrar signals for suspicious domains."
      initialValue="Domain check: recent registration and redirecting to a fake login portal"
      placeholder="Paste domain details or WHOIS notes"
      sampleValue="Domain check: brand impersonation with private registration"
      sampleLabel="Load impersonation sample"
      analyzeInput={analyzeInput}
      insightTemplates={insightTemplates}
      realPresets={realPresets}
      fakePresets={fakePresets}
    />
  )
}

export default DomainIntelligencePage
