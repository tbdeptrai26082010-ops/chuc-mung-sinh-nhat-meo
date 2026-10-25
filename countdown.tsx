'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useEffectEvent, useState } from 'react'

// 00:00:00 ngày 26/10/2026 theo giờ Việt Nam
export const BIRTHDAY_TARGET = new Date('2026-10-26T00:00:00+07:00').getTime()

function splitRemaining(now: number) {
  const total = Math.max(0, Math.ceil((BIRTHDAY_TARGET - now) / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

function FlipUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative flex size-15 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(255,143,177,0.18)] backdrop-blur-md"
        style={{ perspective: 300 }}
      >
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            className="countdown-digit text-2xl font-semibold tabular-nums"
            initial={{ y: '-70%', rotateX: -80, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            exit={{ y: '70%', rotateX: 80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-medium tracking-[0.2em] text-white/60 uppercase">{label}</span>
    </div>
  )
}

function Separator() {
  return (
    <span aria-hidden className="countdown-digit -mt-5 text-xl font-light opacity-60">
      :
    </span>
  )
}

export function Countdown({ ready, onReady }: { ready: boolean; onReady: (justReached: boolean) => void }) {
  const [now, setNow] = useState<number | null>(null)
  const reportReady = useEffectEvent(onReady)

  useEffect(() => {
    let pending = Date.now() < BIRTHDAY_TARGET
    if (!pending) reportReady(false)

    const tick = () => {
      const current = Date.now()
      setNow(current)
      if (pending && current >= BIRTHDAY_TARGET) {
        pending = false
        reportReady(true)
      }
    }

    tick()
    let interval: ReturnType<typeof setInterval> | undefined
    const align = setTimeout(() => {
      tick()
      interval = setInterval(tick, 1000)
    }, 1000 - (Date.now() % 1000))

    return () => {
      clearTimeout(align)
      clearInterval(interval)
    }
  }, [])

  const parts = now === null ? null : splitRemaining(now)
  const show = (n?: number) => (n === undefined ? '--' : pad(n))
  const label = parts
    ? `Còn ${parts.days} ngày ${parts.hours} giờ ${parts.minutes} phút ${parts.seconds} giây`
    : 'Đang tải bộ đếm ngược'

  return (
    <div className="relative z-10 flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={ready ? 'ready' : 'waiting'}
          className="mb-3 text-balance text-center font-script text-xl text-blush"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
        >
          {ready ? 'Đến giờ rồi! Mèo mở quà đi nào...' : 'Cùng Tít đếm ngược đến ngày đặc biệt của Mèo...'}
        </motion.p>
      </AnimatePresence>

      <div role="timer" aria-label={label} className="flex items-center gap-2">
        <FlipUnit value={show(parts?.days)} label="Ngày" />
        <Separator />
        <FlipUnit value={show(parts?.hours)} label="Giờ" />
        <Separator />
        <FlipUnit value={show(parts?.minutes)} label="Phút" />
        <Separator />
        <FlipUnit value={show(parts?.seconds)} label="Giây" />
      </div>
    </div>
  )
}
