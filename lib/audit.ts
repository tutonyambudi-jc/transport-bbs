import { prisma } from '@/lib/prisma'

// Fonction helper pour créer un log d'audit (utilisable dans d'autres APIs)
export async function createAuditLog(data: {
    userId?: string
    userEmail?: string
    action: string
    resource?: string
    resourceId?: string
    details?: string
    ipAddress?: string
    userAgent?: string
    status?: string
}) {
    try {
        await prisma.auditLog.create({ data })
    } catch (error) {
        console.error('Failed to create audit log:', error)
    }
}
