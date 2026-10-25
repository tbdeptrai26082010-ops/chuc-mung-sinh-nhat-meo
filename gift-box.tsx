type CuboidProps = {
  width: number
  height: number
  depth: number
  offsetY?: number
  side: string
  top: string
}

const RIBBON = 'linear-gradient(90deg, transparent 42%, #fff1c9 42%, #f3c98b 50%, #fff1c9 58%, transparent 58%)'
const RIBBON_CROSS = `${RIBBON}, linear-gradient(0deg, transparent 42%, #fff1c9 42%, #f3c98b 50%, #fff1c9 58%, transparent 58%)`

function Cuboid({ width, height, depth, offsetY = 0, side, top }: CuboidProps) {
  const face = 'absolute left-1/2 top-1/2'
  const sideStyle = (w: number, h: number, transform: string, shade: number): React.CSSProperties => ({
    width: w,
    height: h,
    marginLeft: -w / 2,
    marginTop: -h / 2,
    transform: `translateY(${offsetY}px) ${transform}`,
    background: `${RIBBON}, linear-gradient(rgba(60,10,40,${shade}), rgba(60,10,40,${shade})), ${side}`,
  })

  return (
    <>
      <div className={face} style={sideStyle(width, height, `translateZ(${depth / 2}px)`, 0)} />
      <div className={face} style={sideStyle(width, height, `rotateY(180deg) translateZ(${depth / 2}px)`, 0.25)} />
      <div className={face} style={sideStyle(depth, height, `rotateY(90deg) translateZ(${width / 2}px)`, 0.18)} />
      <div className={face} style={sideStyle(depth, height, `rotateY(-90deg) translateZ(${width / 2}px)`, 0.1)} />
      <div
        className={face}
        style={{
          width,
          height: depth,
          marginLeft: -width / 2,
          marginTop: -depth / 2,
          transform: `translateY(${offsetY}px) rotateX(90deg) translateZ(${height / 2}px)`,
          background: `${RIBBON_CROSS}, ${top}`,
        }}
      />
      <div
        className={face}
        style={{
          width,
          height: depth,
          marginLeft: -width / 2,
          marginTop: -depth / 2,
          transform: `translateY(${offsetY}px) rotateX(-90deg) translateZ(${height / 2}px)`,
          background: '#7a2d4f',
        }}
      />
    </>
  )
}

function BowPlane({ rotate }: { rotate: number }) {
  return (
    <svg
      viewBox="0 0 120 64"
      className="absolute left-1/2 top-1/2"
      style={{ width: 120, height: 64, marginLeft: -60, marginTop: -32, transform: `translateY(-82px) rotateY(${rotate}deg)` }}
    >
      <defs>
        <linearGradient id={`bow-${rotate}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="1" stopColor="#e7b46a" />
        </linearGradient>
      </defs>
      <path d="M60 52 C 40 18, 6 10, 10 34 C 13 52, 40 54, 60 52 Z" fill={`url(#bow-${rotate})`} />
      <path d="M60 52 C 80 18, 114 10, 110 34 C 107 52, 80 54, 60 52 Z" fill={`url(#bow-${rotate})`} />
      <path d="M60 52 C 46 36, 24 28, 22 36" stroke="#c98d43" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M60 52 C 74 36, 96 28, 98 36" stroke="#c98d43" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="60" cy="52" rx="9" ry="8" fill="#f3c98b" />
    </svg>
  )
}

export function GiftBox() {
  return (
    <div className="relative size-64" style={{ perspective: 900 }}>
      <div className="gift-sway absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        <Cuboid
          width={140}
          height={116}
          depth={140}
          offsetY={24}
          side="linear-gradient(160deg, #ffb3c7 0%, #f07f9f 55%, #d45a82 100%)"
          top="#f7a3bb"
        />
        <Cuboid
          width={156}
          height={30}
          depth={156}
          offsetY={-49}
          side="linear-gradient(160deg, #ffc9d7 0%, #f58fac 100%)"
          top="linear-gradient(135deg, #ffd9e3, #f7a3bb)"
        />
        <BowPlane rotate={0} />
        <BowPlane rotate={90} />
      </div>
    </div>
  )
}
