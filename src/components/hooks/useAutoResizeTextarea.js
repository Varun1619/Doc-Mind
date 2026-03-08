import { useEffect, useRef, useCallback } from 'react'

export function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null)

  const adjustHeight = useCallback((reset) => {
    const el = textareaRef.current
    if (!el) return
    if (reset) { el.style.height = `${minHeight}px`; return }
    el.style.height = `${minHeight}px`
    const newH = Math.max(minHeight, Math.min(el.scrollHeight, maxHeight ?? Infinity))
    el.style.height = `${newH}px`
  }, [minHeight, maxHeight])

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`
  }, [minHeight])

  useEffect(() => {
    const h = () => adjustHeight()
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}
