'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { showToast } from './toaster'

export function CopyButton({
  value,
  label = 'نسخ',
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      showToast('تم النسخ إلى الحافظة بنجاح!')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg gold-ring px-2.5 py-1 text-xs font-semibold text-gold transition-all hover:bg-primary/10 active:translate-y-px',
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span className={copied ? 'text-emerald-500' : undefined}>
        {copied ? 'تم النسخ' : label}
      </span>
    </button>
  )
}
