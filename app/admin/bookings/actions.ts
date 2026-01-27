'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function validateBooking(bookingId: string) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== 'ADMINISTRATOR' && session.user.role !== 'SUPERVISOR')) {
    return { error: 'Non autorisé' }
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        // Si c'est validé par admin, on pourrait vouloir noter qui l'a fait, 
        // mais le modèle actuel n'a pas de champ "validatedBy" explicite à part agencyStaffId/agentId si c'est une vente.
        // On laisse comme ça pour l'instant.
      },
    })

    revalidatePath('/admin/bookings')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to validate booking:', error)
    return { error: 'Erreur lors de la validation' }
  }
}

export async function cancelBooking(bookingId: string, reason?: string) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== 'ADMINISTRATOR' && session.user.role !== 'SUPERVISOR')) {
    return { error: 'Non autorisé' }
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason || 'Annulée par l\'administration'
      },
    })

    revalidatePath('/admin/bookings')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    return { error: 'Erreur lors de l\'annulation' }
  }
}
