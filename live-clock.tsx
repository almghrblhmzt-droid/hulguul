'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--:--'
  const date = now
    ? now.toLocaleDateString('ar-EG', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <div className="glass hidden items-center gap-2.5 rounded-xl px-3 py-1.5 md:flex">
      <Clock className="size-4 text-primary" />
      <div className="flex flex-col leading-tight">
        <span
          className="font-mono text-sm font-bold tabular-nums text-gold"
          suppressHydrationWarning
        >
          {time}
        </span>
        <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>
          {date}
        </span>
      </div>
    </div>
  )
}
