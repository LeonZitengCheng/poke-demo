import { motion, AnimatePresence } from 'framer-motion'

const MOOD_CONFIG = {
  happy: {
    src: '/poke-demo/assets/poke_happy.png',
    idle: {
      y: [0, -4, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  calm: {
    src: '/poke-demo/assets/poke_calm.png',
    idle: {
      y: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  withered: {
    src: '/poke-demo/assets/poke_withered.png',
    idle: {
      y: 6,
      x: [0, -2, 2, 0],
      transition: { x: { duration: 0.4, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' } },
    },
  },
  playful: {
    src: '/poke-demo/assets/poke_playful.png',
    idle: {
      x: [0, -3, 3, 0],
      y: [0, 0, 0, -12, 0],
      transition: {
        x: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 0.6, repeat: Infinity, repeatDelay: 4.4, ease: 'easeOut' },
      },
    },
  },
}

export default function Poke({ mood = 'calm', visible, onClick }) {
  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.calm

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-4 right-4 z-30 cursor-pointer select-none"
          initial={{ x: 50, y: 50, scale: 0.7, opacity: 0 }}
          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          exit={{ x: 50, y: 50, scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onClick}
        >
          <motion.div
            animate={config.idle}
            whileTap={{ scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 10, duration: 0.2 } }}
          >
            <img
              src={config.src}
              alt={`poke ${mood}`}
              className="w-20 h-20 object-contain drop-shadow-md"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
