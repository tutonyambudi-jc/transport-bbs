
export type EmailOptions = {
    to: string
    subject: string
    html: string
    text?: string
}

export type SMSOptions = {
    to: string
    message: string
}

/**
 * Mock Notification Service
 * In production, replace console.log with actual providers (SendGrid, Twilio, etc.)
 */
export const NotificationService = {
    sendEmail: async ({ to, subject, html }: EmailOptions) => {
        console.log(`
      [MOCK EMAIL]
      To: ${to}
      Subject: ${subject}
      Body: ${html.substring(0, 50)}...
      -----------------------------
    `)
        // Simulation of API delay
        await new Promise((resolve) => setTimeout(resolve, 100))
        return { success: true }
    },

    sendSMS: async ({ to, message }: SMSOptions) => {
        console.log(`
      [MOCK SMS]
      To: ${to}
      Message: ${message}
      -----------------------------
    `)
        await new Promise((resolve) => setTimeout(resolve, 100))
        return { success: true }
    },

    /**
     * Helper to format generic templates
     */
    templates: {
        bookingConfirmation: (booking: any, ticketNumber: string) => {
            return {
                subject: `Confirmation réservation - Ticket #${ticketNumber}`,
                html: `<p>Bonjour ${booking.passengerName},</p>
               <p>Votre réservation pour le trajet vers ${booking.trip?.route?.destination} est confirmée.</p>
               <p><strong>Ticket:</strong> ${ticketNumber}</p>
               <p>Veuillez procéder au paiement pour valider votre place.</p>`,
                sms: `Aigle Royal: Réservation confirmée Ticket #${ticketNumber}. Payez pour valider.`,
            }
        },
        paymentConfirmation: (booking: any, ticketNumber: string) => {
            return {
                subject: `Billet Confirmé - Ticket #${ticketNumber}`,
                html: `<p>Paiement reçu !</p>
               <p>Votre billet #${ticketNumber} est validé.</p>
               <p>Bon voyage avec Aigle Royal.</p>`,
                sms: `Aigle Royal: Paiement reçu. Billet #${ticketNumber} validé. Bon voyage !`,
            }
        },
        tripDelay: (trip: any, delayInfo: string) => {
            return {
                subject: `Information importante : Retard sur votre voyage`,
                html: `<p>Votre bus prévu pour ${new Date(trip.departureTime).toLocaleString('fr-FR')} a du retard.</p>
               <p>Info: ${delayInfo}</p>`,
                sms: `Aigle Royal: Retard sur votre bus de ${new Date(trip.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}. Info: ${delayInfo}`,
            }
        }
    }
}
