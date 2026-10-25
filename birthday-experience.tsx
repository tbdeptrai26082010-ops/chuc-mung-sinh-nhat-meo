'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MusicBox } from '@/lib/music-box'
import { IntroScene } from './intro-scene'
import { MemoriesScene } from './memories-scene'
import { WishScene } from './wish-scene'

type Scene = 'intro' | 'memories' | 'wish'

export function BirthdayExperience() {
  const [scene, setScene] = useState<Scene>('intro')
  const [playing, setPlaying] = useState(false)
  const musicRef = useRef<MusicBox | null>(null)

  useEffect(() => () => musicRef.current?.dispose(), [])

  function startMusic() {
    musicRef.current ??= new MusicBox()
    musicRef.current.start()
    setPlaying(true)
  }

  function toggleMusic() {
    if (!musicRef.current) return startMusic()
    if (playing) musicRef.current.pause()
    else musicRef.current.resume()
    setPlaying(!playing)
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-night">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {scene === 'intro' && <IntroScene onOpen={startMusic} onComplete={() => setScene('memories')} />}
          {scene === 'memories' && (
            <MemoriesScene playing={playing} onToggleMusic={toggleMusic} onNext={() => setScene('wish')} />
          )}
          {scene === 'wish' && (
            <WishScene playing={playing} onToggleMusic={toggleMusic} onReplay={() => setScene('intro')} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
