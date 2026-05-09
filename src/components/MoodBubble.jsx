import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function MoodBubble({ text }) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          className="absolute bottom-24 right-4 z-30 max-w-[200px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white rounded-2xl px-3 py-2 shadow-md text-sm leading-snug text-gray-700 relative">
            {t(text)}
            <span className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
