import type { DataStore } from './types'

export const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export const seedData: DataStore = {
  commands: [
    {
      id: uid(),
      title: 'عرض إعدادات الشبكة',
      description: 'عرض تفاصيل عنوان IP وإعدادات المحول الكاملة',
      script: 'ipconfig /all',
      shell: 'cmd',
    },
    {
      id: uid(),
      title: 'مسح ذاكرة DNS المؤقتة',
      description: 'حل مشاكل الاتصال بالمواقع عبر تفريغ ذاكرة DNS',
      script: 'ipconfig /flushdns',
      shell: 'cmd',
    },
    {
      id: uid(),
      title: 'قائمة العمليات النشطة',
      description: 'عرض جميع العمليات قيد التشغيل مرتبة حسب الذاكرة',
      script: 'Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 15',
      shell: 'powershell',
    },
    {
      id: uid(),
      title: 'فحص مساحة الأقراص',
      description: 'عرض المساحة الحرة والمستخدمة لكل قرص',
      script: 'Get-PSDrive -PSProvider FileSystem | Format-Table -AutoSize',
      shell: 'powershell',
    },
  ],
  links: [
    {
      id: uid(),
      title: 'Vercel',
      description: 'منصة النشر والاستضافة السحابية',
      url: 'https://vercel.com',
      category: 'الشبكة والروابط',
    },
    {
      id: uid(),
      title: 'GitHub',
      description: 'إدارة المستودعات والتحكم بالإصدارات',
      url: 'https://github.com',
      category: 'الأكواد والمقتطفات',
    },
    {
      id: uid(),
      title: 'MDN Web Docs',
      description: 'مرجع تقني شامل لتقنيات الويب',
      url: 'https://developer.mozilla.org',
      category: 'الأكواد والمقتطفات',
    },
    {
      id: uid(),
      title: 'Can I Use',
      description: 'دعم المتصفحات لميزات الويب',
      url: 'https://caniuse.com',
      category: 'الشبكة والروابط',
    },
  ],
  snippets: [
    {
      id: uid(),
      title: 'تهيئة عميل fetch بسيط',
      language: 'TypeScript',
      filename: 'client.ts',
      code: `export async function api<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Request failed: ' + res.status)
  return res.json() as Promise<T>
}`,
    },
    {
      id: uid(),
      title: 'دالة تأخير Debounce',
      language: 'JavaScript',
      filename: 'debounce.js',
      code: `function debounce(fn, delay = 300) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}`,
    },
  ],
}
