import { useMemo, useState } from 'react'

function ImageScanPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [result, setResult] = useState('SAFE')
  const [score, setScore] = useState(24)
  const [loading, setLoading] = useState(false)
  const [scanMode, setScanMode] = useState('real')

  const statusClass = useMemo(() => {
    if (result === 'PHISHING') return 'status-danger'
    if (result === 'SUSPICIOUS') return 'status-warn'
    return 'status-safe'
  }, [result])

  const createPreview = (label) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
        <rect width="100%" height="100%" fill="#0b1220" />
        <rect x="40" y="40" width="720" height="420" rx="24" fill="#111c2f" stroke="#38bdf8" stroke-width="4" />
        <circle cx="200" cy="220" r="90" fill="#14b8a6" opacity="0.4" />
        <circle cx="580" cy="220" r="90" fill="#38bdf8" opacity="0.3" />
        <text x="400" y="230" text-anchor="middle" fill="#f8fafc" font-size="36" font-family="Segoe UI, sans-serif">${label}</text>
        <text x="400" y="285" text-anchor="middle" fill="#a7ddff" font-size="20" font-family="Segoe UI, sans-serif">PhishGuard image preview</text>
      </svg>
    `
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }

  const runImageAnalysis = (label, modeValue = scanMode) => {
    setLoading(true)
    setTimeout(() => {
      let nextResult = 'SAFE'
      let nextScore = 24

      if (modeValue === 'fake') {
        nextResult = 'PHISHING'
        nextScore = 96
      } else if (label.toLowerCase().includes('qr') || label.toLowerCase().includes('invoice') || label.toLowerCase().includes('suspicious')) {
        nextResult = 'SUSPICIOUS'
        nextScore = 73
      }

      setResult(nextResult)
      setScore(nextScore)
      setLoading(false)
    }, 1000)
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setSelectedImage(previewUrl)
    runImageAnalysis(file.name, scanMode)
  }

  const handlePresetSelect = (label, modeValue) => {
    setScanMode(modeValue)
    setSelectedImage(createPreview(label))
    runImageAnalysis(label, modeValue)
  }

  return (
    <section className="scanner-page">
      <div className="scanner-card workspace-banner">
        <div>
          <p className="eyebrow">IMAGE SCAN</p>
          <h3>Upload screenshots, flyers, or QR images and simulate a live analysis.</h3>
        </div>
        <div className="workspace-badge-row">
          <span className="status-pill live">● Live</span>
          <span className="status-pill status-warn">Image-based demo</span>
        </div>
      </div>

      <div className="scanner-layout">
        <div className="scanner-card large-card">
          <div className="mode-toggle" role="tablist" aria-label="Image scan mode">
            <button type="button" className={`mode-btn ${scanMode === 'real' ? 'active' : ''}`} onClick={() => setScanMode('real')}>
              Real scan
            </button>
            <button type="button" className={`mode-btn ${scanMode === 'fake' ? 'active' : ''}`} onClick={() => setScanMode('fake')}>
              Fake scan
            </button>
          </div>

          <div className="preset-group">
            <p className="eyebrow">Real image samples</p>
            <div className="preset-grid">
              <button type="button" className="preset-btn" onClick={() => handlePresetSelect('Safe image', 'real')}>Safe image</button>
              <button type="button" className="preset-btn" onClick={() => handlePresetSelect('QR preview', 'real')}>QR preview</button>
              <button type="button" className="preset-btn" onClick={() => handlePresetSelect('Invoice screenshot', 'real')}>Invoice screenshot</button>
            </div>
          </div>

          <div className="preset-group">
            <p className="eyebrow">Fake image samples</p>
            <div className="preset-grid">
              <button type="button" className="preset-btn" onClick={() => handlePresetSelect('Fake login page', 'fake')}>Fake login page</button>
              <button type="button" className="preset-btn" onClick={() => handlePresetSelect('Phish poster', 'fake')}>Phish poster</button>
              <button type="button" className="preset-btn" onClick={() => handlePresetSelect('Scam QR', 'fake')}>Scam QR</button>
            </div>
          </div>

          <label className="input-label" htmlFor="image-upload">Upload suspicious image</label>
          <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
          <button type="button" className="primary-btn full-width" style={{ marginTop: '12px' }} onClick={() => runImageAnalysis('custom upload', scanMode)}>
            {loading ? 'Scanning image…' : 'Run image scan'}
          </button>

          {selectedImage ? (
            <div className="image-preview-wrap">
              <img src={selectedImage} alt="Uploaded preview" className="image-preview" />
            </div>
          ) : (
            <p className="hero-text">Upload a screenshot of a phishing page, QR code, or scam poster to inspect it.</p>
          )}
        </div>

        <div className="scanner-card results-card">
          <div className="result-row">
            <div>
              <p className="eyebrow">Image verdict</p>
              <strong>{score}/100</strong>
            </div>
            <span className={`status-pill ${statusClass}`}>{result}</span>
          </div>
          <div className="analysis-breakdown">
            <div className="analysis-item safe">
              <span>Visual pattern</span>
              <strong>✓ QR or login lure detected</strong>
            </div>
            <div className="analysis-item warn">
              <span>Context check</span>
              <strong>⚠ Brand imitation suspected</strong>
            </div>
            <div className="analysis-item danger">
              <span>Threat note</span>
              <strong>✕ High-risk phishing content</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImageScanPage
