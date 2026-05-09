const STORAGE_KEY = 'poke_used_dialogues'
const COOLDOWN_MS = 30 * 60 * 1000

function getUsedMap() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveUsedMap(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function pickDialogue(lines) {
  if (!lines || lines.length === 0) return ''
  const now = Date.now()
  const used = getUsedMap()

  const available = lines.filter((line) => {
    const lastUsed = used[line]
    return !lastUsed || now - lastUsed > COOLDOWN_MS
  })

  const pool = available.length > 0 ? available : lines
  const picked = pool[Math.floor(Math.random() * pool.length)]

  used[picked] = now
  saveUsedMap(used)
  return picked
}
