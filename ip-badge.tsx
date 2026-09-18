'use client'

import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

export function IpBadge() {
  const [ip, setIp] = useState<string>('...')

  useEffect(() => {
    let active = true
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((d) => {
        if (active) setIp(d.ip ?? 'غير متاح')
      })
      .catch(() => active && setIp('غير متاح'))
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="glass hidden items-center gap-2 rounded-xl px-3 py-1.5 lg:flex">
      <Globe className="size-4 text-primary" />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] text-muted-foreground">عنوان IP العام</span>
        <span className="font-mono text-xs font-bold tabular-nums text-foreground">
          {ip}
        </span>
      </div>
    </div>
  )
}
