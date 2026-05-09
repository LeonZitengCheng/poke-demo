import { useState, useCallback, useRef } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import FakeFeed from './components/FakeFeed.jsx'
import Poke from './components/Poke.jsx'
import MoodBubble from './components/MoodBubble.jsx'
import InterruptDialog from './components/InterruptDialog.jsx'
import DebugPanel from './components/DebugPanel.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import { usePoke } from './hooks/usePoke.js'
import { useScrollDetector } from './hooks/useScrollDetector.js'

export default function App() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem('poke_entered') === '1')
  const poke = usePoke()
  const [elapsed, setElapsed] = useState(0)
  const [cardCount, setCardCount] = useState(0)

  // Escalation state
  const [interruptionCount, setInterruptionCount] = useState(0)
  const [isSilentMode, setIsSilentMode] = useState(false)
  const interruptionCountRef = useRef(0)   // ref for non-stale reads inside callbacks
  const sessionStartTimeRef = useRef(null)
  const totalVideosWatchedRef = useRef(0)

  // Dynamic thresholds: 30s/5 cards for 1st, 3min/30 cards for 2nd and 3rd
  const timeThresholdMs = interruptionCount === 0 ? 30000 : 180000
  const cardThreshold = interruptionCount === 0 ? 5 : 30

  const getSessionMinutes = () => {
    const start = sessionStartTimeRef.current || Date.now()
    return Math.max(1, Math.ceil((Date.now() - start) / 60000))
  }

  const handleThreshold = useCallback(() => {
    const count = interruptionCountRef.current
    if (isSilentMode || count >= 3 || poke.dialogOpen) return

    const stage = count + 1
    if (stage === 1) {
      poke.trigger()
    } else {
      poke.triggerStage(stage, {
        N: totalVideosWatchedRef.current,
        X: getSessionMinutes(),
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSilentMode, poke])

  const { onCardChange, reset, getElapsed, getCardCount } = useScrollDetector({
    onThresholdReached: handleThreshold,
    timeThresholdMs,
    cardThreshold,
  })

  // Called after any interruption dialog closes — advances the escalation counter
  const afterInterruptionClosed = useCallback((dismissed) => {
    const newCount = interruptionCountRef.current + 1
    interruptionCountRef.current = newCount
    setInterruptionCount(newCount)

    if (newCount >= 3 && dismissed) {
      setIsSilentMode(true)
      poke.enterSilentMode()
    } else if (newCount < 3) {
      // Reset detector so it starts counting toward the next stage's threshold
      reset()
      setElapsed(0)
      setCardCount(0)
    }
  }, [poke, reset])

  const handleFeedScroll = () => {
    totalVideosWatchedRef.current += 1
    onCardChange()
    setElapsed(getElapsed())
    setCardCount(getCardCount())
  }

  // Existing reset (timer only)
  const handleReset = () => {
    reset()
    setElapsed(0)
    setCardCount(0)
    poke.hide()
  }

  // Full session reset
  const handleResetSession = () => {
    interruptionCountRef.current = 0
    setInterruptionCount(0)
    setIsSilentMode(false)
    sessionStartTimeRef.current = Date.now()
    totalVideosWatchedRef.current = 0
    reset()
    setElapsed(0)
    setCardCount(0)
    poke.hide()
  }

  // Debug panel force-stage helpers
  const handleForceStage2 = () => {
    interruptionCountRef.current = 1
    setInterruptionCount(1)
    poke.triggerStage(2, {
      N: totalVideosWatchedRef.current || 12,
      X: getSessionMinutes(),
    })
  }

  const handleForceStage3 = () => {
    interruptionCountRef.current = 2
    setInterruptionCount(2)
    poke.triggerStage(3, {
      N: totalVideosWatchedRef.current || 34,
      X: getSessionMinutes(),
    })
  }

  const handleForceSilent = () => {
    interruptionCountRef.current = 3
    setInterruptionCount(3)
    setIsSilentMode(true)
    poke.enterSilentMode()
  }

  if (!entered) {
    return (
      <PhoneFrame>
        <WelcomeScreen
          onEnter={() => {
            sessionStartTimeRef.current = Date.now()
            setEntered(true)
          }}
        />
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <FakeFeed onScroll={handleFeedScroll} />

      <MoodBubble text={poke.bubble} />

      <Poke
        mood={poke.mood}
        visible={poke.visible}
        silentMode={isSilentMode}
        lowEnergy={poke.currentStage === 2}
        onClick={() => {
          if (!poke.dialogOpen) poke.showBubble('poke_clicked', 1500)
        }}
        onSilentTap={poke.tapSilentOtter}
      />

      <InterruptDialog
        open={poke.dialogOpen}
        mood={poke.mood}
        stage={poke.currentStage}
        stageDialogueKey={poke.stageDialogueKey}
        stageContextData={poke.stageContextData}
        // Stage 1 callbacks (wrapped to advance escalation counter)
        onAcknowledged={() => { poke.handleAcknowledged(); afterInterruptionClosed(false) }}
        onCouldntAnswer={() => { poke.handleCouldntAnswer(); afterInterruptionClosed(false) }}
        onDismissed={() => { poke.handleDismissed(); afterInterruptionClosed(true) }}
        // Stage 2 callbacks
        onStage2Break={() => { poke.handleStage2Break(); afterInterruptionClosed(false) }}
        onStage2Done={() => { poke.handleStage2Done(); afterInterruptionClosed(false) }}
        onStage2KeepScrolling={() => { poke.handleStage2KeepScrolling(); afterInterruptionClosed(true) }}
        // Stage 3 callbacks
        onStage3TakeCare={() => { poke.handleStage3TakeCare(); afterInterruptionClosed(false) }}
        onStage3JustABitMore={() => { poke.handleStage3JustABitMore(); afterInterruptionClosed(true) }}
      />

      <DebugPanel
        onForceMood={poke.forceMood}
        onTrigger={() => poke.trigger()}
        onOpenDialog={() => poke.trigger()}
        onReset={handleReset}
        elapsed={elapsed}
        cardCount={cardCount}
        interruptionCount={interruptionCount}
        onForceStage2={handleForceStage2}
        onForceStage3={handleForceStage3}
        onForceSilent={handleForceSilent}
        onResetSession={handleResetSession}
      />
    </PhoneFrame>
  )
}
