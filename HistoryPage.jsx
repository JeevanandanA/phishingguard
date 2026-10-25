import { useAppContext } from '../context/AppContext'

const fallbackEntries = [
  { id: 1, type: 'URL', input: 'https://secure-bank.example.com', risk: '92', status: 'Phishing', date: '2026-07-29' },
  { id: 2, type: 'Email', input: 'Urgent invoice request', risk: '71', status: 'Suspicious', date: '2026-07-28' },
  { id: 3, type: 'SMS', input: 'Verify your account now', risk: '88', status: 'Phishing', date: '2026-07-27' },
]

function HistoryPage() {
  const { scanReports } = useAppContext()

  const entries = scanReports.length
    ? scanReports.map((report) => ({
        id: report.id,
        type: report.source || report.title,
        input: report.summary || report.title,
        risk: `${report.score}`,
        status: report.result,
        date: new Date(report.createdAt).toLocaleDateString(),
      }))
    : fallbackEntries

  return (
    <section className="history-page">
      <div className="section-heading">
        <p className="eyebrow">SCAN HISTORY</p>
        <h3>Review every assessment and export the report when needed.</h3>
      </div>

      <div className="history-card">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Input</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.type}</td>
                <td>{entry.input}</td>
                <td>{entry.risk}</td>
                <td>{entry.status}</td>
                <td>{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default HistoryPage
