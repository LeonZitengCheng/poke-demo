import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { playSound } from '../utils/sound.js'

function vibrate(pattern) {
  try { navigator.vibrate?.(pattern) } catch {}
}

const QUICK_OPTIONS = [
  { labelKey: 'dialog.options.look_up', type: 'acknowledged' },
  { labelKey: 'dialog.options.reply', type: 'acknowledged' },
  { labelKey: 'dialog.options.browsing', type: 'couldnt_answer' },
  { labelKey: 'dialog.options.dont_know', type: 'couldnt_answer' },
]

export default function InterruptDialog({ open, mood, onAcknowledged, onCouldntAnswer, onDismissed }) {
  const { t } = useTranslation()
  const [text, setText] = useState('')

  const handleOption = (type) => {
    playSound('chime')
    vibrate([30, 50, 30])
    setText('')
    if (type === 'acknowledged') onAcknowledged()
    else onCouldntAnswer()
  }

  const handleTell = () => {
    playSound('chime')
    vibrate([30, 50, 30])
    setText('')
    if (text.trim()) onAcknowledged()
    else onCouldntAnswer()
  }

  const handleDismiss = () => {
    setText('')
    onDismissed()
  }

  const moodSrc = `/poke-demo/assets/poke_${mood}.png`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={handleDismiss} />
          <motion.div
            className="relative bg-white rounded-2xl mx-4 p-5 w-full max-w-sm shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={moodSrc} alt="poke" className="w-12 h-12 object-contain" />
              <p className="text-lg font-semibold text-gray-800">{t('dialog.title')}</p>
            </div>

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTell()}
              placeholder={t('dialog.placeholder')}
              maxLength={50}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-otter"
            />

            <p className="text-xs text-gray-400 mb-2">{t('dialog.or_pick')}</p>
            <div className="flex flex-col gap-2 mb-4">
              {QUICK_OPTIONS.map((opt) => (
                <button
                  key={opt.labelKey}
                  onClick={() => handleOption(opt.type)}
                  className="text-left text-sm px-3 py-2 rounded-lg bg-gray-50 hover:bg-amber-50 text-gray-700 transition-colors"
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {t('dialog.keep_scrolling')}
              </button>
              <button
                onClick={handleTell}
                className="flex-1 py-2 rounded-lg bg-otter text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t('dialog.tell_poke')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
