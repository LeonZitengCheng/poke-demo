import { useState, useCallback } from 'react'
import { dialogues } from '../data/dialogues.js'
import { pickDialogue } from '../utils/pickDialogue.js'
import { playSound } from '../utils/sound.js'

export const MOODS = ['happy', 'calm', 'withered', 'playful']

function vibrate(pattern) {
  try { navigator.vibrate?.(pattern) } catch {}
}

export function usePoke() {
  const [visible, setVisible] = useState(false)
  const [mood, setMood] = useState('calm')
  const [bubble, setBubble] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const showBubble = useCallback((text, duration = 3000) => {
    setBubble(text)
    if (duration > 0) {
      setTimeout(() => setBubble(null), duration)
    }
  }, [])

  const trigger = useCallback((forceMood) => {
    const selectedMood = forceMood || (['calm', 'playful', 'withered'][Math.floor(Math.random() * 3)])
    setMood(selectedMood)
    setVisible(true)

    playSound('pop')
    vibrate(50)

    if (selectedMood === 'withered') {
      setTimeout(() => playSound('sigh'), 120)
    }

    const moodLines = dialogues.short_video_threshold[selectedMood] || dialogues.short_video_threshold.calm
    const text = pickDialogue(moodLines)
    playSound('whoosh')
    showBubble(text, 0)

    setTimeout(() => setDialogOpen(true), 1500)
  }, [showBubble])

  const handleAcknowledged = useCallback(() => {
    setDialogOpen(false)
    setMood('happy')
    setBubble(null)
    const text = pickDialogue(dialogues.user_acknowledged.happy)
    setTimeout(() => {
      playSound('whoosh')
      showBubble(text, 3000)
    }, 100)
  }, [showBubble])

  const handleCouldntAnswer = useCallback(() => {
    setDialogOpen(false)
    setMood('calm')
    setBubble(null)
    const text = pickDialogue(dialogues.user_couldnt_answer.calm)
    setTimeout(() => {
      playSound('whoosh')
      showBubble(text, 4000)
    }, 100)
  }, [showBubble])

  const handleDismissed = useCallback(() => {
    setDialogOpen(false)
    setMood('withered')
    setBubble(null)
    // intentional silence — "keep scrolling" has no sound
    const text = pickDialogue(dialogues.user_dismissed.withered)
    setTimeout(() => showBubble(text, 3000), 100)
  }, [showBubble])

  const forceMood = useCallback((m) => {
    setMood(m)
    setVisible(true)
    if (m === 'withered') playSound('sigh')
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
    setDialogOpen(false)
    setBubble(null)
  }, [])

  return {
    visible, mood, bubble, dialogOpen,
    trigger, forceMood, hide,
    handleAcknowledged, handleCouldntAnswer, handleDismissed,
    showBubble,
  }
}
