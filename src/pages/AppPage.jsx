import Navbar from '../components/Navbar.jsx'
import { useTheme } from '../lib/ThemeContext.jsx'

// This page will be built out in the next phase with the full RAG chat UI.
// For now it renders a clean placeholder so routing works end-to-end.
export default function AppPage() {
  const { t } = useTheme()
  return (
    <div style={{ background: t.bg, minHeight: '100vh', color: t.text, transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16, padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, opacity: 0.3 }}>🚧</div>
        <h1 className="cab" style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-0.03em', color: t.text2 }}>
          RAG Chat — Coming next
        </h1>
        <p style={{ fontSize: 14, color: t.text3, maxWidth: 360, lineHeight: 1.7 }}>
          This page will hold the full document upload, indexing, and chat interface. The landing page and routing are wired up and ready.
        </p>
      </div>
    </div>
  )
}
