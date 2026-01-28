'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [seatSelectionKey, setSeatSelectionKey] = useState<'id' | 'seatNumber'>('id')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings?key=seatSelectionKey')
      if (response.ok) {
        const data = await response.json()
        if (data && data.value) {
          setSeatSelectionKey(data.value as 'id' | 'seatNumber')
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'seatSelectionKey',
          value: seatSelectionKey
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès' })
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur serveur' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Paramètres du système</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de sélection des sièges
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choisissez comment les sièges sont identifiés lors de la réservation
              </p>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="seatSelectionKey"
                    value="id"
                    checked={seatSelectionKey === 'id'}
                    onChange={(e) => setSeatSelectionKey(e.target.value as 'id' | 'seatNumber')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">ID unique du siège</div>
                    <div className="text-sm text-gray-600">Utilise l'identifiant unique de chaque siège (recommandé)</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="seatSelectionKey"
                    value="seatNumber"
                    checked={seatSelectionKey === 'seatNumber'}
                    onChange={(e) => setSeatSelectionKey(e.target.value as 'id' | 'seatNumber')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Numéro de siège</div>
                    <div className="text-sm text-gray-600">Utilise le numéro visible du siège (ex: A1, B2)</div>
                  </div>
                </label>
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

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
