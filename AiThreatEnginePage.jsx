import DemoScannerPage from '../components/DemoScannerPage'

const insightTemplates = [
  { label: 'Feed match', value: '⚠ Partial overlap', tone: 'warn' },
  { label: 'Heuristic score', value: '✓ Adaptive anomaly check', tone: 'safe' },
  { label: 'Behavior model', value: '⚠ High confidence impersonation', tone: 'warn' },
  { label: 'Verdict', value: '⚠ Escalate to SOC queue', tone: 'warn' },
]

function AiThreatEnginePage() {
  const realPresets = [
    { label: 'Normal feed', value: 'Threat feed: no new indicators observed.' },
    { label: 'Suspicious cluster', value: 'Threat feed: suspicious link pattern matched to known phishing clusters' },
    { label: 'Alert', value: 'Alert: fake login campaign detected across multiple domains' },
  ]

  const fakePresets = [
    { label: 'Fake alert', value: 'Threat alert: impersonation campaign targeting payroll users' },
    { label: 'Mimic signal', value: 'Behavior model: impersonation signal tied to scam automation' },
    { label: 'Campaign note', value: 'Threat intelligence: malicious campaign detected in the wild' },
  ]

  const analyzeInput = (value, mode) => {
    const lower = value.toLowerCase()
    let result = 'SAFE'
    let score = 24
    let breakdown = insightTemplates

    if (mode === 'fake') {
      result = 'PHISHING'
      score = 98
      breakdown = [
        { label: 'Feed match', value: '✕ Known campaign overlap', tone: 'danger' },
        { label: 'Heuristic score', value: '✕ High-confidence mimicry', tone: 'danger' },
        { label: 'Behavior model', value: '✕ Suspicious automation pattern', tone: 'danger' },
        { label: 'Verdict', value: '✕ Escalate immediately', tone: 'danger' },
      ]
    } else if (lower.includes('threat') || lower.includes('cluster') || lower.includes('campaign')) {
      result = 'SUSPICIOUS'
      score = 74
      breakdown = [
        { label: 'Feed match', value: '⚠ Partial overlap', tone: 'warn' },
        { label: 'Heuristic score', value: '⚠ Adaptive anomaly check', tone: 'warn' },
        { label: 'Behavior model', value: '⚠ High-confidence impersonation', tone: 'warn' },
        { label: 'Verdict', value: '⚠ Escalate to SOC queue', tone: 'warn' },
      ]
    } else if (lower.includes('alert') || lower.includes('phish') || lower.includes('fake')) {
      result = 'PHISHING'
      score = 95
      breakdown = [
        { label: 'Feed match', value: '✕ Known campaign overlap', tone: 'danger' },
        { label: 'Heuristic score', value: '✕ High-confidence mimicry', tone: 'danger' },
        { label: 'Behavior model', value: '✕ Suspicious automation pattern', tone: 'danger' },
        { label: 'Verdict', value: '✕ Escalate immediately', tone: 'danger' },
      ]
    }

    return { result, score, breakdown }
  }

  return (
    <DemoScannerPage
      title="AI Threat Engine"
      description="Blend threat feeds, heuristics, and behavior analysis into one verdict engine."
      initialValue="Threat feed: suspicious link pattern matched to known phishing clusters"
      placeholder="Paste threat intelligence or evidence"
      sampleValue="Alert: fake login campaign detected across multiple domains"
      sampleLabel="Load threat alert"
      analyzeInput={analyzeInput}
      insightTemplates={insightTemplates}
      realPresets={realPresets}
      fakePresets={fakePresets}
    />
  )
}

export default AiThreatEnginePage
