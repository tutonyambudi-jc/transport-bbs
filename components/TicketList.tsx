"use client"
import React from 'react'
import { TicketCard } from './TicketCard'
import { formatCurrency as formatCurrencyUtil, type DisplayCurrency } from '@/lib/utils'

interface TicketListProps {
  bookings: any[]
  currency: DisplayCurrency
}

export function TicketList({ bookings, currency }: TicketListProps) {
  const formatCurrency = (amount: number) => formatCurrencyUtil(amount, currency)

  return (
    <div className="space-y-3">
      {bookings.map((booking: any) => (
        <TicketCard key={booking.id} booking={booking} currency={currency} formatCurrency={formatCurrency} />
      ))}
    </div>
  )
}
