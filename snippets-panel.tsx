'use client'

import { Code2, Download, FileCode } from 'lucide-react'
import { CopyButton } from '../copy-button'
import { AdminActions, Empty } from './commands-panel'
import type { SnippetItem, Role } from '@/lib/types'

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'snippet.txt'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function SnippetsPanel({
  items,
  role,
  onEdit,
  onDelete,
}: {
  items: SnippetItem[]
  role: Role | null
  onEdit: (item: SnippetItem) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) {
    return <Empty label="لا توجد مقتطفات بعد" />
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((snip) => (
        <article key={snip.id} className="glass flex flex-col rounded-2xl p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-primary" />
              <h3 className="font-bold text-foreground">{snip.title}</h3>
            </div>
            <span className="flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
              <FileCode className="size-3" />
              {snip.language}
            </span>
          </div>
          <p dir="ltr" className="mb-2 text-right font-mono text-[11px] text-muted-foreground">
            {snip.filename}
          </p>
          <pre
            dir="ltr"
            className="code-scroll mb-3 max-h-64 overflow-auto rounded-xl border border-border bg-black/70 p-3 text-left font-mono text-[13px] leading-relaxed text-sky-200"
          >
            <code>{snip.code}</code>
          </pre>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CopyButton value={snip.code} />
              <button
                type="button"
                onClick={() => downloadFile(snip.filename, snip.code)}
                className="inline-flex items-center gap-1.5 rounded-lg gold-ring px-2.5 py-1 text-xs font-semibold text-gold transition-all hover:bg-primary/10"
              >
                <Download className="size-3.5" />
                تنزيل كملف
              </button>
            </div>
            {role === 'admin' ? (
              <AdminActions
                onEdit={() => onEdit(snip)}
                onDelete={() => onDelete(snip.id)}
              />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
