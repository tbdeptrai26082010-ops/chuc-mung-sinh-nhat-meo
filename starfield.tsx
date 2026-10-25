import { seededRandom } from '@/lib/seeded-random'

const random = seededRandom(26)
const STARS = Array.from({ length: 90 }, () => ({
  left: random() * 100,
  top: random() * 100,
  size: random() * 2.2 + 0.6,
  dur: random() * 3 + 2,
  delay: random() * 4,
  pink: random() > 0.75,
}))

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,#4b1f4f_0%,#24123a_38%,#140b22_70%)]" />
      <div className="absolute -left-24 top-1/4 size-72 rounded-full bg-[#ff7aa2]/10 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 size-80 rounded-full bg-[#9b7bff]/10 blur-3xl" />
      {STARS.map((star, i) => (
        <span
          key={i}
          className="star absolute rounded-full"
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              background: star.pink ? '#ffc2d4' : '#fff',
              boxShadow: `0 0 ${star.size * 3}px ${star.pink ? '#ff9ebb' : '#ffffff'}`,
              '--dur': `${star.dur}s`,
              '--delay': `${star.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
      {[
        { top: '8%', left: '90%', delay: '1s', dur: '9s' },
        { top: '22%', left: '70%', delay: '5.5s', dur: '11s' },
      ].map((s, i) => (
        <span
          key={i}
          className="shooting-star absolute h-px w-24 bg-gradient-to-r from-white to-transparent opacity-0"
          style={{ top: s.top, left: s.left, '--delay': s.delay, '--dur': s.dur } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
