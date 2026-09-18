'use client'

import { useEffect, useRef, useState } from 'react'
import { Moon, Sun, LogOut, User, ShieldAlert, ChevronDown } from 'lucide-react'
import { LiveClock } from './live-clock'
import { IpBadge } from './ip-badge'
import type { Role } from '@/lib/types'

export function SiteHeader({
  role,
  username,
  theme,
  onToggleTheme,
  onOpenLogin,
  onLogout,
}: {
  role: Role | null
  username: string | null
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenLogin: () => void
  onLogout: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  return (
    <header className="glass sticky top-0 z-30 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="gold-fill flex size-10 items-center justify-center rounded-xl text-lg font-black shadow-md">
            H
          </div>
          <div className="leading-tight">
            <h1 className="text-gold text-xl font-black tracking-wide">HULGUUL</h1>
            <p className="text-[10px] text-muted-foreground">مركز القيادة التقني</p>
          </div>
        </div>

        {/* Live widgets */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="glass flex items-center gap-1.5 rounded-xl px-2.5 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-500">متصل</span>
          </div>
          <LiveClock />
          <IpBadge />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="تبديل السمة"
            className="glass flex size-9 items-center justify-center rounded-xl text-foreground/80 transition-all hover:text-gold"
          >
            {theme === 'dark' ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>

          {role ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="glass flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:text-gold"
              >
                <span className="gold-fill flex size-7 items-center justify-center rounded-lg text-xs font-bold uppercase">
                  {username?.[0] ?? 'U'}
                </span>
                <span className="hidden text-sm font-semibold sm:inline">
                  {username}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="glass absolute left-0 mt-2 w-52 rounded-2xl p-2"
                >
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2">
                    <User className="size-4 text-primary" />
                    <div className="leading-tight">
                      <p className="text-sm font-semibold">{username}</p>
                      <p className="text-[11px] text-muted-foreground">
                        مشرف — تحكم كامل
                      </p>
                    </div>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      onLogout()
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 rounded-xl bg-destructive px-3 py-2 text-sm font-bold text-white shadow-lg shadow-destructive/30 transition-all hover:brightness-110 active:translate-y-px"
            >
              <ShieldAlert className="size-4" />
              دخول المشرف
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
