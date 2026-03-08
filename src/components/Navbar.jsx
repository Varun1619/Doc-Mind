import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react'
import { useTheme } from '../lib/ThemeContext.jsx'
import { Button } from './ui/Button.jsx'

const NAV_LINKS = [
  { label: 'Features',     id: 'features'      },
  { label: 'How it Works', id: 'how-it-works'  },
  { label: 'Stack',        id: 'stack'         },
  { label: 'FAQ',          id: 'faq'           },
]

export default function Navbar() {
  const { isDark, toggle, t } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const isApp     = location.pathname === '/app'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (isApp) { navigate('/'); return }
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background:    scrolled ? t.navBg      : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom:  scrolled ? `1px solid ${t.border}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}
          >
            <div style={{ width: 33, height: 33, borderRadius: 9, background: `linear-gradient(135deg,${t.accent},${t.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 0 16px ${t.glow}` }}>
              <BookOpen size={16} />
            </div>
            <span className="cab" style={{ fontWeight: 900, fontSize: 17, letterSpacing: '-0.03em', color: t.text }}>
              DocMind
            </span>
          </div>

          {/* Desktop nav links — hidden on /app */}
          {!isApp && (
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {NAV_LINKS.map(l => (
                <button
                  key={l.id}
                  className="cab"
                  onClick={() => scrollTo(l.id)}
                  style={{ fontSize: 13.5, fontWeight: 600, color: t.text2, padding: '6px 13px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '-0.01em' }}
                  onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.accentBg }}
                  onMouseLeave={e => { e.currentTarget.style.color = t.text2; e.currentTarget.style.background = 'none' }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme toggle */}
            <button
              onClick={toggle}
              style={{ width: 38, height: 38, borderRadius: 10, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.text2, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.text }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.color = t.text2 }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Launch App / Back */}
            {isApp ? (
              <Button variant="ghost" onClick={() => navigate('/')} style={{ padding: '8px 16px', fontSize: 13 }}>
                ← Back
              </Button>
            ) : (
              <Button variant="primary" onClick={() => navigate('/app')} style={{ padding: '8px 18px', fontSize: 13 }}>
                Launch App <ChevronRight size={13} />
              </Button>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="show-mobile"
              onClick={() => setMenuOpen(v => !v)}
              style={{ width: 38, height: 38, borderRadius: 10, background: t.surface, border: `1px solid ${t.border}`, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.text2, display: 'none' }}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && !isApp && (
          <div style={{ background: isDark ? 'rgba(7,9,15,0.97)' : 'rgba(246,248,252,0.97)', backdropFilter: 'blur(18px)', borderTop: `1px solid ${t.border}`, padding: '10px 20px 18px', animation: 'slideDown 0.18s ease' }}>
            {NAV_LINKS.map(l => (
              <button
                key={l.id}
                className="cab"
                onClick={() => scrollTo(l.id)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px', marginBottom: 2, fontSize: 15, fontWeight: 600, color: t.text2, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8 }}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
