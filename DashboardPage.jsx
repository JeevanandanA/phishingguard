import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'

const initialStats = [
  { label: 'Total Scans', value: '0', trend: 'No reports yet' },
  { label: 'Safe', value: '0%', trend: 'Awaiting analysis' },
  { label: 'Suspicious', value: '0%', trend: 'Awaiting analysis' },
  { label: 'Phishing Detected', value: '0', trend: 'Awaiting analysis' },
]

const fallbackAlerts = [
  { name: 'Finance Portal', score: '92', severity: 'High' },
  { name: 'Invoice Clone', score: '81', severity: 'Medium' },
  { name: 'Cloud Login Spoof', score: '97', severity: 'Critical' },
]

function DashboardPage() {
  const { scanReports } = useAppContext()

  const stats = useMemo(() => {
    if (!scanReports.length) return initialStats

    const safeCount = scanReports.filter((item) => item.result === 'SAFE').length
    const suspiciousCount = scanReports.filter((item) => item.result === 'SUSPICIOUS').length
    const phishingCount = scanReports.filter((item) => item.result === 'PHISHING').length
    const totalScans = scanReports.length

    return [
      { label: 'Total Scans', value: `${totalScans}`, trend: 'Live report queue' },
      { label: 'Safe', value: `${Math.round((safeCount / totalScans) * 100)}%`, trend: `${safeCount} classifications` },
      { label: 'Suspicious', value: `${Math.round((suspiciousCount / totalScans) * 100)}%`, trend: `${suspiciousCount} signals` },
      { label: 'Phishing Detected', value: `${phishingCount}`, trend: `${Math.round((phishingCount / totalScans) * 100)}% of events` },
    ]
  }, [scanReports])

  const alerts = useMemo(() => {
    if (!scanReports.length) return fallbackAlerts

    return scanReports.slice(0, 3).map((item) => ({
      name: item.title,
      score: item.score,
      severity: item.result === 'PHISHING' ? 'Critical' : item.result === 'SUSPICIOUS' ? 'High' : 'Medium',
    }))
  }, [scanReports])

  const liveFeed = useMemo(() => {
    if (!scanReports.length) return 'Monitoring 18.3k packets/minute'

    const latest = scanReports[0]
    return `${latest.title} returned ${latest.result.toLowerCase()} at ${new Date(latest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }, [scanReports])

  const trendBars = useMemo(() => {
    if (!scanReports.length) return [54, 72, 61, 88, 79, 95, 83]

    return Array.from({ length: 7 }, (_, index) => {
      const cutoff = Date.now() - (6 - index) * 24 * 60 * 60 * 1000
      const count = scanReports.filter((item) => new Date(item.createdAt).getTime() >= cutoff).length
      return Math.min(100, 24 + count * 16)
    })
  }, [scanReports])

  return (
    <>
      <section className="dashboard-section">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">SOC DASHBOARD</p>
            <h3>Enterprise-ready visibility for fast response.</h3>
          </div>
          <button type="button" className="ghost-btn">Open workspace</button>
        </div>

        <div className="kpi-grid">
          {stats.map((card) => (
            <article className="kpi-card" key={card.label}>
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <span>{card.trend}</span>
            </article>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="panel large-panel">
            <div className="panel-head">
              <h4>Weekly risk trend</h4>
              <span className="status-pill status-safe">Stable</span>
            </div>
            <div className="bars" aria-label="risk trend chart">
              {trendBars.map((height, index) => (
                <div key={index} className="bar" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="panel side-panel">
            <div className="panel-head">
              <h4>Recent alerts</h4>
              <span className="status-pill live">Updated</span>
            </div>
            <div className="alert-list">
              {alerts.map((alert) => (
                <div className="alert-item" key={alert.name}>
                  <div>
                    <strong>{alert.name}</strong>
                    <p>{alert.severity} risk</p>
                  </div>
                  <span>{alert.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stats-card compact-card">
          <p className="eyebrow">Live activity</p>
          <h4>{liveFeed}</h4>
          <p className="hero-text">PhishGuard is continuously ingesting new intelligence and refreshing risk signals in real time.</p>
        </div>
      </section>
    </>
  )
}

export default DashboardPage
