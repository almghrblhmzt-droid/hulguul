'use client'

import { useEffect, useState } from 'react'
import { Plus, Terminal, Link2, Code2, Wrench, Search, X } from 'lucide-react'
import { SiteHeader } from './site-header'
import { LoginDialog } from './login-dialog'
import { Toaster } from './toaster'
import { CreateDialog, type EditingItem } from './create-dialog'
import { CommandsPanel } from './tabs/commands-panel'
import { LinksPanel } from './tabs/links-panel'
import { SnippetsPanel } from './tabs/snippets-panel'
import { ToolsPanel } from './tabs/tools-panel'
import { seedData } from '@/lib/seed'
import type {
  CommandItem,
  DataStore,
  LinkItem,
  Role,
  SnippetItem,
  TabKey,
} from '@/lib/types'

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'commands', label: 'أوامر النظام', icon: <Terminal className="size-4" /> },
  { key: 'links', label: 'روابط سريعة', icon: <Link2 className="size-4" /> },
  { key: 'snippets', label: 'مقتطفات الكود', icon: <Code2 className="size-4" /> },
  { key: 'tools', label: 'مركز الأدوات', icon: <Wrench className="size-4" /> },
]

export function Dashboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [role, setRole] = useState<Role | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>('commands')
  const [data, setData] = useState<DataStore>(seedData)
  const [query, setQuery] = useState('')

  const [loginOpen, setLoginOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<EditingItem>(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  const isAdmin = role === 'admin'

  const q = query.trim().toLowerCase()
  const match = (...vals: string[]) =>
    !q || vals.some((v) => v.toLowerCase().includes(q))
  const filteredCommands = data.commands.filter((c) =>
    match(c.title, c.description, c.script, c.shell),
  )
  const filteredLinks = data.links.filter((l) =>
    match(l.title, l.description, l.url, l.category),
  )
  const filteredSnippets = data.snippets.filter((s) =>
    match(s.title, s.language, s.filename, s.code),
  )

  function openCreate() {
    setEditing(null)
    setCreateOpen(true)
  }

  function saveCommand(item: CommandItem) {
    setData((d) => ({
      ...d,
      commands: upsert(d.commands, item),
    }))
  }
  function saveLink(item: LinkItem) {
    setData((d) => ({ ...d, links: upsert(d.links, item) }))
  }
  function saveSnippet(item: SnippetItem) {
    setData((d) => ({ ...d, snippets: upsert(d.snippets, item) }))
  }

  function del(key: keyof DataStore, id: string) {
    setData((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== id) }))
  }

  return (
    <div className="marble-bg min-h-screen">
      <div className="min-h-screen bg-background/40">
        <div className="mx-auto max-w-7xl space-y-4 p-3 sm:p-5">
          <SiteHeader
            role={role}
            username={username}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            onOpenLogin={() => setLoginOpen(true)}
            onLogout={() => {
              setRole(null)
              setUsername(null)
            }}
          />

          {/* Main work area */}
          <main className="glass rounded-3xl p-4 sm:p-6">
            {/* top row: title + create */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-gold text-2xl font-black">لوحة القيادة</h2>
                <p className="text-sm text-muted-foreground">
                  {isAdmin
                    ? 'وضع المشرف — تحكم كامل بالإنشاء والتعديل والحذف'
                    : 'تصفّح وانسخ واستخدم كل الأدوات مباشرة'}
                </p>
              </div>

              {isAdmin ? (
                <button
                  type="button"
                  onClick={openCreate}
                  disabled={tab === 'tools'}
                  className="gold-fill flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg transition-all hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-4" />
                  إنشاء
                </button>
              ) : null}
            </div>

            {/* search bar */}
            <div className="mb-5">
              <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5">
                <Search className="size-4 shrink-0 text-gold" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث في الأوامر والروابط والمقتطفات…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  aria-label="بحث"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="مسح البحث"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* tabs */}
            <div
              role="tablist"
              className="mb-6 flex flex-wrap gap-1.5 rounded-2xl border border-border bg-muted/30 p-1.5"
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={
                    'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ' +
                    (tab === t.key
                      ? 'gold-fill shadow-md'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* panels */}
            {tab === 'commands' ? (
              <CommandsPanel
                items={filteredCommands}
                role={role}
                onEdit={(item) => {
                  setEditing({ kind: 'commands', item })
                  setCreateOpen(true)
                }}
                onDelete={(id) => del('commands', id)}
              />
            ) : null}

            {tab === 'links' ? (
              <LinksPanel
                items={filteredLinks}
                role={role}
                onEdit={(item) => {
                  setEditing({ kind: 'links', item })
                  setCreateOpen(true)
                }}
                onDelete={(id) => del('links', id)}
              />
            ) : null}

            {tab === 'snippets' ? (
              <SnippetsPanel
                items={filteredSnippets}
                role={role}
                onEdit={(item) => {
                  setEditing({ kind: 'snippets', item })
                  setCreateOpen(true)
                }}
                onDelete={(id) => del('snippets', id)}
              />
            ) : null}

            {tab === 'tools' ? <ToolsPanel /> : null}
          </main>

          <footer className="pb-2 text-center text-xs text-muted-foreground">
            HULGUUL — مركز القيادة التقني · تصميم رخامي ذهبي فاخر
          </footer>
        </div>
      </div>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(r, u) => {
          setRole(r)
          setUsername(u)
        }}
      />

      <CreateDialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setEditing(null)
        }}
        tab={tab}
        editing={editing}
        onSaveCommand={saveCommand}
        onSaveLink={saveLink}
        onSaveSnippet={saveSnippet}
      />

      <Toaster />
    </div>
  )
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id)
  if (idx === -1) return [item, ...list]
  const next = [...list]
  next[idx] = item
  return next
}
