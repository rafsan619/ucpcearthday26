import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() {
        this.reset()
      }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedY = -(Math.random() * 0.3 + 0.1)
        this.speedX = (Math.random() - 0.5) * 0.2
        this.opacity = Math.random() * 0.3 + 0.05
        this.life = Math.random() * 200 + 100
        this.maxLife = this.life
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life--
        if (this.life <= 0 || this.y < -10) this.reset()
        this.opacity = (this.life / this.maxLife) * 0.25
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(52, 211, 153, ${this.opacity})`
        ctx.fill()
      }
    }

    const count = Math.min(60, Math.floor(window.innerWidth / 20))
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particle-bg"
      aria-hidden="true"
    />
  )
}
