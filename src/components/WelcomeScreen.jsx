import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { initAudio } from '../utils/sound.js'

export default function WelcomeScreen({ onEnter }) {
  const { t } = useTranslation()

  const handleEnter = () => {
    initAudio()
    sessionStorage.setItem('poke_entered', '1')
    onEnter()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 bg-cream px-8">
      <motion.img
        src="/poke-demo/assets/poke_happy.png"
        alt="poke"
        className="w-28 h-28 object-contain"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      />

      <motion.p
        className="text-xl font-semibold text-gray-700"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t('welcome.tagline')}
      </motion.p>

      <motion.button
        onClick={handleEnter}
        className="px-7 py-3 rounded-full bg-otter text-white font-medium text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {t('welcome.cta')}
      </motion.button>
    </div>
  )
}
