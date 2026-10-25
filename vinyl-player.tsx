'use client'

import { Heart, Pause, Play } from 'lucide-react'
import { motion } from 'motion/react'

export function VinylPlayer({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.3 }}
      className="flex w-full items-center gap-3 rounded-3xl border border-white/60 bg-white/40 p-2.5 pr-3 shadow-[0_8px_32px_rgba(184,79,114,0.15)] backdrop-blur-xl"
    >
      <div className="relative size-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#f6e1d3] to-[#e9c6b4] p-1.5 shadow-inner">
        <div className={`vinyl-spin vinyl-grooves relative size-full rounded-full shadow-md ${playing ? '' : 'vinyl-paused'}`}>
          <div className="absolute inset-[32%] flex items-center justify-center rounded-full bg-gradient-to-br from-blush to-rose">
            <Heart className="size-2.5 text-white" fill="currentColor" strokeWidth={0} />
          </div>
          <div className="absolute inset-[48%] rounded-full bg-[#2a1d25]" />
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%)]" />
        </div>
        <motion.div
          aria-hidden
          className="absolute right-0.5 top-0.5 h-9 w-1 origin-top rounded-full bg-gradient-to-b from-[#c9a27a] to-[#8f6a4a]"
          animate={{ rotate: playing ? 28 : 6 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        >
          <span className="absolute -left-0.5 -top-1 size-2 rounded-full bg-[#8f6a4a]" />
          <span className="absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-sm bg-[#5e4331]" />
        </motion.div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-script text-xl font-bold leading-tight text-rose-deep">Khúc ca hồng ân</p>
        <p className="truncate text-xs text-muted-foreground">
          {playing ? 'Đang phát cho Mèo nghe...' : 'Nhạc đang tạm dừng'}
        </p>
        <div aria-hidden className="mt-1.5 flex h-3 items-end gap-0.5">
          {[0.6, 1, 0.45, 0.8, 0.55, 0.9, 0.4].map((h, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-rose/70"
              animate={playing ? { height: ['30%', `${h * 100}%`, '30%'] } : { height: '20%' }}
              transition={playing ? { duration: 0.8 + i * 0.12, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onToggle}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        aria-pressed={playing}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-deep text-white shadow-[0_6px_18px_rgba(184,79,114,0.4)] outline-none focus-visible:ring-4 focus-visible:ring-rose/40"
      >
        {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="ml-0.5 size-4" fill="currentColor" />}
      </motion.button>
    </motion.div>
  )
}
