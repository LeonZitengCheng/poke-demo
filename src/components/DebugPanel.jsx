import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getSoundEnabled, setSoundEnabled } from '../utils/sound.js'

const MOOD_BUTTONS = ['happy', 'calm', 'withered', 'playful']

export default function DebugPanel({
  onForceMood, onTrigger, onOpenDialog, onReset, elapsed, cardCount,
  interruptionCount, onForceStage2, onForceStage3, onForceSilent, onResetSession,
}) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled())

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
  }

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}m ${s % 60}s`
  }

  return (
    <div className="absolute top-3 right-3 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow text-base flex items-center justify-center hover:bg-white transition-colors"
        title={t('debug.tooltip')}
      >
        ⚙️
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-10 right-0 bg-white rounded-2xl shadow-xl p-3 w-56 text-xs"
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-600">{t('debug.panel_title')}</p>
              <div className="flex gap-1 items-center">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-otter text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage('zh')}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                    i18n.language === 'zh'
                      ? 'bg-otter text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  中
                </button>
                <button
                  onClick={toggleSound}
                  className="px-1.5 py-0.5 rounded text-xs transition-colors bg-gray-100 hover:bg-gray-200 text-gray-500"
                  title={soundOn ? 'Mute' : 'Unmute'}
                >
                  {soundOn ? '🔊' : '🔇'}
                </button>
              </div>
            </div>

            <p className="text-gray-400 mb-1">{t('debug.mood_label')}</p>
            <div className="grid grid-cols-2 gap-1 mb-3">
              {MOOD_BUTTONS.map((m) => (
                <button
                  key={m}
                  onClick={() => onForceMood(m)}
                  className="py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-gray-700 capitalize transition-colors"
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1 mb-3">
              <button onClick={onTrigger} className="py-1.5 px-2 rounded-lg bg-otter text-white hover:opacity-90 transition-opacity">
                {t('debug.trigger')}
              </button>
              <button onClick={onOpenDialog} className="py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                {t('debug.open_dialog')}
              </button>
              <button onClick={onReset} className="py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                {t('debug.reset_timer')}
              </button>
            </div>

            <div className="border-t pt-2 mb-2 text-gray-400 space-y-0.5">
              <p>{t('debug.scroll_duration', { time: fmt(elapsed) })}</p>
              <p>{t('debug.cards_swiped', { count: cardCount })}</p>
              <p className="font-medium text-gray-500">{t('debug.interruption_count', { count: interruptionCount ?? 0 })}</p>
            </div>

            <div className="border-t pt-2 flex flex-col gap-1">
              <button
                onClick={onForceStage2}
                className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
              >
                {t('debug.force_stage2')}
              </button>
              <button
                onClick={onForceStage3}
                className="py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
              >
                {t('debug.force_stage3')}
              </button>
              <button
                onClick={onForceSilent}
                className="py-1.5 px-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
              >
                {t('debug.force_silent')}
              </button>
              <button
                onClick={onResetSession}
                className="py-1.5 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              >
                {t('debug.reset_session')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
