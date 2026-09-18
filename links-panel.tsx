'use client'

import { ExternalLink, Link2 } from 'lucide-react'
import { AdminActions, Empty } from './commands-panel'
import type { LinkItem, Role } from '@/lib/types'

export function LinksPanel({
  items,
  role,
  onEdit,
  onDelete,
}: {
  items: LinkItem[]
  role: Role | null
  onEdit: (item: LinkItem) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) {
    return <Empty label="لا توجد روابط بعد" />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((link) => (
        <article
          key={link.id}
          className="glass group relative flex flex-col rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="gold-fill flex size-9 items-center justify-center rounded-xl">
              <Link2 className="size-5" />
            </div>
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
              {link.category}
            </span>
          </div>
          <h3 className="font-bold text-foreground">{link.title}</h3>
          <p className="mb-3 mt-1 line-clamp-2 text-sm text-muted-foreground">
            {link.description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg gold-ring px-2.5 py-1 text-xs font-semibold text-gold transition-all hover:bg-primary/10"
            >
              <ExternalLink className="size-3.5" />
              فتح الرابط
            </a>
            {role === 'admin' ? (
              <AdminActions
                onEdit={() => onEdit(link)}
                onDelete={() => onDelete(link.id)}
              />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
