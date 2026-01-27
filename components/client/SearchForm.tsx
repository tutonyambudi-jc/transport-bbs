'use client'

import { useState, useEffect } from 'react'
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
  const [isSearching, setIsSearching] = useState(false)
  const [weeklyAvailability, setWeeklyAvailability] = useState<Array<{ date: string, count: number }>>([])
  const [weeklyReturnAvailability, setWeeklyReturnAvailability] = useState<Array<{ date: string, count: number }>>([])
  const [hasSearchedAvailability, setHasSearchedAvailability] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (origin && destination && date) {
      setIsSearching(true)
      const params = new URLSearchParams({
        origin: origin,
        destination: destination,
        date: date,
        tripType: tripType as string,
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
    if (origin && destination && date) {
      fetchAvailability()
    }
  }, [origin, destination, date, returnDate, tripType])

  if (tripType === 'rental') {
    return (
      <div className="space-y-6">
        <div className="flex gap-3 p-1.5 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 text-gray-500 hover:text-gray-700`}
          >
            Aller simple
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 text-gray-500 hover:text-gray-700`}
          >
            Aller-retour
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 bg-white text-gray-900 shadow-lg"
          >
            Location
          </button>
        </div>
        <BusRentalForm />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Trip Type Toggle - Premium Style */}
      <div className="flex gap-3 p-1.5 bg-gray-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${(tripType as any) === 'one-way'
            ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Aller simple
        </button>
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${(tripType as any) === 'round-trip'
            ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Aller-retour
        </button>
        <button
          type="button"
          onClick={() => setTripType('rental')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${(tripType as any) === 'rental'
            ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Location
        </button>
      </div>

      {/* Cities Row with Swap Button */}
      <div className="relative grid md:grid-cols-2 gap-4">
        {/* Origin */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            <span className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-primary-600"></span>
            </span>
            Départ
          </label>
          <div className="relative">
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ville de départ"
              className="w-full px-5 py-3 bg-white/50 border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium backdrop-blur-sm"
              required
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={swapCities}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1 z-10 w-12 h-12 bg-white border-2 border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 hover:shadow-xl transition-all duration-300 group hidden md:flex"
          title="Inverser"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Destination */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </span>
            Arrivée
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ville d'arrivée"
              className="w-full px-5 py-3 bg-white/50 border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium backdrop-blur-sm"
              required
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Availability Carousel (Client) */}
      {origin && destination && (
        <div className="space-y-6">
          {/* Outbound Carousel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Disponibilités Aller</span>
              {!hasSearchedAvailability && (
                <button
                  type="button"
                  onClick={fetchAvailability}
                  className="text-[10px] font-bold text-primary-600 hover:text-primary-700 underline"
                >
                  Vérifier les dates
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(hasSearchedAvailability ? weeklyAvailability : Array.from({ length: 7 }, (_, i) => {
                const d = new Date(date)
                d.setDate(d.getDate() + i)
                return { date: format(d, 'yyyy-MM-dd'), count: -1 }
              })).map((item) => {
                const isSelected = item.date === date;
                const d = new Date(item.date);
                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => {
                      setDate(item.date);
                      if (!hasSearchedAvailability) fetchAvailability();
                    }}
                    className={`flex-shrink-0 flex flex-col items-center min-w-[80px] p-3 rounded-2xl border-2 transition-all ${isSelected
                      ? 'bg-primary-600 border-primary-600 text-white shadow-xl scale-105'
                      : 'bg-white/50 backdrop-blur-sm border-white/20 text-gray-500 hover:border-primary-200'
                      }`}
                  >
                    <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                      {format(d, 'EEE', { locale: fr })}
                    </span>
                    <span className="text-sm font-bold my-0.5">
                      {format(d, 'dd/MM')}
                    </span>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-white/90' : item.count > 0 ? 'text-primary-500' : 'text-gray-300'
                      }`}>
                      {item.count === -1 ? '...' : `${item.count} car(s)`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Return Carousel */}
          {tripType === 'round-trip' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Disponibilités Retour</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {(hasSearchedAvailability ? weeklyReturnAvailability : Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(returnDate)
                  d.setDate(d.getDate() + i)
                  return { date: format(d, 'yyyy-MM-dd'), count: -1 }
                })).map((item) => {
                  const isSelected = item.date === returnDate;
                  const d = new Date(item.date);
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => {
                        setReturnDate(item.date);
                        if (!hasSearchedAvailability) fetchAvailability();
                      }}
                      className={`flex-shrink-0 flex flex-col items-center min-w-[80px] p-3 rounded-2xl border-2 transition-all ${isSelected
                        ? 'bg-amber-600 border-amber-600 text-white shadow-xl scale-105'
                        : 'bg-white/50 backdrop-blur-sm border-white/20 text-gray-500 hover:border-amber-200'
                        }`}
                    >
                      <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                        {format(d, 'EEE', { locale: fr })}
                      </span>
                      <span className="text-sm font-bold my-0.5">
                        {format(d, 'dd/MM')}
                      </span>
                      <span className={`text-[9px] font-bold ${isSelected ? 'text-white/90' : item.count > 0 ? 'text-amber-500' : 'text-gray-300'
                        }`}>
                        {item.count === -1 ? '...' : `${item.count} car(s)`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dates Row */}
      <div className={`grid gap-4 ${tripType === 'round-trip' ? 'md:grid-cols-2' : ''}`}>
        {/* Departure Date */}
        <div className={`group ${tripType === 'one-way' ? 'md:col-span-1' : ''}`}>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Date d'aller
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 text-gray-900 font-medium text-lg cursor-pointer"
            required
          />
        </div>

        {/* Return Date */}
        {tripType === 'round-trip' && (
          <div className="group">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Date de retour
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={date || format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 text-gray-900 font-medium text-lg cursor-pointer"
              required
            />
          </div>
        )}
      </div>

      {/* Submit Button - Premium Style */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSearching}
          className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-600/30 hover:shadow-2xl hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isSearching ? (
              <>
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recherche...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rechercher
              </>
            )}
          </span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 pt-2 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Paiement sécurisé
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Confirmation instantanée
        </span>
      </div>
    </form>
  )
}
