const NOTE_OFFSETS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function toFrequency(note: string) {
  const name = note[0]
  const octave = Number(note.slice(1))
  const midi = 12 * (octave + 1) + NOTE_OFFSETS[name]
  return 440 * Math.pow(2, (midi - 69) / 12)
}

type MelodyNote = [note: string, beat: number]

// "Happy Birthday" arranged slowly as a lullaby music box
const MELODY: MelodyNote[] = [
  ['G4', 0], ['G4', 0.75], ['A4', 1], ['G4', 2], ['C5', 3], ['B4', 4],
  ['G4', 6], ['G4', 6.75], ['A4', 7], ['G4', 8], ['D5', 9], ['C5', 10],
  ['G4', 12], ['G4', 12.75], ['G5', 13], ['E5', 14], ['C5', 15], ['B4', 16], ['A4', 17],
  ['F5', 19], ['F5', 19.75], ['E5', 20], ['C5', 21], ['D5', 22], ['C5', 23],
]

const CHORDS: [beat: number, notes: string[]][] = [
  [0, ['C3', 'G3', 'E4']],
  [4, ['G2', 'D3', 'B3']],
  [7, ['G2', 'F3', 'B3']],
  [10, ['C3', 'G3', 'E4']],
  [13, ['C3', 'E3', 'B3']],
  [16, ['F2', 'C3', 'A3']],
  [19, ['F2', 'A3', 'C4']],
  [21, ['C3', 'G3', 'E4']],
  [22, ['G2', 'D3', 'B3']],
  [23, ['C3', 'G3', 'E4']],
]

const LOOP_BEATS = 28
const SECONDS_PER_BEAT = 60 / 68
const LOOKAHEAD = 0.5

export class MusicBox {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private bus: GainNode | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private loopStart = 0
  private melodyIndex = 0
  private chordIndex = 0

  private init() {
    const AudioCtx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 3200
    lowpass.connect(master)

    const bus = ctx.createGain()
    bus.gain.value = 1
    bus.connect(lowpass)

    const reverb = ctx.createConvolver()
    const length = ctx.sampleRate * 2.8
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6)
      }
    }
    reverb.buffer = impulse
    const wet = ctx.createGain()
    wet.gain.value = 0.45
    bus.connect(reverb)
    reverb.connect(wet)
    wet.connect(lowpass)

    this.ctx = ctx
    this.master = master
    this.bus = bus
  }

  private bell(frequency: number, time: number) {
    if (!this.ctx || !this.bus) return
    const partials: [ratio: number, gain: number, type: OscillatorType][] = [
      [1, 0.22, 'sine'],
      [2, 0.06, 'triangle'],
      [3.01, 0.025, 'sine'],
    ]
    for (const [ratio, peak, type] of partials) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.value = frequency * ratio
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(peak, time + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.4 / ratio)
      osc.connect(gain)
      gain.connect(this.bus)
      osc.start(time)
      osc.stop(time + 2.5)
    }
  }

  private pad(notes: string[], time: number, duration: number) {
    if (!this.ctx || !this.bus) return
    for (const note of notes) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = toFrequency(note)
      osc.detune.value = (Math.random() - 0.5) * 8
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.045, time + 0.7)
      gain.gain.setValueAtTime(0.045, time + Math.max(0.8, duration - 0.4))
      gain.gain.linearRampToValueAtTime(0, time + duration + 0.6)
      osc.connect(gain)
      gain.connect(this.bus)
      osc.start(time)
      osc.stop(time + duration + 0.7)
    }
  }

  private tick = () => {
    if (!this.ctx) return
    const horizon = this.ctx.currentTime + LOOKAHEAD

    while (this.melodyIndex < MELODY.length) {
      const [note, beat] = MELODY[this.melodyIndex]
      const time = this.loopStart + beat * SECONDS_PER_BEAT
      if (time > horizon) break
      this.bell(toFrequency(note), time)
      this.melodyIndex++
    }

    while (this.chordIndex < CHORDS.length) {
      const [beat, notes] = CHORDS[this.chordIndex]
      const time = this.loopStart + beat * SECONDS_PER_BEAT
      if (time > horizon) break
      const nextBeat = CHORDS[this.chordIndex + 1]?.[0] ?? LOOP_BEATS
      this.pad(notes, time, (nextBeat - beat) * SECONDS_PER_BEAT)
      this.chordIndex++
    }

    const loopEnd = this.loopStart + LOOP_BEATS * SECONDS_PER_BEAT
    if (this.melodyIndex >= MELODY.length && this.chordIndex >= CHORDS.length && loopEnd <= horizon) {
      this.loopStart = loopEnd
      this.melodyIndex = 0
      this.chordIndex = 0
    }
  }

  start() {
    if (!this.ctx) this.init()
    const ctx = this.ctx!
    void ctx.resume()
    if (!this.timer) {
      this.loopStart = ctx.currentTime + 0.3
      this.timer = setInterval(this.tick, 60)
    }
    this.master!.gain.cancelScheduledValues(ctx.currentTime)
    this.master!.gain.setTargetAtTime(0.7, ctx.currentTime, 0.6)
  }

  pause() {
    void this.ctx?.suspend()
  }

  resume() {
    void this.ctx?.resume()
  }

  dispose() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    void this.ctx?.close()
    this.ctx = null
  }
}
