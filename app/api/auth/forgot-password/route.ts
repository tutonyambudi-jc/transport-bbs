import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    // Toujours retourner succès pour éviter l'énumération d'emails
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      })
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 heure

    // Supprimer les anciens tokens pour cet email
    await prisma.passwordReset.deleteMany({ where: { email: email.toLowerCase() } })

    // Créer le nouveau token
    await prisma.passwordReset.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt,
      },
    })

    // Log de l'action
    await prisma.auditLog.create({
      data: {
        userEmail: email.toLowerCase(),
        action: 'PASSWORD_RESET_REQUESTED',
        resource: 'User',
        resourceId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    })

    // TODO: Envoyer un email avec le lien de reset
    // Pour l'instant, en dev, on retourne le token (À SUPPRIMER EN PROD)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
    
    console.log('🔑 Reset password link:', resetUrl)

    return NextResponse.json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      // En dev seulement:
      ...(process.env.NODE_ENV === 'development' && { resetUrl, token }),
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la demande de réinitialisation' },
      { status: 500 }
    )
  }
}
