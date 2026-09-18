'use client'

import { useState } from 'react'
import { KeyRound, RefreshCw, Wifi, HardDrive, Loader2 } from 'lucide-react'
import { CopyButton } from '../copy-button'
import { fieldClass } from '../modal'

export function ToolsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PasswordGenerator />
      <PingTester />
      <SizeConverter />
    </div>
  )
}

function ToolCard({
  icon,
  title,
  children,
  wide,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <section className={'glass rounded-2xl p-5 ' + (wide ? 'lg:col-span-2' : '')}>
      <div className="mb-4 flex items-center gap-2">
        <div className="gold-fill flex size-8 items-center justify-center rounded-lg">
          {icon}
        </div>
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  )
}

/* ---------------- Password Generator ---------------- */
function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [nums, setNums] = useState(true)
  const [syms, setSyms] = useState(true)
  const [password, setPassword] = useState('')

  function generate() {
    let chars = 'abcdefghijklmnopqrstuvwxyz'
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (nums) chars += '0123456789'
    if (syms) chars += '!@#$%^&*()-_=+[]{}'
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    let out = ''
    for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length]
    setPassword(out)
  }

  return (
    <ToolCard icon={<KeyRound className="size-4" />} title="مولّد كلمات المرور">
      <div className="mb-3 flex items-center gap-2">
        <input
          dir="ltr"
          readOnly
          value={password}
          placeholder="اضغط توليد"
          className={fieldClass + ' text-left font-mono'}
        />
        <button
          type="button"
          onClick={generate}
          aria-label="توليد"
          className="gold-fill flex size-9 shrink-0 items-center justify-center rounded-xl transition-all hover:brightness-105 active:translate-y-px"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>الطول</span>
          <span className="font-mono font-bold text-gold">{length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={40}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[var(--gold)]"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <Toggle label="أحرف كبيرة" active={upper} onClick={() => setUpper((v) => !v)} />
        <Toggle label="أرقام" active={nums} onClick={() => setNums((v) => !v)} />
        <Toggle label="رموز" active={syms} onClick={() => setSyms((v) => !v)} />
      </div>

      {password ? <CopyButton value={password} label="نسخ كلمة المرور" /> : null}
    </ToolCard>
  )
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-lg px-3 py-1.5 font-semibold transition-all ' +
        (active
          ? 'gold-fill'
          : 'border border-border bg-muted/40 text-muted-foreground hover:text-foreground')
      }
    >
      {label}
    </button>
  )
}

/* ---------------- Ping / Connectivity Tester ---------------- */
function PingTester() {
  const [host, setHost] = useState('https://vercel.com')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle')
  const [latency, setLatency] = useState<number | null>(null)

  async function ping() {
    setStatus('loading')
    setLatency(null)
    const url = host.startsWith('http') ? host : `https://${host}`
    const start = performance.now()
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store' })
      const ms = Math.round(performance.now() - start)
      setLatency(ms)
      setStatus('ok')
    } catch {
      setLatency(Math.round(performance.now() - start))
      setStatus('fail')
    }
  }

  return (
    <ToolCard icon={<Wifi className="size-4" />} title="اختبار الاتصال (Ping)">
      <div className="mb-3 flex items-center gap-2">
        <input
          dir="ltr"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="example.com"
          className={fieldClass + ' text-left'}
        />
        <button
          type="button"
          onClick={ping}
          disabled={status === 'loading'}
          className="gold-fill flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-bold transition-all hover:brightness-105 active:translate-y-px disabled:opacity-60"
        >
          {status === 'loading' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Wifi className="size-4" />
          )}
          فحص
        </button>
      </div>

      {status !== 'idle' ? (
        <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
          {status === 'loading' ? (
            <span className="text-muted-foreground">جارٍ الفحص…</span>
          ) : (
            <div className="flex items-center justify-between">
              <span
                className={
                  status === 'ok' ? 'font-semibold text-emerald-500' : 'font-semibold text-destructive'
                }
              >
                {status === 'ok' ? 'الوصول متاح ✓' : 'تعذّر الوصول ✕'}
              </span>
              {latency !== null ? (
                <span className="font-mono font-bold text-gold">{latency} ms</span>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          يقيس زمن الاستجابة التقريبي للوصول إلى المضيف من متصفحك.
        </p>
      )}
    </ToolCard>
  )
}

/* ---------------- Data Size Converter ---------------- */
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const
type Unit = (typeof UNITS)[number]

function PingUnitConvert(value: number, from: Unit): Record<Unit, number> {
  const idx = UNITS.indexOf(from)
  const bytes = value * Math.pow(1024, idx)
  const out = {} as Record<Unit, number>
  UNITS.forEach((u, i) => {
    out[u] = bytes / Math.pow(1024, i)
  })
  return out
}

function SizeConverter() {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState<Unit>('GB')
  const num = Number(value)
  const valid = value.trim() !== '' && !Number.isNaN(num)
  const results = valid ? PingUnitConvert(num, unit) : null

  const fmt = (n: number) =>
    n >= 1
      ? n.toLocaleString('en-US', { maximumFractionDigits: 3 })
      : n.toLocaleString('en-US', { maximumFractionDigits: 6 })

  return (
    <ToolCard icon={<HardDrive className="size-4" />} title="محوّل أحجام البيانات" wide>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          dir="ltr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          className={fieldClass + ' max-w-40 text-left font-mono'}
        />
        <div className="flex flex-wrap gap-1.5">
          {UNITS.map((u) => (
            <Toggle
              key={u}
              label={u}
              active={unit === u}
              onClick={() => setUnit(u)}
            />
          ))}
        </div>
      </div>

      {results ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {UNITS.map((u) => (
            <div
              key={u}
              className={
                'rounded-xl border p-3 text-center ' +
                (u === unit
                  ? 'gold-ring bg-primary/10'
                  : 'border-border bg-muted/40')
              }
            >
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                {u}
              </p>
              <p dir="ltr" className="mt-1 font-mono text-sm font-bold text-foreground">
                {fmt(results[u])}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-destructive">أدخل قيمة رقمية صحيحة.</p>
      )}
    </ToolCard>
  )
}
