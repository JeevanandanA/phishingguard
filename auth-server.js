import http from 'node:http'
import mysql from 'mysql2/promise'

const PORT = process.env.PORT || 5001

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phishguard',
  waitForConnections: true,
  connectionLimit: 10,
}

let pool

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

async function initializeDatabase() {
  const connection = await getPool().getConnection()
  try {
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`
    `)
    await connection.query(`USE \`${dbConfig.database}\``)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } finally {
    connection.release()
  }
}

function getRiskAssessment(text, mode, source) {
  const normalized = (text || '').toLowerCase()
  const keywords = ['verify', 'urgent', 'reset', 'login', 'paypal', 'bank', 'click', 'phish', 'fake', 'password', 'invoice', 'secure', 'suspicious', 'domain', 'qr', 'sms']
  const hits = keywords.filter((keyword) => normalized.includes(keyword))
  const hasUrl = /https?:\/\//.test(normalized)
  const hasUrgency = /(urgent|immediately|now|verify|reset|password)/.test(normalized)
  const hasSpoof = /(paypal|bank|secure|login|fake|invoice|phish)/.test(normalized)

  let result = 'SAFE'
  let score = 24
  let summary = 'No strong threat indicators surfaced yet.'
  let breakdown = [
    { label: 'Signal density', value: `${hits.length} keywords detected`, tone: hits.length > 3 ? 'danger' : 'safe' },
    { label: 'URL presence', value: hasUrl ? 'Link detected' : 'No link detected', tone: hasUrl ? 'warn' : 'safe' },
    { label: 'Pressure cues', value: hasUrgency ? 'Urgency detected' : 'No urgency cues', tone: hasUrgency ? 'warn' : 'safe' },
    { label: 'Impersonation cues', value: hasSpoof ? 'Spoofing signals found' : 'No spoofing cues', tone: hasSpoof ? 'warn' : 'safe' },
  ]

  if (hasUrl || hits.length >= 3) {
    result = 'SUSPICIOUS'
    score = 72
    summary = `Detected ${hits.slice(0, 3).join(', ')} cues and marked the sample as suspicious.`
  }

  if ((hasUrgency && hasSpoof) || hits.length >= 5 || /(phish|fake|urgent|verify|password)/.test(normalized)) {
    result = 'PHISHING'
    score = 94
    summary = 'Found strong impersonation and urgency signals matching a phishing pattern.'
  }

  return { ok: true, source: source || 'backend', result, score, summary, breakdown, mode: mode || 'real' }
}

const server = http.createServer(async (req, res) => {
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
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }))
      }
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', async () => {
      try {
        const payload = body ? JSON.parse(body) : {}
        if (!payload.username || !payload.email || !payload.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'All fields are required' }))
          return
        }

        const connection = await (await getPool()).getConnection()
        try {
          await connection.query('USE `phishguard`')
          await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [payload.username, payload.email, payload.password])
          const [rows] = await connection.query('SELECT id, username, email FROM users WHERE email = ? LIMIT 1', [payload.email])
          const user = rows[0]
          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, user }))
        } catch (error) {
          res.writeHead(409, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: error.message.includes('Duplicate') ? 'Email already exists' : 'Registration failed' }))
        } finally {
          connection.release()
        }
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }))
      }
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', async () => {
      try {
        const payload = body ? JSON.parse(body) : {}
        if (!payload.email || !payload.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'Email and password are required' }))
          return
        }

        const connection = await (await getPool()).getConnection()
        try {
          await connection.query('USE `phishguard`')
          const [rows] = await connection.query('SELECT id, username, email FROM users WHERE email = ? AND password = ? LIMIT 1', [payload.email, payload.password])
          const user = rows[0]
          if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: false, error: 'Invalid email or password' }))
            return
          }
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, user }))
        } finally {
          connection.release()
        }
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }))
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: false, error: 'Not found' }))
})

server.listen(PORT, async () => {
  try {
    await initializeDatabase()
    console.log(`Backend server listening on http://localhost:${PORT}`)
  } catch (error) {
    console.error('Database init failed', error)
  }
})
