'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface ToastMsg {
  id: number
  text: string
}

const TOAST_EVENT = 'app-toast'

export function showToast(text: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: text }))
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  useEffect(() => {
    function onToast(e: Event) {
      const text = (e as CustomEvent<string>).detail
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, text }])
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 2600)
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => window.removeEventListener(TOAST_EVENT, onToast)
  }, [])

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in glass gold-ring flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-gold shadow-xl"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          {t.text}
        </div>
      ))}
    </div>
  )
}
