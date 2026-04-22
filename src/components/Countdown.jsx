import { useState, useEffect } from 'react'

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const target = new Date(targetDate)
    const diff = Math.max(0, target - now)
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (timeLeft.total <= 0) {
    return (
      <div className="flex items-center gap-2 text-eco-glow font-semibold">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-glow opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-eco-glow"></span>
        </span>
        Event is LIVE!
      </div>
    )
  }

  const units = [
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center gap-3">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="countdown-digit text-2xl sm:text-3xl font-display font-bold text-white">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-earth-500 font-medium tracking-widest mt-0.5">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-eco-glow text-xl font-bold opacity-50 -mt-4 animate-pulse">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
