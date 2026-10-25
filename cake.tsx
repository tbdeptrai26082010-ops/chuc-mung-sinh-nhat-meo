'use client'

import { AnimatePresence, motion } from 'motion/react'

function Drip({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        fill={color}
        d="M0 0 H200 V14 C196 14 194 30 188 30 C182 30 182 14 176 14 C170 14 168 22 162 22 C156 22 156 14 148 14 C142 14 140 36 132 36 C124 36 124 14 116 14 C110 14 108 24 100 24 C94 24 92 14 86 14 C80 14 78 32 70 32 C62 32 62 14 54 14 C48 14 46 22 40 22 C34 22 32 14 26 14 C20 14 18 34 10 34 C4 34 2 14 0 14 Z"
      />
    </svg>
  )
}

function Candle({ lit, delay }: { lit: boolean; delay: number }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-12 w-8">
        <AnimatePresence>
          {lit && (
            <motion.div key="flame" className="absolute inset-0" exit={{ opacity: 0, scale: 0.3, y: -6 }} transition={{ duration: 0.35 }}>
              <div className="flame-halo absolute bottom-0 left-1/2 size-20 translate-y-6 rounded-full bg-[radial-gradient(circle,rgba(255,214,140,0.65)_0%,rgba(255,170,120,0.2)_45%,transparent_70%)]" />
              <div
                className="flame absolute bottom-0 left-1/2 h-9 w-4"
                style={{ '--dur': `${0.8 + delay}s`, boxShadow: '0 0 18px 4px rgba(255,190,110,0.55)' } as React.CSSProperties}
              />
              <div className="absolute bottom-0.5 left-1/2 h-3 w-1.5 -translate-x-1/2 rounded-full bg-[#7fb2ff]/70 blur-[1px]" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!lit &&
            [0, 1, 2, 3].map((i) => (
              <motion.span
                key={`smoke-${i}`}
                className="absolute bottom-0 left-1/2 size-3 -translate-x-1/2 rounded-full bg-white/50 blur-[3px]"
                initial={{ opacity: 0.7, y: 0, x: 0, scale: 0.6 }}
                animate={{ opacity: 0, y: -90 - i * 15, x: (i % 2 ? 1 : -1) * (8 + i * 4), scale: 2.8 }}
                transition={{ duration: 2.2, delay: i * 0.18, ease: 'easeOut' }}
              />
            ))}
        </AnimatePresence>
      </div>
      <div className="h-1.5 w-0.5 bg-[#3a2a22]" />
      <div className="h-14 w-3 rounded-t-sm bg-[repeating-linear-gradient(135deg,#fff7f0_0_5px,#f4a9bb_5px_10px)] shadow-[inset_-2px_0_3px_rgba(0,0,0,0.12)]" />
    </div>
  )
}

export function Cake({ lit, onBlow }: { lit: boolean; onBlow: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onBlow}
      disabled={!lit}
      aria-label="Chạm vào ngọn nến để thổi nến"
      whileTap={lit ? { scale: 0.97 } : undefined}
      className="relative flex cursor-pointer flex-col items-center outline-none disabled:cursor-default focus-visible:ring-4 focus-visible:ring-gold/50 rounded-3xl"
    >
      <div className="relative z-10 -mb-3 flex items-end gap-5">
        <Candle lit={lit} delay={0.1} />
        <div className="-mb-1">
          <Candle lit={lit} delay={0} />
        </div>
        <Candle lit={lit} delay={0.25} />
      </div>

      <div className="relative w-44">
        <div className="absolute -top-4 left-0 z-[1] h-8 w-full rounded-[50%] bg-[#f4a9bb] shadow-[inset_0_-3px_6px_rgba(184,79,114,0.25)]" />
        <div className="relative h-20 overflow-hidden rounded-b-2xl bg-gradient-to-r from-[#f3dccd] via-[#fff3ea] to-[#ecd0bf]">
          <Drip color="#f4a9bb" className="absolute left-0 top-0 h-12 w-full" />
          <div className="absolute bottom-3 left-0 flex w-full justify-around px-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="size-2 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative -mt-1 w-64">
        <div className="absolute -top-5 left-0 z-[1] h-10 w-full rounded-[50%] bg-[#fff3ea] shadow-[inset_0_-3px_6px_rgba(184,79,114,0.18)]" />
        <div className="relative h-24 overflow-hidden rounded-b-3xl bg-gradient-to-r from-[#e88aa3] via-[#f7b6c6] to-[#df7f99]">
          <Drip color="#fff3ea" className="absolute left-0 top-0 h-14 w-full" />
          <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-3 font-script text-xl font-bold text-white/95">
            <span>Happy Birthday</span>
          </div>
        </div>
      </div>

      <div className="-mt-4 h-10 w-80 rounded-[50%] border border-white/30 bg-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md" />
    </motion.button>
  )
}
