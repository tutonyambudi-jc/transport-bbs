'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type AuditLog = {
  id: string
  userId: string | null
  userEmail: string | null
  action: string
  resource: string | null
  resourceId: string | null
  details: string | null
  ipAddress: string | null
  userAgent: string | null
  status: string
  createdAt: string
}

export function LogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    userId: '',
  })

  useEffect(() => {
    fetchLogs()
  }, [page, filters])

  async function fetchLogs() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '50' })
      if (filters.action) params.set('action', filters.action)
      if (filters.resource) params.set('resource', filters.resource)
      if (filters.userId) params.set('userId', filters.userId)

      const res = await fetch(`/api/admin/logs?${params}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur de chargement')

      setLogs(data.logs || [])
      setTotal(data.pagination?.total || 0)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      PASSWORD_RESET_REQUESTED: 'Demande reset MDP',
      PASSWORD_RESET_COMPLETED: 'Reset MDP réussi',
      USER_LOGIN: 'Connexion',
      USER_LOGOUT: 'Déconnexion',
      USER_CREATED: 'Création utilisateur',
      USER_UPDATED: 'MAJ utilisateur',
      USER_DELETED: 'Suppression utilisateur',
      BOOKING_CREATED: 'Réservation créée',
      BOOKING_CANCELLED: 'Réservation annulée',
    }
    return labels[action] || action
  }

  const getStatusBadge = (status: string) => {
    if (status === 'SUCCESS') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Succès</span>
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Échec</span>
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <input
            type="text"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            placeholder="Ex: USER_LOGIN"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ressource</label>
          <input
            type="text"
            value={filters.resource}
            onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
            placeholder="Ex: User, Booking"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Utilisateur</label>
          <input
            type="text"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            placeholder="UUID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Utilisateur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ressource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucun log trouvé
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {getActionLabel(log.action)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.userEmail || log.userId || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.resource ? `${log.resource}${log.resourceId ? ` (${log.resourceId.slice(0, 8)}...)` : ''}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {log.ipAddress || '-'}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 50 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {page} - Total: {total} logs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={logs.length < 50}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
