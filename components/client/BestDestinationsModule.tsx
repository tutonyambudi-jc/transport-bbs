'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Connection = {
  origin: string
  destination: string
  trips: number
  nextDepartureTime: string | null
  fromPrice: number | null
}

type Destination = {
  destination: string
  totalTrips: number
  connections: Connection[]
}

type ApiResponse = {
  destinations: Destination[]
  error?: string
}

function buildSearchHref(origin: string, destination: string) {
  const params = new URLSearchParams({
    origin,
    destination,
    date: format(new Date(), 'yyyy-MM-dd'),
    tripType: 'one-way',
    adults: '1',
    children: '0',
    babies: '0',
    seniors: '0',
  })
  return `/trips/search?${params.toString()}`
}

export function BestDestinationsModule() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [openDestination, setOpenDestination] = useState<Destination | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setApiError(null)
        const res = await fetch('/api/destinations?take=6&connections=8', { cache: 'no-store' })
        const data = (await res.json()) as ApiResponse
        if (cancelled) return
        setDestinations(Array.isArray(data.destinations) ? data.destinations : [])
        setApiError(data.error || null)
      } catch (e) {
        if (cancelled) return
        setDestinations([])
        setApiError(e instanceof Error ? e.message : 'Erreur inconnue')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!openDestination) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDestination(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openDestination])

  const title = 'Meilleures destinations et liaisons par bus'

  const cards = useMemo(() => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse">
          <div className="h-5 w-32 bg-white/10 rounded mb-3" />
          <div className="h-4 w-48 bg-white/10 rounded" />
        </div>
      ))
    }

    if (destinations.length === 0) {
      return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="font-bold text-white">Aucune destination a afficher</div>
          <div className="text-sm text-slate-300 mt-1">
            {apiError ? `Details: ${apiError}` : "Ajoutez des trajets actifs pour voir les meilleures destinations."}
          </div>
        </div>
      )
    }

    return destinations.map((d) => (
      <button
        key={d.destination}
        type="button"
        onClick={() => setOpenDestination(d)}
        className="text-left bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-white">{d.destination}</div>
            <div className="text-sm text-slate-300 mt-1">{d.totalTrips} depart(s) disponibles</div>
          </div>
          <div className="text-xs font-bold text-amber-200 bg-amber-200/10 border border-amber-200/20 px-3 py-1 rounded-full whitespace-nowrap">
            Voir les liaisons
          </div>
        </div>
      </button>
    ))
  }, [apiError, destinations, loading])

  return (
    <section className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24 px-6 relative z-20">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="auth-serif text-2xl sm:text-3xl md:text-4xl text-white mb-3 sm:mb-4">{title}</h2>
        <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-amber-300 mx-auto rounded-full"></div>
        <p className="text-slate-300 mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg px-2">
          Selectionnez une destination pour afficher les liaisons disponibles.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">{cards}</div>

      {openDestination && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOpenDestination(null)}
            className="absolute inset-0 bg-black/50"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative mx-auto mt-24 w-[92vw] max-w-3xl bg-slate-950 rounded-2xl shadow-2xl border border-white/10"
          >
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-400">Destination</div>
                <div className="text-2xl font-extrabold text-white">{openDestination.destination}</div>
              </div>
              <button
                type="button"
                onClick={() => setOpenDestination(null)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold"
              >
                Fermer
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="text-sm text-slate-300 mb-4">
                Liaisons les plus frequentes vers {openDestination.destination}
              </div>

              <div className="space-y-3">
                {openDestination.connections.map((c, idx) => {
                  const next = c.nextDepartureTime ? new Date(c.nextDepartureTime) : null
                  return (
                    <div
                      key={`${c.origin}-${c.destination}-${idx}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/5 rounded-2xl p-4 border border-white/10"
                    >
                      <div>
                        <div className="font-bold text-white">
                          {c.origin} → {c.destination}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {c.trips} trajet(s)
                          {next ? ` • Prochain départ: ${format(next, 'dd MMM yyyy à HH:mm', { locale: fr })}` : ''}
                        </div>
                      </div>
                      <Link
                        href={buildSearchHref(c.origin, c.destination)}
                        className="inline-flex justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 text-slate-900 font-semibold"
                      >
                        Voir les trajets
                      </Link>
                    </div>
                  )
                })}
              </div>

              {openDestination.connections.length === 0 && (
                <div className="text-sm text-slate-300">Aucune liaison disponible.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
