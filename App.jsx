import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import ScannerPage from './pages/ScannerPage'
import UrlScannerPage from './pages/UrlScannerPage'
import EmailAnalyzerPage from './pages/EmailAnalyzerPage'
import QrProtectionPage from './pages/QrProtectionPage'
import SmsScannerPage from './pages/SmsScannerPage'
import DomainIntelligencePage from './pages/DomainIntelligencePage'
import AiThreatEnginePage from './pages/AiThreatEnginePage'
import ImageScanPage from './pages/ImageScanPage'
import AuthPage from './pages/AuthPage'
import './App.css'

function ProtectedRoute() {
  const { authUser } = useAppContext()

  if (!authUser) {
    return <Navigate to="/auth" replace />
  }

  return <Layout />
}

function PublicRoute() {
  const { authUser } = useAppContext()

  if (authUser) {
    return <Navigate to="/dashboard" replace />
  }

  return <AuthPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<PublicRoute />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workspace" element={<ScannerPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/url-scanner" element={<UrlScannerPage />} />
          <Route path="/email-analyzer" element={<EmailAnalyzerPage />} />
          <Route path="/qr-protection" element={<QrProtectionPage />} />
          <Route path="/sms-scanner" element={<SmsScannerPage />} />
          <Route path="/domain-intelligence" element={<DomainIntelligencePage />} />
          <Route path="/ai-threat-engine" element={<AiThreatEnginePage />} />
          <Route path="/image-scan" element={<ImageScanPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
