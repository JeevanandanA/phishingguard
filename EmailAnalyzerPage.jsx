import DemoScannerPage from '../components/DemoScannerPage'

const insightTemplates = [
  { label: 'Sender trust', value: '⚠ Display name spoofed', tone: 'warn' },
  { label: 'Urgency cues', value: '✓ No pressure phrasing', tone: 'safe' },
  { label: 'Attachment check', value: '⚠ Unexpected invoice file', tone: 'warn' },
  { label: 'Impersonation', value: '✕ Finance brand mimicry', tone: 'danger' },
]

function EmailAnalyzerPage() {
  const realPresets = [
    { label: 'Safe note', value: 'Hi team, the monthly report is attached for review.' },
    { label: 'Urgent invoice', value: 'Subject: Urgent invoice update. Please verify your payment details immediately.' },
    { label: 'Reset alert', value: 'Subject: Your account password needs immediate reset.' },
  ]

  const fakePresets = [
    { label: 'Fake portal', value: 'Subject: Action required. Your password reset link is waiting.' },
    { label: 'Bank mimic', value: 'Subject: Secure banking alert. Click to verify account credentials.' },
    { label: 'Threat feed', value: 'Threat report: phishing email impersonating payroll portal' },
  ]

  const analyzeInput = (value, mode) => {
    const lower = value.toLowerCase()
    let result = 'SAFE'
    let score = 24
    let breakdown = insightTemplates

    if (mode === 'fake') {
      result = 'PHISHING'
      score = 94
      breakdown = [
        { label: 'Sender trust', value: '✕ Sender spoofed', tone: 'danger' },
        { label: 'Urgency cues', value: '✕ High-pressure language', tone: 'danger' },
        { label: 'Attachment check', value: '⚠ Invoice lure attached', tone: 'warn' },
        { label: 'Impersonation', value: '✕ Brand clone detected', tone: 'danger' },
      ]
    } else if (lower.includes('urgent') || lower.includes('invoice') || lower.includes('verify') || lower.includes('payment')) {
      result = 'SUSPICIOUS'
      score = 69
      breakdown = [
        { label: 'Sender trust', value: '⚠ Display name spoofed', tone: 'warn' },
        { label: 'Urgency cues', value: '✕ Pressure phrasing detected', tone: 'danger' },
        { label: 'Attachment check', value: '⚠ Unexpected invoice file', tone: 'warn' },
        { label: 'Impersonation', value: '⚠ Finance brand mimicry', tone: 'warn' },
      ]
    } else if (lower.includes('password') || lower.includes('login') || lower.includes('reset')) {
      result = 'PHISHING'
      score = 91
      breakdown = [
        { label: 'Sender trust', value: '✕ Sender spoofed', tone: 'danger' },
        { label: 'Urgency cues', value: '✕ Immediate action demanded', tone: 'danger' },
        { label: 'Attachment check', value: '✓ No attachment detected', tone: 'safe' },
        { label: 'Impersonation', value: '✕ Account security mimicry', tone: 'danger' },
      ]
    }

    return { result, score, breakdown }
  }

  return (
    <DemoScannerPage
      title="Email Analyzer"
      description="Review sender signals, urgency cues, and impersonation patterns in email content."
      initialValue="Subject: Urgent invoice update. Please verify your payment details immediately."
      placeholder="Paste email body or headers"
      sampleValue="Subject: Action required. Your account password needs immediate reset."
      sampleLabel="Load account reset sample"
      analyzeInput={analyzeInput}
      insightTemplates={insightTemplates}
      realPresets={realPresets}
      fakePresets={fakePresets}
    />
  )
}

export default EmailAnalyzerPage
