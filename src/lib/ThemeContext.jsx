import { createContext, useContext, useState } from 'react'

// ── Theme tokens ───────────────────────────────────────────────────────────
export const themes = {
  dark: {
    bg:           '#0f0707',
    bg2:          '#120a0a',
    surface:      '#1a0f0f',
    surface2:     '#221414',
    border:       '#3a1a1a',
    border2:      '#4e2020',
    text:         '#f8eaea',
    text2:        '#c8a0a0',
    text3:        '#7a4040',
    accent:       '#ef4444',
    accent2:      '#f87171',
    accentBg:     'rgba(239,68,68,0.08)',
    accentBorder: 'rgba(239,68,68,0.20)',
    glow:         'rgba(239,68,68,0.12)',
    navBg:        'rgba(15,7,7,0.88)',
  },
  light: {
    bg:           '#fdf6f6',
    bg2:          '#ffffff',
    surface:      '#ffffff',
    surface2:     '#fff0f0',
    border:       '#f0d8d8',
    border2:      '#dfc0c0',
    text:         '#1a0a0a',
    text2:        '#5a3030',
    text3:        '#a07070',
    accent:       '#dc2626',
    accent2:      '#ef4444',
    accentBg:     'rgba(220,38,38,0.06)',
    accentBorder: 'rgba(220,38,38,0.18)',
    glow:         'rgba(220,38,38,0.07)',
    navBg:        'rgba(253,246,246,0.88)',
  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const t = themes[isDark ? 'dark' : 'light']
  const toggle = () => setIsDark(v => !v)
  return (
    <ThemeContext.Provider value={{ isDark, toggle, t }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
