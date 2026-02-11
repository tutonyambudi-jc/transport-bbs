import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updateAdmin() {
  console.log('🔄 Mise à jour du compte administrateur...')

  // Mettre à jour l'ancien admin s'il existe
  const oldAdmin = await prisma.user.findUnique({ where: { email: 'admin@aigleroyale.com' } })
  if (oldAdmin) {
    const newPassword = await bcrypt.hash('Nop@55w0rd', 10)
    await prisma.user.update({
      where: { email: 'admin@aigleroyale.com' },
      data: {
        email: 'tnyambudi@gmail.com',
        password: newPassword,
      },
    })
    console.log('✅ Compte admin mis à jour')
    console.log('📧 Email: tnyambudi@gmail.com')
    console.log('🔑 Mot de passe: Nop@55w0rd')
    return
  }

  // Créer le nouveau compte admin s'il n'existe pas
  const newPassword = await bcrypt.hash('Nop@55w0rd', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'tnyambudi@gmail.com',
      password: newPassword,
      firstName: 'Admin',
      lastName: 'Aigle Royale',
      role: 'ADMINISTRATOR',
      referralCode: 'AR-ADMIN-0001',
      loyaltyPoints: 0,
      loyaltyTier: 'BRONZE',
    },
  })

  console.log('✅ Nouveau compte admin créé:', admin.email)
  console.log('📧 Email: tnyambudi@gmail.com')
  console.log('🔑 Mot de passe: Nop@55w0rd')
}

updateAdmin()
  .then(() => {
    console.log('✅ Terminé!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
