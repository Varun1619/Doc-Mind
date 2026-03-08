import { useTheme } from '../../lib/ThemeContext.jsx'

/**
 * Badge — small coloured pill label
 * color: 'accent' | 'green' | 'amber' | 'red' | 'gemini' | 'muted'
 */
export function Badge({ children, color = 'accent', style = {} }) {
  const { t } = useTheme()

  const map = {
    accent: { bg: t.accentBg,            border: t.accentBorder,          text: t.accent2 },
    green:  { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)',  text: '#22c55e' },
    amber:  { bg: 'rgba(245,158,11,0.08)',border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
    red:    { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)',  text: '#ef4444' },
    gemini: { bg: 'rgba(66,133,244,0.08)',border: 'rgba(66,133,244,0.25)', text: '#4285f4' },
    muted:  { bg: t.surface2,             border: t.border,                text: t.text3   },
  }
  const c = map[color] ?? map.accent

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
      ...style,
    }}>
      {children}
    </span>
  )
}
