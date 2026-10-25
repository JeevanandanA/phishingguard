import { useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'

function DemoScannerPage({
  title,
  description,
  initialValue,
  placeholder,
  sampleValue,
  sampleLabel,
  analyzeInput,
  insightTemplates,
  realPresets,
  fakePresets,
}) {
  const [scanMode, setScanMode] = useState('real')
  const [inputValue, setInputValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('SAFE')
  const [score, setScore] = useState(24)
  const [breakdown, setBreakdown] = useState(insightTemplates)
  const { addScanReport } = useAppContext()

  const runAnalysis = async (value, modeValue = scanMode) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, mode: modeValue, source: title }),
      })

      const evaluation = await response.json()
      if (!response.ok || !evaluation?.ok) {
        throw new Error('Backend scan failed')
      }

      setResult(evaluation.result)
      setScore(evaluation.score)
      setBreakdown(evaluation.breakdown ?? insightTemplates)
      addScanReport({
        source: title,
        title,
        result: evaluation.result,
        score: evaluation.score,
        summary: `${value.slice(0, 80)}${value.length > 80 ? '…' : ''}`,
      })
    } catch {
      const evaluation = analyzeInput(value, modeValue)
      setResult(evaluation.result)
      setScore(evaluation.score)
      setBreakdown(evaluation.breakdown ?? insightTemplates)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = () => {
    runAnalysis(inputValue, scanMode)
  }

  const handlePresetSelect = (preset, modeValue) => {
    setScanMode(modeValue)
    setInputValue(preset.value)
    runAnalysis(preset.value, modeValue)
  }

  const handleFillSample = () => {
    setScanMode('real')
    setInputValue(sampleValue)
    runAnalysis(sampleValue, 'real')
  }

  const statusClass = useMemo(() => {
    if (result === 'PHISHING') return 'status-danger'
    if (result === 'SUSPICIOUS') return 'status-warn'
    return 'status-safe'
  }, [result])

  return (
    <section className="scanner-page">
      <div className="scanner-card workspace-banner">
        <div>
          <p className="eyebrow">LIVE DEMO SCANNER</p>
          <h3>{title}</h3>
        </div>
        <div className="workspace-badge-row">
          <span className="status-pill live">● Live</span>
          <span className="status-pill status-warn">Realistic demo</span>
        </div>
      </div>

      <div className="scanner-layout">
        <div className="scanner-card large-card">
          <div className="mode-toggle" role="tablist" aria-label="Scan mode">
            <button
              type="button"
              className={`mode-btn ${scanMode === 'real' ? 'active' : ''}`}
              onClick={() => setScanMode('real')}
            >
              Real scan
            </button>
            <button
              type="button"
              className={`mode-btn ${scanMode === 'fake' ? 'active' : ''}`}
              onClick={() => setScanMode('fake')}
            >
              Fake scan
            </button>
          </div>

          <p className="hero-text">{description}</p>

          <div className="scan-actions">
            <button type="button" className="ghost-btn" onClick={handleFillSample}>
              {sampleLabel}
            </button>
          </div>

          <div className="preset-group">
            <p className="eyebrow">Real scan samples</p>
            <div className="preset-grid">
              {realPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePresetSelect(preset, 'real')}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="preset-group">
            <p className="eyebrow">Fake scan samples</p>
            <div className="preset-grid">
              {fakePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePresetSelect(preset, 'fake')}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <label className="input-label" htmlFor="scanner-input">Paste content to simulate a live scan</label>
          <textarea
            id="scanner-input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            rows="5"
            placeholder={placeholder}
          />

          <button type="button" className="primary-btn full-width" onClick={handleAnalyze}>
            {loading ? 'Scanning…' : 'Run scan'}
          </button>
        </div>

        <div className="scanner-card results-card">
          <div className="result-row">
            <div>
              <p className="eyebrow">Current assessment</p>
              <strong>{score}/100</strong>
            </div>
            <span className={`status-pill ${statusClass}`}>{result}</span>
          </div>

          <div className="gauge" style={{ background: `conic-gradient(${result === 'PHISHING' ? '#ef4444' : result === 'SUSPICIOUS' ? '#f59e0b' : '#4ade80'} 0 ${score}%, rgba(255,255,255,0.08) ${score}% 100%)` }}>
            <div className="gauge-inner">
              <span>{score}</span>
            </div>
          </div>

          <div className="analysis-breakdown">
            {breakdown.map((item) => (
              <div key={item.label} className={`analysis-item ${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoScannerPage
