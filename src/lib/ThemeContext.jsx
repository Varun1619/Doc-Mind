import { createContext, useContext, useState } from 'react'

// ── Theme tokens ───────────────────────────────────────────────────────────
export const themes = {
  dark: {
    bg:           '#07090f',
    bg2:          '#0c0f1a',
    surface:      '#111827',
    surface2:     '#1a2235',
    border:       '#1e2d4a',
    border2:      '#2a3d5e',
    text:         '#e8eef8',
    text2:        '#8fa3c8',
    text3:        '#4a6080',
    accent:       '#3b82f6',
    accent2:      '#60a5fa',
    accentBg:     'rgba(59,130,246,0.08)',
    accentBorder: 'rgba(59,130,246,0.20)',
    glow:         'rgba(59,130,246,0.12)',
    navBg:        'rgba(7,9,15,0.88)',
  },
  light: {
    bg:           '#f6f8fc',
    bg2:          '#ffffff',
    surface:      '#ffffff',
    surface2:     '#eef2ff',
    border:       '#dde4f0',
    border2:      '#c5cfdf',
    text:         '#0f172a',
    text2:        '#475569',
    text3:        '#94a3b8',
    accent:       '#2563eb',
    accent2:      '#3b82f6',
    accentBg:     'rgba(37,99,235,0.06)',
    accentBorder: 'rgba(37,99,235,0.18)',
    glow:         'rgba(37,99,235,0.07)',
    navBg:        'rgba(246,248,252,0.88)',
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
