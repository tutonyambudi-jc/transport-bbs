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

  if (tripType === 'rental') {
    return (
      <div>
        {/* Trip Type Toggle is still visible */}
        <div className="flex gap-2 p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-[1.5rem] border border-gray-200/50 shadow-inner mb-6">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={'flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-white/60'}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Aller simple
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={'flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-white/60'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Aller-retour
          </button>
          <button
            type="button"
            onClick={() => setTripType('rental')}
            className={'flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30 scale-[1.02]'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Location
          </button>
        </div>
        <BusRentalForm />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Trip Type Toggle - Redesigned with modern tabs */}
      <div className="flex gap-1 p-0.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border border-gray-200/50 shadow-inner">
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium text-xs transition-all duration-300 ${(tripType as any) === 'one-way'
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30 scale-[1.02]'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Aller simple
        </button>
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium text-xs transition-all duration-300 ${(tripType as any) === 'round-trip'
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30 scale-[1.02]'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Aller-retour
        </button>
        <button
          type="button"
          onClick={() => setTripType('rental')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium text-xs transition-all duration-300 ${(tripType as any) === 'rental'
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/30 scale-[1.02]'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Location
        </button>
      </div>

      {/* Cities Row with Swap Button - Redesigned */}
      <div className="relative">
        <div className="grid md:grid-cols-2 gap-2">
          {/* Origin */}
          <div className="group relative">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 ml-1">
              <div className="w-4 h-4 rounded-md bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              Ville de départ
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ex: Kinshasa"
                className="w-full pl-8 pr-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium text-sm hover:border-primary-300 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Destination */}
          <div className="group relative">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 ml-1">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              Ville d'arrivée
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Lubumbashi"
                className="w-full pl-8 pr-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium text-sm hover:border-amber-300 shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Swap Button - Enhanced design */}
        <button
          type="button"
          onClick={swapCities}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-0.5 z-10 w-7 h-7 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-md shadow-md flex items-center justify-center hover:scale-110 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group hidden md:flex"
          title="Inverser les villes"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
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

      {/* Dates Row - Redesigned */}
      <div className={`grid gap-4 ${tripType === 'round-trip' ? 'md:grid-cols-2' : ''}`}>
        {/* Departure Date */}
        <div className={`group ${tripType === 'one-way' ? 'md:col-span-1' : ''}`}>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 ml-1">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Date d'aller
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full pl-8 pr-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium text-sm cursor-pointer hover:border-indigo-300 shadow-sm"
              required
            />
          </div>
        </div>

        {/* Return Date */}
        {tripType === 'round-trip' && (
          <div className="group">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 ml-1">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Date de retour
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={date || format(new Date(), 'yyyy-MM-dd')}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-900 font-medium text-sm cursor-pointer hover:border-purple-300 shadow-sm"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Passengers and Ticket Type Row */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-[1.5rem] p-6 border-2 border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-base">Nombre de passagers</span>
          </label>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-white font-black text-lg">
              {passengerCounts.adults + passengerCounts.children + passengerCounts.babies + passengerCounts.seniors}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Adults */}
          <div className="group bg-white rounded-md p-1.5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-md bg-blue-100 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Adultes
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, adults: Math.max(0, prev.adults - 1) }))}
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg transition-all active:scale-95 hover:shadow-md"
              >
                −
              </button>
              <span className="flex-1 text-center font-black text-2xl text-gray-900">{passengerCounts.adults}</span>
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="group bg-white rounded-lg p-2 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Enfants
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg transition-all active:scale-95 hover:shadow-md"
              >
                −
              </button>
              <span className="flex-1 text-center font-bold text-lg text-gray-900">{passengerCounts.children}</span>
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, children: Math.min(10, prev.children + 1) }))}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Babies */}
          <div className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              Bébés
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, babies: Math.max(0, prev.babies - 1) }))}
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg transition-all active:scale-95 hover:shadow-md"
              >
                −
              </button>
              <span className="flex-1 text-center font-black text-2xl text-gray-900">{passengerCounts.babies}</span>
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, babies: Math.min(10, prev.babies + 1) }))}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Seniors */}
          <div className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              Seniors
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, seniors: Math.max(0, prev.seniors - 1) }))}
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg transition-all active:scale-95 hover:shadow-md"
              >
                −
              </button>
              <span className="flex-1 text-center font-black text-2xl text-gray-900">{passengerCounts.seniors}</span>
              <button
                type="button"
                onClick={() => setPassengerCounts(prev => ({ ...prev, seniors: Math.min(10, prev.seniors + 1) }))}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button - Premium Style */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={isSearching}
          className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-2 rounded-lg font-semibold text-sm shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:scale-[1.005] active:scale-[0.995] transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed border border-primary-500"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isSearching ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs">Recherche...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Rechercher des trajets</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>

      {/* Trust Badges - Enhanced */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-600">Paiement sécurisé</span>
        </div>
        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-600">Confirmation instantanée</span>
        </div>
      </div>
    </form>
  )
}
