import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const CARD_BASES = [
  { bg: 'from-pink-400 to-rose-500', emoji: '🍔' },
  { bg: 'from-blue-400 to-cyan-500', emoji: '🌊' },
  { bg: 'from-purple-400 to-violet-500', emoji: '🎵' },
  { bg: 'from-green-400 to-emerald-500', emoji: '🐱' },
  { bg: 'from-yellow-400 to-orange-500', emoji: '✨' },
  { bg: 'from-red-400 to-pink-500', emoji: '🏀' },
  { bg: 'from-teal-400 to-cyan-400', emoji: '🌿' },
  { bg: 'from-indigo-400 to-blue-500', emoji: '🌙' },
]

export default function FakeFeed({ onScroll }) {
  const { t } = useTranslation()
  const lastIndexRef = useRef(0)

  const handleScroll = (e) => {
    const el = e.currentTarget
    const index = Math.round(el.scrollTop / el.clientHeight)
    if (index !== lastIndexRef.current) {
      lastIndexRef.current = index
      onScroll?.()
    }
  }

  return (
    <div
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollbarWidth: 'none' }}
      onScroll={handleScroll}
    >
      {CARD_BASES.map((card, i) => (
        <div key={i} className={`relative w-full h-full snap-start shrink-0 bg-gradient-to-b ${card.bg} flex flex-col items-center justify-center`}>
          <span className="text-7xl mb-4 select-none">{card.emoji}</span>

          {/* right action bar */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
            {['❤️', '💬', '↗️'].map((icon, j) => (
              <div key={j} className="flex flex-col items-center">
                <span className="text-2xl drop-shadow-sm">{icon}</span>
                <span className="text-white text-xs mt-1 drop-shadow-sm">
                  {[Math.floor(Math.random() * 9 + 1) * 1000, Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)][j]}
                </span>
              </div>
            ))}
          </div>

          {/* bottom info */}
          <div className="absolute bottom-6 left-3 right-16">
            <p className="text-white font-semibold text-sm drop-shadow-sm">{t(`feed.cards.${i}.user`)}</p>
            <p className="text-white/80 text-xs mt-0.5 drop-shadow-sm">{t(`feed.cards.${i}.tag`)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
