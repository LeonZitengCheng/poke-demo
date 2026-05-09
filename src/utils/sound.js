// Volume levels — easy to tune per sound
const VOLUMES = {
  pop: 0.5,
  whoosh: 0.3,
  chime: 0.6,
  sigh: 0.4,
}

// Resolved file paths after probing (populated by preload)
const audioCache = {}

// Currently playing HTMLAudioElement per slot so we can interrupt
const playing = {}

const BASE = '/poke-demo/sounds/'
const EXTS = ['.wav', '.mp3']

function probe(name) {
  return new Promise((resolve) => {
    let idx = 0
    const tryNext = () => {
      if (idx >= EXTS.length) { resolve(null); return }
      const path = BASE + name + EXTS[idx++]
      const a = new Audio()
      a.addEventListener('canplaythrough', () => resolve({ path, el: a }), { once: true })
      a.addEventListener('error', tryNext, { once: true })
      a.preload = 'auto'
      a.volume = VOLUMES[name] ?? 1
      a.src = path
    }
    tryNext()
  })
}

export async function preloadSounds() {
  await Promise.all(
    Object.keys(VOLUMES).map(async (name) => {
      const result = await probe(name)
      if (result) audioCache[name] = result
    })
  )
}

export function initAudio() {
  // No-op: HTMLAudioElement doesn't need an AudioContext unlock gesture.
  // Kept so WelcomeScreen can still call it without errors.
}

export function getSoundEnabled() {
  return localStorage.getItem('poke_sound_muted') !== 'true'
}

export function setSoundEnabled(enabled) {
  localStorage.setItem('poke_sound_muted', enabled ? 'false' : 'true')
}

export function playSound(name) {
  if (!getSoundEnabled()) return
  const cached = audioCache[name]
  if (!cached) return // file not found — silent

  // Interrupt any currently playing instance of this sound
  try {
    if (playing[name]) {
      playing[name].pause()
      playing[name].currentTime = 0
    }
  } catch {}

  // Clone so rapid re-triggers don't fight over the same element
  const el = cached.el.cloneNode()
  el.volume = VOLUMES[name] ?? 1
  playing[name] = el
  el.play().catch(() => {}) // swallow autoplay policy errors
}
