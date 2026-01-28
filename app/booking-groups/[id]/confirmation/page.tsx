import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatCurrency, type DisplayCurrency } from '@/lib/utils'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { AdvertisementBanner } from '@/components/advertisements/AdvertisementBanner'

export default async function BookingGroupConfirmationPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(`/booking-groups/${params.id}/confirmation`)}`)
  }

  const bookingGroup = await prisma.bookingGroup.findUnique({
    where: { id: params.id },
    include: {
      bookings: {
        include: {
          trip: {
            include: {
              route: true,
              bus: true,
            },
          },
          seat: true,
        },
      },
      payment: true,
    },
  })

  if (!bookingGroup) {
    notFound()
  }

  // Vérifier que l'utilisateur a le droit de voir cette confirmation
  if (bookingGroup.userId !== session.user.id && session.user.role !== 'ADMINISTRATOR') {
    notFound()
  }

  const cookieStore = await cookies()
  const currency = (cookieStore.get('preferred_currency')?.value as DisplayCurrency) || 'FC'

  const isPaid = bookingGroup.paymentStatus === 'PAID'

  // Group bookings by trip
  const tripGroups = bookingGroup.bookings.reduce((acc, booking) => {
    const tripId = booking.trip.id
    if (!acc[tripId]) {
      acc[tripId] = {
        trip: booking.trip,
        bookings: [],
      }
    }
    acc[tripId].bookings.push(booking)
    return acc
  }, {} as Record<string, { trip: any; bookings: any[] }>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {isPaid ? 'Réservation confirmée !' : 'Réservation enregistrée !'}
            </h1>
            <p className="text-lg text-gray-600">
              {isPaid 
                ? `Vos ${bookingGroup.bookings.length} billet${bookingGroup.bookings.length > 1 ? 's sont' : ' est'} confirmé${bookingGroup.bookings.length > 1 ? 's' : ''}.`
                : `Vos ${bookingGroup.bookings.length} billet${bookingGroup.bookings.length > 1 ? 's ont' : ' a'} été réservé${bookingGroup.bookings.length > 1 ? 's' : ''}. Vous devez effectuer le paiement en agence.`
              }
            </p>
          </div>

          {/* Payment Alert for CASH */}
          {!isPaid && bookingGroup.payment?.paymentDeadline && (
            <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">Paiement requis avant le {format(new Date(bookingGroup.payment.paymentDeadline), 'dd MMMM yyyy à HH:mm', { locale: fr })}</h3>
                  <p className="text-yellow-800">
                    Veuillez vous rendre en agence avec votre pièce d'identité pour effectuer le paiement de <span className="font-bold">{formatCurrency(bookingGroup.totalAmount, currency)}</span> et récupérer vos billets. Passé ce délai, votre réservation sera annulée.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de votre réservation</h2>
            
            {Object.values(tripGroups).map((group, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <div className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-2 border-primary-200 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {group.trip.route.origin} → {group.trip.route.destination}
                      </h3>
                      <p className="text-gray-700 font-semibold">
                        📅 {format(new Date(group.trip.departureTime), 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                      <p className="text-gray-600">
                        🚌 Bus: {group.trip.bus.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{group.bookings.length} passager{group.bookings.length > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>

                {/* Passenger List */}
                <div className="space-y-3">
                  {group.bookings.map((booking) => {
                    const typeLabel = booking.passengerType === 'ADULT' ? '👨‍💼 Adulte'
                      : booking.passengerType === 'CHILD' ? '👶 Enfant'
                      : booking.passengerType === 'INFANT' ? '🍼 Bébé'
                      : '👴 Senior'
                    
                    return (
                      <div key={booking.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">{booking.passengerName}</h4>
                            <p className="text-sm text-gray-600">{typeLabel}</p>
                          </div>
                          <div className="text-right">
                            <div className="px-3 py-1 bg-primary-600 text-white rounded-lg font-bold">
                              Siège {booking.seat.seatNumber}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="text-sm text-gray-600">
                            Billet: <span className="font-mono font-bold text-gray-900">{booking.ticketNumber}</span>
                          </div>
                          <div className="font-bold text-gray-900">
                            {formatCurrency(booking.totalPrice, currency)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="mt-8 pt-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-600 text-lg">Montant total</div>
                  <div className="text-sm text-gray-500">{bookingGroup.bookings.length} billet{bookingGroup.bookings.length > 1 ? 's' : ''}</div>
                </div>
                <div className="text-4xl font-black text-primary-600">
                  {formatCurrency(bookingGroup.totalAmount, currency)}
                </div>
              </div>
            </div>

            {isPaid && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-bold text-green-900">Paiement confirmé</div>
                    <div className="text-sm text-green-700">
                      {bookingGroup.payment?.paidAt && `Payé le ${format(new Date(bookingGroup.payment.paidAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advertisement */}
          <AdvertisementBanner type="BANNER_CONFIRMATION" />

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              Voir mes réservations
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Nouvelle recherche
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
