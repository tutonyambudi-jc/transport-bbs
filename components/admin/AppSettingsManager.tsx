'use client'

import { useState, useEffect } from 'react'

type AppSetting = {
  id: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

export function AppSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({
    seatSelectionKey: 'id',
    maintenanceMode: 'false',
    bookingCancellationHours: '24',
    loyaltyPointsRate: '10',
    referralCommissionRate: '5',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const keys = Object.keys(settings)
      const promises = keys.map((key) =>
        fetch(`/api/admin/settings?key=${key}`)
          .then((r) => r.json())
          .catch(() => null)
      )

      const results = await Promise.all(promises)
      const newSettings: Record<string, string> = { ...settings }

      results.forEach((data, i) => {
        if (data && data.value) {
          newSettings[keys[i]] = data.value
        }
      })

      setSettings(newSettings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  async function saveSetting(key: string, value: string) {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })

      if (!res.ok) throw new Error('Erreur de sauvegarde')

      setMessage({ type: 'success', text: 'Paramètre enregistré avec succès' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      )

      await Promise.all(promises)
      setMessage({ type: 'success', text: 'Tous les paramètres ont été enregistrés' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode maintenance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode maintenance</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode === 'true'}
              onChange={(e) =>
                setSettings({ ...settings, maintenanceMode: e.target.checked ? 'true' : 'false' })
              }
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Activer le mode maintenance (site inaccessible sauf admin)
            </span>
          </label>
        </div>
      </div>

      {/* Sièges */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sélection des sièges</h3>
        <div className="space-y-3">
          <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="seatSelectionKey"
              value="id"
              checked={settings.seatSelectionKey === 'id'}
              onChange={(e) => setSettings({ ...settings, seatSelectionKey: e.target.value })}
              className="w-4 h-4 text-primary-600"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">ID unique du siège</div>
              <div className="text-sm text-gray-600">Utilise l'identifiant interne (recommandé)</div>
            </div>
          </label>
          <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="seatSelectionKey"
              value="seatNumber"
              checked={settings.seatSelectionKey === 'seatNumber'}
              onChange={(e) => setSettings({ ...settings, seatSelectionKey: e.target.value })}
              className="w-4 h-4 text-primary-600"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Numéro de siège</div>
              <div className="text-sm text-gray-600">Utilise le numéro visible (ex: A1, B2)</div>
            </div>
          </label>
        </div>
      </div>

      {/* Réservations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de réservation</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Délai d'annulation (heures avant le départ)
          </label>
          <input
            type="number"
            min="0"
            value={settings.bookingCancellationHours}
            onChange={(e) => setSettings({ ...settings, bookingCancellationHours: e.target.value })}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-600 mt-1">
            Les clients peuvent annuler jusqu&apos;à X heures avant le départ
          </p>
        </div>
      </div>

      {/* Programme de fidélité */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Programme de fidélité</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points de fidélité par 1000 FC dépensés
            </label>
            <input
              type="number"
              min="0"
              value={settings.loyaltyPointsRate}
              onChange={(e) => setSettings({ ...settings, loyaltyPointsRate: e.target.value })}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission de parrainage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.referralCommissionRate}
              onChange={(e) => setSettings({ ...settings, referralCommissionRate: e.target.value })}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer tous les paramètres'}
        </button>
      </div>
    </form>
  )
}
