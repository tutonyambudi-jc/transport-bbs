'use client'

import { useState, useTransition } from 'react'
import { validateBooking, cancelBooking } from '@/app/admin/bookings/actions'
import { useRouter } from 'next/navigation'

interface BookingActionButtonsProps {
    bookingId: string
    status: string
}

export function BookingActionButtons({ bookingId, status }: BookingActionButtonsProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleValidate = async () => {
        if (!confirm('Voulez-vous vraiment valider cette réservation ?')) return

        startTransition(async () => {
            const result = await validateBooking(bookingId)
            if (result.error) {
                alert(result.error)
            } else {
                // Optionnel: feedback visuel
            }
        })
    }

    const handleCancel = async () => {
        const reason = prompt('Voulez-vous vraiment annuler cette réservation ? Si oui, précisez le motif pour le client :', 'Non-paiement dans les délais')
        if (reason === null) return // User cancelled the prompt

        startTransition(async () => {
            const result = await cancelBooking(bookingId, reason)
            if (result.error) {
                alert(result.error)
            }
        })
    }

    if (status === 'CONFIRMED') {
        return (
            <button
                onClick={handleCancel}
                disabled={isPending}
                className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
                {isPending ? '...' : 'Annuler'}
            </button>
        )
    }

    if (status === 'CANCELLED') {
        return <span className="text-xs text-gray-400">Annulé</span>
    }

    if (status === 'COMPLETED') {
        return <span className="text-xs text-green-600">Terminé</span>
    }

    // PENDING or other
    return (
        <div className="flex gap-2">
            <button
                onClick={handleValidate}
                disabled={isPending}
                className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
                {isPending ? '...' : 'Valider'}
            </button>
            <button
                onClick={handleCancel}
                disabled={isPending}
                className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
                {isPending ? '...' : 'Rejeter'}
            </button>
        </div>
    )
}
