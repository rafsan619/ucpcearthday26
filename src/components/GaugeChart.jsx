import { useEffect, useRef, useState } from 'react'

export default function GaugeChart({ score, maxScore = 110 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const svgRef = useRef(null)

  const percentage = Math.min((animatedScore / maxScore) * 100, 100)

  // Gauge arc calculation — semicircle
  const radius = 90
  const circumference = Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Color based on score
  let color, label, bgGlow
  if (percentage <= 33) {
    color = '#34d399' // green
    label = 'Low Impact'
    bgGlow = 'rgba(52, 211, 153, 0.12)'
  } else if (percentage <= 66) {
    color = '#fbbf24' // amber
    label = 'Medium Impact'
    bgGlow = 'rgba(251, 191, 36, 0.12)'
  } else {
    color = '#f87171' // red
    label = 'High Impact'
    bgGlow = 'rgba(248, 113, 113, 0.12)'
  }

  useEffect(() => {
    let start = 0
    const end = score
    const duration = 1200
    const startTime = performance.now()

    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 240, height: 140 }}>
        <svg
          ref={svgRef}
          viewBox="0 0 200 120"
          className="w-full h-full"
        >
          {/* Background arc */}
          <path
            d="M 10 110 A 90 90 0 0 1 190 110"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 10 110 A 90 90 0 0 1 190 110"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="gauge-arc"
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
          {/* Score text */}
          <text
            x="100"
            y="90"
            textAnchor="middle"
            className="fill-white font-display"
            style={{ fontSize: '36px', fontWeight: 700 }}
          >
            {animatedScore}
          </text>
          <text
            x="100"
            y="108"
            textAnchor="middle"
            className="fill-earth-400"
            style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em' }}
          >
            CO₂ POINTS
          </text>
        </svg>
        {/* Glow effect */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-2xl transition-all duration-1000"
          style={{ background: bgGlow }}
        />
      </div>
      <div
        className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-500"
        style={{ color, backgroundColor: bgGlow }}
      >
        {label}
      </div>
    </div>
  )
}
