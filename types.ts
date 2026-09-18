export type Role = 'admin'

export type TabKey = 'commands' | 'links' | 'snippets' | 'tools'

export const CATEGORIES = [
  'أوامر النظام',
  'الصيانة والإصلاحات',
  'الأكواد والمقتطفات',
  'الشبكة والروابط',
] as const

export interface CommandItem {
  id: string
  title: string
  description: string
  script: string
  shell: 'cmd' | 'powershell'
}

export interface LinkItem {
  id: string
  title: string
  description: string
  url: string
  category: string
}

export interface SnippetItem {
  id: string
  title: string
  language: string
  filename: string
  code: string
}

export interface DataStore {
  commands: CommandItem[]
  links: LinkItem[]
  snippets: SnippetItem[]
}
