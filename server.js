import http from 'node:http'

const PORT = process.env.PORT || 5001

function getRiskAssessment(text, mode, source) {
  const normalized = (text || '').toLowerCase()
  const keywords = ['verify', 'urgent', 'reset', 'login', 'paypal', 'bank', 'click', 'phish', 'fake', 'password', 'invoice', 'secure', 'suspicious', 'domain', 'qr', 'sms']
  const hits = keywords.filter((keyword) => normalized.includes(keyword))
  const hasUrl = /https?:\/\//.test(normalized)
  const hasUrgency = /(urgent|immediately|now|verify|reset|password)/.test(normalized)
  const hasSpoof = /(paypal|bank|secure|login|fake|invoice|phish)/.test(normalized)

  let result = 'SAFE'
  let score = 24
  let summary = 'No strong threat indicators surfaced yet. The backend is ready to review the sample.'
  let breakdown = [
    { label: 'Signal density', value: `${hits.length} keywords detected`, tone: hits.length > 3 ? 'danger' : 'safe' },
    { label: 'URL presence', value: hasUrl ? 'Link detected' : 'No link detected', tone: hasUrl ? 'warn' : 'safe' },
    { label: 'Pressure cues', value: hasUrgency ? 'Urgency detected' : 'No urgency cues', tone: hasUrgency ? 'warn' : 'safe' },
    { label: 'Impersonation cues', value: hasSpoof ? 'Spoofing signals found' : 'No spoofing cues', tone: hasSpoof ? 'warn' : 'safe' },
  ]

  if (hasUrl || hits.length >= 3) {
    result = 'SUSPICIOUS'
    score = 72
    summary = `The backend detected ${hits.slice(0, 3).join(', ')} cues and marked the sample as suspicious.`
  }

  if ((hasUrgency && hasSpoof) || hits.length >= 5 || /(phish|fake|urgent|verify|password)/.test(normalized)) {
    result = 'PHISHING'
    score = 94
    summary = 'The backend found strong impersonation and urgency signals matching a phishing pattern.'
  }

  return {
    ok: true,
    source: source || 'backend',
    result,
    score,
    summary,
    breakdown,
    mode: mode || 'real',
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, status: 'ready' }))
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/scan') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {}
        const assessment = getRiskAssessment(payload.text || '', payload.mode || 'real', payload.source || 'backend')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(assessment))
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }))
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: false, error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
