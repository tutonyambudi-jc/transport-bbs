'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BusRentalForm } from './BusRentalForm'

export function SearchForm() {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'rental'>('one-way')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [returnDate, setReturnDate] = useState(format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'))
  const [passengerCounts, setPassengerCounts] = useState({
    adults: 1,
    children: 0,
    babies: 0,
    seniors: 0,
  })
  const [isSearching, setIsSearching] = useState(false)
  const [weeklyAvailability, setWeeklyAvailability] = useState<Array<{ date: string, count: number }>>([])
  const [weeklyReturnAvailability, setWeeklyReturnAvailability] = useState<Array<{ date: string, count: number }>>([])
  const [hasSearchedAvailability, setHasSearchedAvailability] = useState(false)
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false)
  const passengerDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalPassengers = passengerCounts.adults + passengerCounts.children + passengerCounts.babies + passengerCounts.seniors
    console.log('SearchForm handleSubmit - passengerCounts:', passengerCounts)
    console.log('SearchForm handleSubmit - totalPassengers:', totalPassengers)
    if (totalPassengers === 0) {
      alert('Veuillez sélectionner au moins un passager')
      return
    }
    if (origin && destination && date) {
      setIsSearching(true)
      const params = new URLSearchParams({
        origin: origin,
        destination: destination,
        date: date,
        tripType: tripType as string,
        adults: passengerCounts.adults.toString(),
        children: passengerCounts.children.toString(),
        babies: passengerCounts.babies.toString(),
        seniors: passengerCounts.seniors.toString(),
      })

      if (tripType === 'round-trip' && returnDate) {
        params.append('returnDate', returnDate)
      }

      router.push(`/trips/search?${params.toString()}`)
    }
  }

  const swapCities = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const fetchAvailability = async () => {
    if (!origin || !destination) return
    try {
      const response = await fetch(
        `/api/trips/availability?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&startDate=${date}&days=7`
      )
      const data = await response.json()
      setWeeklyAvailability(data)

      if (tripType === 'round-trip' && returnDate) {
        const retResponse = await fetch(
          `/api/trips/availability?origin=${encodeURIComponent(destination)}&destination=${encodeURIComponent(origin)}&startDate=${returnDate}&days=7`
        )
        const retData = await retResponse.json()
        setWeeklyReturnAvailability(retData)
      } else {
        setWeeklyReturnAvailability([])
      }
      setHasSearchedAvailability(true)
    } catch (err) {
      console.error('Error fetching availability:', err)
    }
  }

  // Trigger availability fetch when origin/destination change or trip type changes
  useEffect(() => {
    if (tripType !== 'rental' && origin && destination && date) {
      fetchAvailability()
    }
  }, [origin, destination, date, returnDate, tripType])

  const totalPassengers = passengerCounts.adults + passengerCounts.children + passengerCounts.babies + passengerCounts.seniors

  // Composant PassengerCounter - Design inline compact
  const PassengerCounter = ({ 
    label, 
    value, 
    onDecrement,
    onIncrement,
    color
  }: { 
    label: string
    value: number
    onDecrement: () => void
    onIncrement: () => void
    color: string
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value === 0}
          className={`w-5 h-5 rounded text-xs font-medium flex items-center justify-center transition-all ${
            value === 0 ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/10 text-slate-200 hover:bg-white/20'
          }`}
        >
          −
        </button>
        <span className={`w-5 text-center font-semibold text-sm ${color}`}>{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-5 h-5 rounded text-xs font-medium flex items-center justify-center bg-white/10 text-slate-200 hover:bg-white/20 transition-all"
        >
          +
        </button>
      </div>
    </div>
  )

  if (tripType === 'rental') {
    return (
      <div>
        {/* Trip Type Toggle */}
        <div className="flex gap-1 p-1 border border-white/10 bg-slate-950/60 rounded-full mb-6 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all text-slate-300 hover:text-white"
          >
            Aller simple
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all text-slate-300 hover:text-white"
          >
            Aller-retour
          </button>
          <button
            type="button"
            onClick={() => setTripType('rental')}
            className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 text-slate-900 shadow-lg"
          >
            Location
          </button>
        </div>
        <BusRentalForm />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Type Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 p-1 rounded-full border border-white/10 bg-slate-950/60">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`py-2 px-5 rounded-full text-sm font-medium transition-all duration-200 ${
              tripType === 'one-way'
                ? 'bg-amber-200/90 text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Aller simple
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`py-2 px-5 rounded-full text-sm font-medium transition-all duration-200 ${
              tripType === 'round-trip'
                ? 'bg-amber-200/90 text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Aller-retour
          </button>
          <button
            type="button"
            onClick={() => setTripType('rental')}
            className="py-2 px-5 rounded-full text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white"
          >
            Location
          </button>
        </div>
      </div>

      {/* Main Search Fields */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Origin & Destination Group */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="group p-4 h-24 flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Depart
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-amber-300 ring-4 ring-amber-300/20"></div>
                  </div>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ville de depart"
                    className="w-full pl-6 pr-3 py-2 bg-transparent border-0 focus:ring-0 text-white placeholder:text-slate-500 font-medium text-base"
                    required
                  />
                </div>
              </div>

              <div className="group p-4 h-24 flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Arrivee
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-blue-300 ring-4 ring-blue-300/20"></div>
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ville d'arrivee"
                    className="w-full pl-6 pr-3 py-2 bg-transparent border-0 focus:ring-0 text-white placeholder:text-slate-500 font-medium text-base"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={swapCities}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-slate-950/80 border border-white/10 rounded-full shadow-md flex items-center justify-center hover:border-amber-200/40 hover:shadow-lg transition-all duration-200 group hidden sm:flex"
              title="Inverser les villes"
            >
              <svg className="w-5 h-5 text-slate-300 group-hover:text-amber-200 group-hover:rotate-180 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* Date Fields */}
          <div className={tripType === 'round-trip' ? 'lg:col-span-4' : 'lg:col-span-4'}>
            <div className={`grid ${tripType === 'round-trip' ? 'grid-cols-2' : 'grid-cols-1'} divide-x divide-white/10`}>
              <div className="group p-4 h-24 flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Date de depart
                </label>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="flex-1 bg-transparent border-0 focus:ring-0 text-white font-medium text-base cursor-pointer"
                    required
                  />
                </div>
              </div>

              {tripType === 'round-trip' && (
                <div className="group p-4 h-24 flex flex-col justify-center">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Date de retour
                  </label>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={date || format(new Date(), 'yyyy-MM-dd')}
                      className="flex-1 bg-transparent border-0 focus:ring-0 text-white font-medium text-base cursor-pointer"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/60">
        <div className="lg:hidden" ref={passengerDropdownRef}>
          <button
            type="button"
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="w-full px-4 py-3.5 flex items-center justify-between tap-target"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-200">Passagers</span>
              <span className="px-2.5 py-0.5 bg-amber-200/20 text-amber-200 rounded-full text-sm font-bold">{totalPassengers}</span>
            </div>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${showPassengerDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showPassengerDropdown && (
            <div className="border-t border-white/10 px-4 py-3 space-y-3 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-300">Adultes</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, adults: Math.max(0, prev.adults - 1) }))}
                    disabled={passengerCounts.adults === 0}
                    className={`w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center transition-all tap-target ${
                      passengerCounts.adults === 0 ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/10 text-slate-200 hover:bg-white/20 active:scale-95'
                    }`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-amber-200">{passengerCounts.adults}</span>
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                    className="w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center bg-amber-300 text-slate-900 hover:opacity-90 active:scale-95 transition-all tap-target"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-300">Enfants (2-11 ans)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                    disabled={passengerCounts.children === 0}
                    className={`w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center transition-all tap-target ${
                      passengerCounts.children === 0 ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/10 text-slate-200 hover:bg-white/20 active:scale-95'
                    }`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-emerald-200">{passengerCounts.children}</span>
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, children: Math.min(10, prev.children + 1) }))}
                    className="w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center bg-emerald-300 text-slate-900 hover:opacity-90 active:scale-95 transition-all tap-target"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-300">Bebes (&lt; 2 ans)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, babies: Math.max(0, prev.babies - 1) }))}
                    disabled={passengerCounts.babies === 0}
                    className={`w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center transition-all tap-target ${
                      passengerCounts.babies === 0 ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/10 text-slate-200 hover:bg-white/20 active:scale-95'
                    }`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-rose-200">{passengerCounts.babies}</span>
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, babies: Math.min(10, prev.babies + 1) }))}
                    className="w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center bg-rose-300 text-slate-900 hover:opacity-90 active:scale-95 transition-all tap-target"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-300">Seniors (65+ ans)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, seniors: Math.max(0, prev.seniors - 1) }))}
                    disabled={passengerCounts.seniors === 0}
                    className={`w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center transition-all tap-target ${
                      passengerCounts.seniors === 0 ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/10 text-slate-200 hover:bg-white/20 active:scale-95'
                    }`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-blue-200">{passengerCounts.seniors}</span>
                  <button
                    type="button"
                    onClick={() => setPassengerCounts(prev => ({ ...prev, seniors: Math.min(10, prev.seniors + 1) }))}
                    className="w-9 h-9 rounded-lg text-lg font-medium flex items-center justify-center bg-blue-300 text-slate-900 hover:opacity-90 active:scale-95 transition-all tap-target"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block px-4 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-200">Passagers</span>
              <span className="px-2 py-0.5 bg-amber-200/20 text-amber-200 rounded-full text-xs font-bold">{totalPassengers}</span>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4">
              <PassengerCounter
                label="Adultes"
                value={passengerCounts.adults}
                onDecrement={() => setPassengerCounts(prev => ({ ...prev, adults: Math.max(0, prev.adults - 1) }))}
                onIncrement={() => setPassengerCounts(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                color="text-amber-200"
              />
              <PassengerCounter
                label="Enfants"
                value={passengerCounts.children}
                onDecrement={() => setPassengerCounts(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                onIncrement={() => setPassengerCounts(prev => ({ ...prev, children: Math.min(10, prev.children + 1) }))}
                color="text-emerald-200"
              />
              <PassengerCounter
                label="Bebes"
                value={passengerCounts.babies}
                onDecrement={() => setPassengerCounts(prev => ({ ...prev, babies: Math.max(0, prev.babies - 1) }))}
                onIncrement={() => setPassengerCounts(prev => ({ ...prev, babies: Math.min(10, prev.babies + 1) }))}
                color="text-rose-200"
              />
              <PassengerCounter
                label="Seniors"
                value={passengerCounts.seniors}
                onDecrement={() => setPassengerCounts(prev => ({ ...prev, seniors: Math.max(0, prev.seniors - 1) }))}
                onIncrement={() => setPassengerCounts(prev => ({ ...prev, seniors: Math.min(10, prev.seniors + 1) }))}
                color="text-blue-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Availability */}
      {origin && destination && (
        <div className="space-y-4">
          <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                Disponibilites Aller
              </span>
              {!hasSearchedAvailability && (
                <button
                  type="button"
                  onClick={fetchAvailability}
                  className="text-xs font-semibold text-amber-200 hover:text-amber-100"
                >
                  Actualiser
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(hasSearchedAvailability ? weeklyAvailability : Array.from({ length: 7 }, (_, i) => {
                const d = new Date(date)
                d.setDate(d.getDate() + i)
                return { date: format(d, 'yyyy-MM-dd'), count: -1 }
              })).map((item) => {
                const isSelected = item.date === date
                const d = new Date(item.date)
                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => {
                      setDate(item.date)
                      if (!hasSearchedAvailability) fetchAvailability()
                    }}
                    className={`flex-shrink-0 flex flex-col items-center min-w-[74px] py-2.5 px-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-300 text-slate-900 border-amber-300 shadow-lg shadow-amber-500/25 scale-105'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-200/50'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-900/70' : 'text-slate-500'}`}>
                      {format(d, 'EEE', { locale: fr })}
                    </span>
                    <span className="text-sm font-bold my-0.5">
                      {format(d, 'dd/MM')}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      isSelected ? 'text-slate-900/70' : item.count > 0 ? 'text-amber-200' : 'text-slate-500'
                    }`}>
                      {item.count === -1 ? '•••' : `${item.count} bus`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {tripType === 'round-trip' && (
            <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                  Disponibilites Retour
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {(hasSearchedAvailability ? weeklyReturnAvailability : Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(returnDate)
                  d.setDate(d.getDate() + i)
                  return { date: format(d, 'yyyy-MM-dd'), count: -1 }
                })).map((item) => {
                  const isSelected = item.date === returnDate
                  const d = new Date(item.date)
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => {
                        setReturnDate(item.date)
                        if (!hasSearchedAvailability) fetchAvailability()
                      }}
                      className={`flex-shrink-0 flex flex-col items-center min-w-[74px] py-2.5 px-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-300 text-slate-900 border-blue-300 shadow-lg shadow-blue-500/25 scale-105'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-blue-200/50'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-slate-900/70' : 'text-slate-500'}`}>
                        {format(d, 'EEE', { locale: fr })}
                      </span>
                      <span className="text-sm font-bold my-0.5">
                        {format(d, 'dd/MM')}
                      </span>
                      <span className={`text-[10px] font-semibold ${
                        isSelected ? 'text-slate-900/70' : item.count > 0 ? 'text-blue-200' : 'text-slate-500'
                      }`}>
                        {item.count === -1 ? '•••' : `${item.count} bus`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSearching}
        className="w-full relative overflow-hidden bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 text-slate-900 py-4 rounded-2xl font-bold text-base shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-[0.99] transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

        <span className="relative z-10 flex items-center justify-center gap-3">
          {isSearching ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Recherche en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rechercher des trajets
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
      </button>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-xs font-medium">Paiement securise</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-medium">Confirmation instantanee</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">Support 24/7</span>
        </div>
      </div>
    </form>
  )
}
