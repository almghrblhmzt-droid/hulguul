'use client'

import { Terminal, Pencil, Trash2 } from 'lucide-react'
import { CopyButton } from '../copy-button'
import type { CommandItem, Role } from '@/lib/types'

export function CommandsPanel({
  items,
  role,
  onEdit,
  onDelete,
}: {
  items: CommandItem[]
  role: Role | null
  onEdit: (item: CommandItem) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) {
    return <Empty label="لا توجد أوامر بعد" />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((cmd) => (
        <article
          key={cmd.id}
          className="glass group flex flex-col rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-primary" />
              <h3 className="font-bold text-foreground">{cmd.title}</h3>
            </div>
            <span
              className={
                'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ' +
                (cmd.shell === 'powershell'
                  ? 'bg-sky-500/15 text-sky-500'
                  : 'bg-primary/15 text-primary')
              }
            >
              {cmd.shell === 'powershell' ? 'PowerShell' : 'CMD'}
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{cmd.description}</p>
          <pre
            dir="ltr"
            className="code-scroll mb-3 overflow-x-auto rounded-xl border border-border bg-black/70 p-3 text-left font-mono text-[13px] leading-relaxed text-emerald-300"
          >
            <code>{cmd.script}</code>
          </pre>
          <div className="mt-auto flex items-center justify-between gap-2">
            <CopyButton value={cmd.script} />
            {role === 'admin' ? (
              <AdminActions
                onEdit={() => onEdit(cmd)}
                onDelete={() => onDelete(cmd.id)}
              />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}

export function AdminActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        aria-label="تعديل"
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="حذف"
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export function Empty({ label }: { label: string }) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
