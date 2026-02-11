'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DisplayCurrency } from '@/lib/utils'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function getPreferredCurrency(): DisplayCurrency {
  try {
    const ls = window.localStorage.getItem('ar_currency')
    if (ls === 'USD' || ls === 'FC') return ls
  } catch { }
  const c = getCookie('ar_currency')
  if (c === 'USD' || c === 'FC') return c
  return 'FC'
}

function persistCurrency(cur: DisplayCurrency) {
  try {
    window.localStorage.setItem('ar_currency', cur)
  } catch { }
  // Cookie non HttpOnly pour être lisible côté client; permet aussi de persister entre pages
  document.cookie = `ar_currency=${encodeURIComponent(cur)}; Path=/; Max-Age=31536000; SameSite=Lax`
}

export function CurrencySelector() {
  const router = useRouter()
  const [currency, setCurrency] = useState<DisplayCurrency>('FC')

  useEffect(() => {
    setCurrency(getPreferredCurrency())
  }, [])

  return (
    <select
      value={currency}
      onChange={(e) => {
        const next = (e.target.value === 'USD' ? 'USD' : 'FC') as DisplayCurrency
        setCurrency(next)
        persistCurrency(next)
        router.refresh()
        window.location.reload()
      }}
      className="hidden md:block px-4 py-2 border-2 border-yellow-400 rounded-2xl text-base font-bold text-yellow-300 bg-gradient-to-br from-black via-gray-900 to-gray-800 shadow-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 outline-none hover:border-yellow-300 hover:bg-gray-900/80"
      aria-label="Sélecteur de monnaie"
      title="Monnaie"
      style={{ minWidth: 90, letterSpacing: 1 }}
    >
      <option value="FC" className="bg-black text-yellow-300 font-bold">FC</option>
      <option value="USD" className="bg-black text-yellow-300 font-bold">USD</option>
    </select>
  )
}

