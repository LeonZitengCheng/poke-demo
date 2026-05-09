import { useState, useCallback } from 'react'
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

  const handleThreshold = useCallback(() => {
    poke.trigger()
  }, [poke])

  const { onCardChange, reset, getElapsed, getCardCount } = useScrollDetector({
    onThresholdReached: handleThreshold,
    timeThresholdMs: 30000,
    cardThreshold: 5,
  })

  const handleFeedScroll = () => {
    onCardChange()
    setElapsed(getElapsed())
    setCardCount(getCardCount())
  }

  const handleReset = () => {
    reset()
    setElapsed(0)
    setCardCount(0)
    poke.hide()
  }

  if (!entered) {
    return (
      <PhoneFrame>
        <WelcomeScreen onEnter={() => setEntered(true)} />
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
        onClick={() => {
          if (!poke.dialogOpen) poke.showBubble('poke_clicked', 1500)
        }}
      />
      <InterruptDialog
        open={poke.dialogOpen}
        mood={poke.mood}
        onAcknowledged={poke.handleAcknowledged}
        onCouldntAnswer={poke.handleCouldntAnswer}
        onDismissed={poke.handleDismissed}
      />

      <DebugPanel
        onForceMood={poke.forceMood}
        onTrigger={() => poke.trigger()}
        onOpenDialog={() => poke.trigger()}
        onReset={handleReset}
        elapsed={elapsed}
        cardCount={cardCount}
      />
    </PhoneFrame>
  )
}
