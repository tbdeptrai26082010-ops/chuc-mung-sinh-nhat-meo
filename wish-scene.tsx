'use client'

import confetti from 'canvas-confetti'
import { Music, RotateCcw, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Cake } from './cake'
import { Fireworks } from './fireworks'
import { Starfield } from './starfield'

type Props = { playing: boolean; onToggleMusic: () => void; onReplay: () => void }

export function WishScene({ playing, onToggleMusic, onReplay }: Props) {
  const [lit, setLit] = useState(true)
  const [celebrating, setCelebrating] = useState(false)

  function handleBlow() {
    if (!lit) return
    setLit(false)
    setTimeout(() => {
      setCelebrating(true)
      confetti({
        particleCount: 160,
        spread: 120,
        startVelocity: 50,
        origin: { x: 0.5, y: 0.7 },
        colors: ['#ffb3c7', '#fff7f0', '#f3c98b', '#e8899e'],
        zIndex: 40,
        disableForReducedMotion: true,
      })
    }, 900)
  }

  return (
    <section className="relative flex min-h-dvh flex-col items-center overflow-hidden">
      <Starfield />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[48%] size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,140,0.35)_0%,rgba(255,150,170,0.12)_40%,transparent_70%)]"
        animate={{ opacity: lit ? 1 : 0.15 }}
        transition={{ duration: 1.2 }}
      />

      {celebrating && <Fireworks />}

      <motion.button
        type="button"
        onClick={onToggleMusic}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        aria-pressed={playing}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md outline-none focus-visible:ring-4 focus-visible:ring-rose/50"
      >
        {playing ? <Music className="size-5" /> : <VolumeX className="size-5" />}
      </motion.button>

      <div className="relative z-30 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="flex min-h-36 flex-col items-center justify-end text-center">
          <AnimatePresence mode="wait">
            {celebrating ? (
              <motion.div
                key="celebrate"
                initial={{ opacity: 0, scale: 0.4, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              >
                <h2 className="shimmer-text text-5xl font-extrabold leading-[1.05] tracking-tight text-balance drop-shadow-[0_0_25px_rgba(255,143,177,0.6)]">
                  HAPPY BIRTHDAY, MÈO YÊU!
                </h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 font-script text-2xl text-[#ffd6e2]"
                >
                  Tuổi mới tràn đầy hồng ân Chúa
                </motion.p>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="text-[11px] font-medium tracking-[0.35em] text-[#ffd6e2]/70 uppercase">Điều ước tuổi mới</p>
                <p className="mt-2 font-script text-3xl font-bold leading-snug text-cream text-balance">
                  Mèo hãy nhắm mắt lại, cầu nguyện một điều ước và thổi nến nhé!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15, delay: 0.3 }}
        >
          <Cake lit={lit} onBlow={handleBlow} />
        </motion.div>

        <div className="flex h-14 items-center">
          <AnimatePresence mode="wait">
            {lit ? (
              <motion.p
                key="tap"
                className="soft-bounce rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white/80 backdrop-blur-md"
                exit={{ opacity: 0, scale: 0.9 }}
              >
                Chạm vào ngọn nến để thổi
              </motion.p>
            ) : celebrating ? (
              <motion.button
                key="replay"
                type="button"
                onClick={onReplay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-md outline-none focus-visible:ring-4 focus-visible:ring-rose/50"
              >
                <RotateCcw className="size-4" />
                Xem lại từ đầu
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
