import { useTheme } from '../../lib/ThemeContext.jsx'

/**
 * Button variants: 'primary' | 'ghost' | 'icon'
 */
export function Button({ children, variant = 'primary', onClick, disabled, style = {}, ...props }) {
  const { t } = useTheme()

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    borderRadius: 11, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
    fontWeight: 700, letterSpacing: '-0.01em', border: 'none',
    transition: 'all 0.18s', opacity: disabled ? 0.5 : 1,
  }

  const variants = {
    primary: {
      ...base,
      padding: '11px 24px', fontSize: 14,
      background: t.accent, color: '#fff',
    },
    ghost: {
      ...base,
      padding: '11px 22px', fontSize: 14,
      background: t.accentBg, color: t.accent,
      border: `1px solid ${t.accentBorder}`,
    },
    icon: {
      ...base,
      width: 38, height: 38, padding: 0,
      justifyContent: 'center',
      background: t.surface, color: t.text2,
      border: `1px solid ${t.border}`,
      borderRadius: 10,
    },
  }

  const handleMouseEnter = (e) => {
    if (disabled) return
    if (variant === 'primary') {
      e.currentTarget.style.background = t.accent2
      e.currentTarget.style.transform = 'translateY(-1px)'
      e.currentTarget.style.boxShadow = `0 8px 28px ${t.glow}`
    } else if (variant === 'ghost') {
      e.currentTarget.style.background = t.accentBorder
      e.currentTarget.style.transform = 'translateY(-1px)'
    } else {
      e.currentTarget.style.borderColor = t.border2
      e.currentTarget.style.color = t.text
      e.currentTarget.style.background = t.surface2
    }
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = variants[variant].background
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.borderColor = variants[variant].borderColor ?? ''
    e.currentTarget.style.color = variants[variant].color
  }

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
