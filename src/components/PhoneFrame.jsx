import { useState, useEffect } from 'react'

function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    update()
    const id = setInterval(update, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-black/20 backdrop-blur-sm text-white text-xs h-7 shrink-0">
      <span className="font-medium">{time}</span>
      <div className="flex items-center gap-1">
        <span>▲▲▲</span>
        <span>WiFi</span>
        <span>🔋 87%</span>
      </div>
    </div>
  )
}

export default function PhoneFrame({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      {/* Desktop: phone shell */}
      <div className="hidden md:flex flex-col w-[380px] h-[780px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-gray-800 bg-black relative">
        <StatusBar />
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </div>

      {/* Mobile: fullscreen */}
      <div className="md:hidden w-full h-screen flex flex-col bg-black relative overflow-hidden">
        <StatusBar />
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
