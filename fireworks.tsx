'use client'

import { useEffect, useRef } from 'react'

const PALETTE = ['#ffb3c7', '#ff8fb1', '#fff7f0', '#f3c98b', '#ffd6e2', '#c9a7ff', '#ffe08a']

type Rocket = { x: number; y: number; vx: number; vy: number; targetY: number; color: string }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; decay: number; color: string; size: number }

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rockets: Rocket[] = []
    const particles: Particle[] = []
    const pick = () => PALETTE[Math.floor(Math.random() * PALETTE.length)]

    const launch = (x = width * (0.15 + Math.random() * 0.7)) => {
      rockets.push({
        x,
        y: height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(height / 75 + Math.random() * 3),
        targetY: height * (0.15 + Math.random() * 0.3),
        color: pick(),
      })
    }

    const explode = (r: Rocket) => {
      const heart = Math.random() < 0.35
      const count = heart ? 60 : 80
      const power = Math.min(width, 500) / 110
      const second = pick()
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2
        let vx: number
        let vy: number
        if (heart) {
          vx = (16 * Math.sin(t) ** 3) / 16
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16
          vx *= power
          vy *= power
        } else {
          const speed = power * (0.5 + Math.random() * 0.6)
          vx = Math.cos(t) * speed
          vy = Math.sin(t) * speed
        }
        particles.push({
          x: r.x,
          y: r.y,
          vx,
          vy,
          life: 1,
          decay: 0.008 + Math.random() * 0.008,
          color: i % 3 === 0 ? second : r.color,
          size: 1.4 + Math.random() * 1.6,
        })
      }
    }

    let frame = 0
    let last = performance.now()
    let nextLaunch = 0
    ;[0.25, 0.5, 0.75].forEach((p, i) => setTimeout(() => launch(width * p), i * 180))

    const loop = (now: number) => {
      const step = Math.min((now - last) / 16.67, 3)
      last = now

      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      if (now > nextLaunch) {
        launch()
        if (Math.random() < 0.4) launch()
        nextLaunch = now + 550 + Math.random() * 650
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.x += r.vx * step
        r.y += r.vy * step
        r.vy += 0.06 * step
        ctx.fillStyle = r.color
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2)
        ctx.fill()
        if (r.y <= r.targetY || r.vy >= -1) {
          explode(r)
          rockets.splice(i, 1)
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= 0.975
        p.vy = p.vy * 0.975 + 0.035 * step
        p.x += p.vx * step
        p.y += p.vy * step
        p.life -= p.decay * step
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-20 size-full" />
}
