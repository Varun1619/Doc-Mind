import { useEffect, useState, useRef } from 'react'

// Pure JS port of the 21st.dev ShootingStars component — no Tailwind needed
export function ShootingStars({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = '#9E00FF',
  trailColor = '#2EB9DF',
  starWidth = 10,
  starHeight = 1,
  style = {},
}) {
  const [star, setStar] = useState(null)
  const svgRef = useRef(null)
  const timeoutRef = useRef(null)

  const getRandomStart = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const side = Math.floor(Math.random() * 4)
    switch (side) {
      case 0: return { x: Math.random() * w, y: 0, angle: 45 }
      case 1: return { x: w, y: Math.random() * h, angle: 135 }
      case 2: return { x: Math.random() * w, y: h, angle: 225 }
      default: return { x: 0, y: Math.random() * h, angle: 315 }
    }
  }

  useEffect(() => {
    const spawn = () => {
      const { x, y, angle } = getRandomStart()
      setStar({
        id: Date.now(),
        x, y, angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      })
      timeoutRef.current = setTimeout(spawn, Math.random() * (maxDelay - minDelay) + minDelay)
    }
    spawn()
    return () => clearTimeout(timeoutRef.current)
  }, [minSpeed, maxSpeed, minDelay, maxDelay])

  useEffect(() => {
    if (!star) return
    const frame = requestAnimationFrame(() => {
      setStar(prev => {
        if (!prev) return null
        const rad = (prev.angle * Math.PI) / 180
        const nx = prev.x + prev.speed * Math.cos(rad)
        const ny = prev.y + prev.speed * Math.sin(rad)
        const nd = prev.distance + prev.speed
        if (nx < -20 || nx > window.innerWidth + 20 || ny < -20 || ny > window.innerHeight + 20) return null
        return { ...prev, x: nx, y: ny, distance: nd, scale: 1 + nd / 100 }
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [star])

  const gradId = `ss-grad-${starColor.replace('#', '')}-${trailColor.replace('#', '')}`

  return (
    <svg
      ref={svgRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
    >
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill={`url(#${gradId})`}
          transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
        />
      )}
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
