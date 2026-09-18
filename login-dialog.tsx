'use client'

import { useState } from 'react'
import { LogIn, AlertCircle } from 'lucide-react'
import { Modal, Field, fieldClass } from './modal'
import type { Role } from '@/lib/types'

const ADMIN = { username: 'hulguul', password: 'hulg20' }

export function LoginDialog({
  open,
  onClose,
  onLogin,
}: {
  open: boolean
  onClose: () => void
  onLogin: (role: Role, username: string) => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (
      username.trim().toLowerCase() === ADMIN.username &&
      password === ADMIN.password
    ) {
      onLogin('admin', ADMIN.username)
      setUsername('')
      setPassword('')
      setError('')
      onClose()
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="دخول المشرف"
      description="سجّل الدخول للتحكم الكامل بالإنشاء والتعديل والحذف"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="اسم المستخدم">
          <input
            className={fieldClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="hulguul"
            autoComplete="username"
            dir="ltr"
          />
        </Field>
        <Field label="كلمة المرور">
          <input
            type="password"
            className={fieldClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            dir="ltr"
          />
        </Field>

        {error ? (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="gold-fill flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-lg transition-all hover:brightness-105 active:translate-y-px"
        >
          <LogIn className="size-4" />
          دخول
        </button>
      </form>
    </Modal>
  )
}
