import { useState, useCallback } from 'react'
import { dialogues } from '../data/dialogues.js'
import { pickDialogue } from '../utils/pickDialogue.js'
import { playSound } from '../utils/sound.js'

export const MOODS = ['happy', 'calm', 'withered', 'playful']

const STAGE2_KEYS = [0, 1, 2].map(i => `interruption.stage2.dialogues.${i}`)
const STAGE3_KEYS = [0, 1, 2].map(i => `interruption.stage3.dialogues.${i}`)

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function vibrate(pattern) {
  try { navigator.vibrate?.(pattern) } catch {}
}

export function usePoke() {
  const [visible, setVisible] = useState(false)
  const [mood, setMood] = useState('calm')
  const [bubble, setBubble] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [stageDialogueKey, setStageDialogueKey] = useState(null)
  const [stageContextData, setStageContextData] = useState({})
  const [isSilentMode, setIsSilentMode] = useState(false)

  const showBubble = useCallback((text, duration = 3000) => {
    setBubble(text)
    if (duration > 0) {
      setTimeout(() => setBubble(null), duration)
    }
  }, [])

  const clearBubble = useCallback(() => setBubble(null), [])

  // Stage 1 — don't change existing behavior
  const trigger = useCallback((forceMood) => {
    setCurrentStage(1)
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

  // Stages 2 and 3 — new escalating interruptions
  const triggerStage = useCallback((stage, contextData = {}) => {
    setCurrentStage(stage)
    setStageContextData(contextData)

    if (stage === 2) {
      setStageDialogueKey(pickRandom(STAGE2_KEYS))
      setMood('calm')
      setVisible(true)
      playSound('pop')
      vibrate(50)
      playSound('whoosh')
      setTimeout(() => setDialogOpen(true), 1000)
    } else if (stage === 3) {
      setStageDialogueKey(pickRandom(STAGE3_KEYS))
      setMood('withered')
      setVisible(true)
      playSound('pop')
      vibrate(50)
      setTimeout(() => playSound('sigh'), 120)
      playSound('whoosh')
      setTimeout(() => setDialogOpen(true), 1000)
    }
  }, [])

  // Stage 1 response handlers — don't change
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

  // Stage 2 response handlers
  const handleStage2Break = useCallback(() => {
    setDialogOpen(false)
    setMood('happy')
    setBubble(null)
    playSound('chime')
    const text = pickDialogue(dialogues.user_acknowledged.happy)
    setTimeout(() => { playSound('whoosh'); showBubble(text, 3000) }, 100)
  }, [showBubble])

  const handleStage2Done = useCallback(() => {
    setDialogOpen(false)
    setMood('happy')
    setBubble(null)
    playSound('chime')
    const text = pickDialogue(dialogues.user_acknowledged.happy)
    setTimeout(() => { playSound('whoosh'); showBubble(text, 3000) }, 100)
  }, [showBubble])

  const handleStage2KeepScrolling = useCallback(() => {
    setDialogOpen(false)
    setMood('withered')
    setBubble(null)
    // intentional silence — mirroring stage 1 dismissed behavior
    const text = pickDialogue(dialogues.user_dismissed.withered)
    setTimeout(() => showBubble(text, 3000), 100)
  }, [showBubble])

  // Stage 3 response handlers
  const handleStage3TakeCare = useCallback(() => {
    setDialogOpen(false)
    setMood('calm')
    setBubble(null)
    playSound('chime')
    const text = pickDialogue(dialogues.user_acknowledged.happy)
    setTimeout(() => { playSound('whoosh'); showBubble(text, 3000) }, 100)
  }, [showBubble])

  const handleStage3JustABitMore = useCallback(() => {
    setDialogOpen(false)
    // App.jsx calls enterSilentMode() after this
  }, [])

  // Silent mode
  const enterSilentMode = useCallback(() => {
    setIsSilentMode(true)
    setVisible(true)
    setMood('withered')
    setDialogOpen(false)
    setBubble(null)
  }, [])

  const tapSilentOtter = useCallback(() => {
    setBubble(prev =>
      prev === 'interruption.silentMode.bubble' ? null : 'interruption.silentMode.bubble'
    )
  }, [])

  const forceMood = useCallback((m) => {
    setMood(m)
    setVisible(true)
    if (m === 'withered') playSound('sigh')
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
    setDialogOpen(false)
    setBubble(null)
    setIsSilentMode(false)
    setCurrentStage(1)
  }, [])

  return {
    visible, mood, bubble, dialogOpen,
    currentStage, stageDialogueKey, stageContextData, isSilentMode,
    trigger, triggerStage, forceMood, hide,
    handleAcknowledged, handleCouldntAnswer, handleDismissed,
    handleStage2Break, handleStage2Done, handleStage2KeepScrolling,
    handleStage3TakeCare, handleStage3JustABitMore,
    enterSilentMode, tapSilentOtter,
    showBubble, clearBubble,
  }
}
