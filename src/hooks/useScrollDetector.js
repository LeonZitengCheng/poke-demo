import { useRef, useEffect, useCallback } from 'react'

export function useScrollDetector({ onThresholdReached, timeThresholdMs = 30000, cardThreshold = 5 }) {
  const startTimeRef = useRef(null)
  const cardCountRef = useRef(0)
  const triggeredRef = useRef(false)
  const timerRef = useRef(null)

  const reset = useCallback(() => {
    startTimeRef.current = null
    cardCountRef.current = 0
    triggeredRef.current = false
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const startTracking = useCallback(() => {
    if (startTimeRef.current) return
    startTimeRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      if (!triggeredRef.current) {
        triggeredRef.current = true
        onThresholdReached()
      }
    }, timeThresholdMs)
  }, [timeThresholdMs, onThresholdReached])

  const onCardChange = useCallback(() => {
    startTracking()
    cardCountRef.current += 1
    if (cardCountRef.current >= cardThreshold && !triggeredRef.current) {
      triggeredRef.current = true
      onThresholdReached()
    }
  }, [cardThreshold, onThresholdReached, startTracking])

  const getElapsed = useCallback(() => {
    if (!startTimeRef.current) return 0
    return Date.now() - startTimeRef.current
  }, [])

  const getCardCount = useCallback(() => cardCountRef.current, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { onCardChange, reset, getElapsed, getCardCount }
}
