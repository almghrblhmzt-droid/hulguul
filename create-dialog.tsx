'use client'

import { useEffect, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { Modal, Field, fieldClass } from './modal'
import {
  CATEGORIES,
  type CommandItem,
  type LinkItem,
  type SnippetItem,
  type TabKey,
} from '@/lib/types'
import { uid } from '@/lib/seed'

export type EditingItem =
  | { kind: 'commands'; item: CommandItem }
  | { kind: 'links'; item: LinkItem }
  | { kind: 'snippets'; item: SnippetItem }
  | null

const LABELS: Record<Exclude<TabKey, 'tools'>, string> = {
  commands: 'أمر نظام',
  links: 'رابط سريع',
  snippets: 'مقتطف كود',
}

export function CreateDialog({
  open,
  onClose,
  tab,
  editing,
  onSaveCommand,
  onSaveLink,
  onSaveSnippet,
}: {
  open: boolean
  onClose: () => void
  tab: TabKey
  editing: EditingItem
  onSaveCommand: (item: CommandItem) => void
  onSaveLink: (item: LinkItem) => void
  onSaveSnippet: (item: SnippetItem) => void
}) {
  const kind = (editing?.kind ?? (tab === 'tools' ? 'commands' : tab)) as Exclude<
    TabKey,
    'tools'
  >

  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setForm({ ...(editing.item as unknown as Record<string, string>) })
    } else {
      setForm(kind === 'commands' ? { shell: 'cmd' } : {})
    }
  }, [open, editing, kind])

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id = editing?.item.id ?? uid()
    if (kind === 'commands') {
      onSaveCommand({
        id,
        title: form.title ?? '',
        description: form.description ?? '',
        script: form.script ?? '',
        shell: (form.shell as 'cmd' | 'powershell') ?? 'cmd',
      })
    } else if (kind === 'links') {
      onSaveLink({
        id,
        title: form.title ?? '',
        description: form.description ?? '',
        url: form.url ?? '',
        category: form.category || 'عام',
      })
    } else {
      onSaveSnippet({
        id,
        title: form.title ?? '',
        language: form.language || 'Text',
        filename: form.filename || 'snippet.txt',
        code: form.code ?? '',
      })
    }
    onClose()
  }

  const isEdit = Boolean(editing)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `تعديل ${LABELS[kind]}` : `إضافة ${LABELS[kind]}`}
      description="املأ الحقول ثم احفظ لإضافة العنصر إلى لوحة التحكم"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="العنوان">
          <input
            required
            className={fieldClass}
            value={form.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
          />
        </Field>

        {kind !== 'snippets' ? (
          <Field label="الوصف">
            <input
              className={fieldClass}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>
        ) : null}

        {kind === 'commands' ? (
          <>
            <Field label="نوع الصدفة">
              <div className="flex gap-2">
                {(['cmd', 'powershell'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('shell', s)}
                    className={
                      'flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all ' +
                      ((form.shell ?? 'cmd') === s
                        ? 'gold-fill'
                        : 'border border-border bg-muted/40 text-muted-foreground')
                    }
                  >
                    {s === 'powershell' ? 'PowerShell' : 'CMD'}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="الأمر / السكربت">
              <textarea
                required
                dir="ltr"
                rows={3}
                className={fieldClass + ' text-left font-mono'}
                value={form.script ?? ''}
                onChange={(e) => set('script', e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {kind === 'links' ? (
          <>
            <Field label="الرابط (URL)">
              <input
                required
                dir="ltr"
                type="url"
                placeholder="https://..."
                className={fieldClass + ' text-left'}
                value={form.url ?? ''}
                onChange={(e) => set('url', e.target.value)}
              />
            </Field>
            <Field label="التصنيف">
              <select
                className={fieldClass}
                value={form.category ?? CATEGORIES[3]}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </>
        ) : null}

        {kind === 'snippets' ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="اللغة">
                <input
                  className={fieldClass}
                  placeholder="TypeScript"
                  value={form.language ?? ''}
                  onChange={(e) => set('language', e.target.value)}
                />
              </Field>
              <Field label="اسم الملف">
                <input
                  dir="ltr"
                  className={fieldClass + ' text-left font-mono'}
                  placeholder="file.ts"
                  value={form.filename ?? ''}
                  onChange={(e) => set('filename', e.target.value)}
                />
              </Field>
            </div>
            <Field label="الكود">
              <textarea
                required
                dir="ltr"
                rows={6}
                className={fieldClass + ' text-left font-mono'}
                value={form.code ?? ''}
                onChange={(e) => set('code', e.target.value)}
              />
            </Field>
          </>
        ) : null}

        <button
          type="submit"
          className="gold-fill flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-lg transition-all hover:brightness-105 active:translate-y-px"
        >
          {isEdit ? <Save className="size-4" /> : <Plus className="size-4" />}
          {isEdit ? 'حفظ التعديلات' : 'إضافة'}
        </button>
      </form>
    </Modal>
  )
}
