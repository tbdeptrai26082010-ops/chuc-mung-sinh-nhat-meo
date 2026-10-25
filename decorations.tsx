import { Heart } from 'lucide-react'
import { seededRandom } from '@/lib/seeded-random'

const random = seededRandom(1402)
const HEARTS = Array.from({ length: 16 }, () => ({
  left: random() * 100,
  size: random() * 18 + 12,
  dur: random() * 8 + 10,
  delay: -random() * 18,
  drift: (random() - 0.5) * 80,
  alpha: random() * 0.35 + 0.35,
  tone: random() > 0.5 ? '#e8899e' : '#f4a9bb',
}))

export function FloatingHearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="heart-rise absolute -bottom-10"
          style={
            {
              left: `${h.left}%`,
              '--dur': `${h.dur}s`,
              '--delay': `${h.delay}s`,
              '--drift': `${h.drift}px`,
              '--alpha': h.alpha,
            } as React.CSSProperties
          }
        >
          <span className="block rounded-full bg-white/30 p-1.5 shadow-[inset_0_0_8px_rgba(255,255,255,0.8)] backdrop-blur-[2px]">
            <Heart style={{ width: h.size, height: h.size, color: h.tone }} fill="currentColor" strokeWidth={0} />
          </span>
        </span>
      ))}
    </div>
  )
}

function RoseBranch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className={className}>
      <path d="M8 132 C 40 110, 62 86, 78 52" />
      <path d="M38 112 C 30 100, 34 90, 46 88 C 48 100, 44 108, 38 112 Z" />
      <path d="M56 92 C 66 86, 76 90, 78 100 C 68 102, 60 100, 56 92 Z" />
      <path d="M66 72 C 58 64, 60 54, 70 50" />
      <circle cx="86" cy="38" r="17" />
      <path d="M86 30 C 92 30, 95 36, 91 41 C 87 45, 80 42, 80 37 C 80 31, 86 26, 93 28 C 100 31, 101 40, 96 46" />
      <path d="M76 26 C 70 34, 72 46, 80 52" />
      <circle cx="116" cy="70" r="7" />
      <path d="M116 66 C 119 68, 118 72, 115 72" />
      <path d="M100 52 C 106 58, 110 62, 112 64" />
    </svg>
  )
}

function Cross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className={className}>
      <path d="M16 2 H24 V16 H38 V24 H24 V58 H16 V24 H2 V16 H16 Z" />
      <circle cx="20" cy="20" r="2.2" />
    </svg>
  )
}

export function CornerOrnaments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 text-rose-deep/30">
      <RoseBranch className="absolute -left-2 bottom-0 size-36" />
      <RoseBranch className="absolute -right-2 top-24 size-32 -scale-100" />
      <Cross className="absolute left-5 top-28 h-10 w-7 text-rose-deep/25" />
      <Cross className="absolute bottom-10 right-6 h-12 w-8 text-rose-deep/25" />
      <svg viewBox="0 0 10 10" className="absolute left-16 top-[40%] size-2 fill-current">
        <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" />
      </svg>
      <svg viewBox="0 0 10 10" className="absolute right-12 bottom-[30%] size-3 fill-current">
        <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" />
      </svg>
    </div>
  )
}
