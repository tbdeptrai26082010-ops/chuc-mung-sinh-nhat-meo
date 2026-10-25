'use client'

import { Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { CornerOrnaments, FloatingHearts } from './decorations'
import { VinylPlayer } from './vinyl-player'

const MESSAGE =
  'Chúc mừng sinh nhật Mèo - món quà tuyệt vời nhất mà Thiên Chúa đã ban tặng. Trong ngày đặc biệt này, Tít luôn thầm tạ ơn Ngài vì đã mang Mèo đến bên đời và cho chúng mình cơ hội được gặp gỡ, gắn kết cùng nhau. Nguyện xin Thiên Chúa, Đức Mẹ và Thánh Thiên Thần Bản Mệnh luôn gìn giữ, chở che và ban tràn đầy hồng ân, bình an xuống trên Mèo trong tuổi mới. Tít sẽ luôn ở đây, đồng hành và sẻ chia cùng Mèo dưới sự dắt dìu của Ngài. Sinh nhật thật hạnh phúc nhé Mèo yêu thương!'

const CHARS = Array.from(MESSAGE)

function useTypewriter(start: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start || count >= CHARS.length) return
    const prev = CHARS[count - 1]
    const delay = prev === '.' || prev === '!' ? 420 : prev === ',' ? 200 : 42
    const id = setTimeout(() => setCount((c) => c + 1), delay)
    return () => clearTimeout(id)
  }, [start, count])

  return { count, done: count >= CHARS.length, skip: () => setCount(CHARS.length) }
}

type Props = { playing: boolean; onToggleMusic: () => void; onNext: () => void }

export function MemoriesScene({ playing, onToggleMusic, onNext }: Props) {
  const [ready, setReady] = useState(false)
  const { count, done, skip } = useTypewriter(ready)

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1100)
    return () => clearTimeout(id)
  }, [])

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_top,#fde4ea_0%,#fff2ec_45%,#fff7f0_100%)]">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-blush/70 blur-3xl" />
      <FloatingHearts />
      <CornerOrnaments />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <VinylPlayer playing={playing} onToggle={onToggleMusic} />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="my-auto"
        >
          <div className="mb-4 text-center">
            <p className="text-[11px] font-medium tracking-[0.35em] text-rose-deep/70 uppercase">Tạ ơn &amp; Hồng ân</p>
            <h1 className="mt-1 font-script text-5xl font-bold text-rose-deep text-balance">Gửi Mèo yêu</h1>
          </div>

          <div
            onClick={done ? undefined : skip}
            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/45 p-6 shadow-[0_20px_60px_-15px_rgba(184,79,114,0.35)] backdrop-blur-2xl"
          >
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.7)_0%,transparent_40%,transparent_70%,rgba(249,213,220,0.5)_100%)]" />
            <p className="sr-only">{MESSAGE}</p>
            <p aria-hidden className="relative min-h-[20rem] text-[15.5px] leading-[1.85] text-[#5a3446] text-pretty">
              {CHARS.slice(0, count).join('')}
              {!done && <span className="caret ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-rose-deep" />}
            </p>
            <AnimatePresence>
              {done && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative mt-4 text-right font-script text-2xl font-bold text-rose-deep"
                >
                  — Tít của Mèo
                </motion.p>
              )}
            </AnimatePresence>
            {!done && ready && (
              <p className="relative mt-3 text-center text-[11px] text-muted-foreground">Chạm để đọc nhanh</p>
            )}
          </div>
        </motion.div>

        <div className="flex h-20 items-center justify-center">
          <AnimatePresence>
            {done && (
              <motion.button
                type="button"
                onClick={onNext}
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.4 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose via-[#f07f9f] to-rose-deep px-8 py-4 text-base font-semibold text-white shadow-[0_12px_30px_-6px_rgba(184,79,114,0.6)] outline-none focus-visible:ring-4 focus-visible:ring-rose/40"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/40 blur-sm"
                  animate={{ left: ['-50%', '150%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                />
                <span aria-hidden className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-rose/40 blur-lg" />
                <Sparkles className="size-5" />
                <span className="relative">Nguyện cầu &amp; Ước</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
