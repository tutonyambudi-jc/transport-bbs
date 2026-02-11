import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token et nouveau mot de passe requis' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 })
    }

    // Vérifier le token
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetRequest) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 400 })
    }

    if (resetRequest.used) {
      return NextResponse.json({ error: 'Ce lien a déjà été utilisé' }, { status: 400 })
    }

    if (new Date() > resetRequest.expiresAt) {
      return NextResponse.json({ error: 'Ce lien a expiré. Veuillez faire une nouvelle demande' }, { status: 400 })
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: resetRequest.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Marquer le token comme utilisé
    await prisma.passwordReset.update({
      where: { id: resetRequest.id },
      data: { used: true },
    })

    // Log de l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'PASSWORD_RESET_COMPLETED',
        resource: 'User',
        resourceId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    )
  }
}
