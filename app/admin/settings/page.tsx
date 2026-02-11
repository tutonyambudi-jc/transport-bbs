'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UsersManager } from '@/components/admin/UsersManager'
import { LogsViewer } from '@/components/admin/LogsViewer'
import { AppSettingsManager } from '@/components/admin/AppSettingsManager'

type Tab = 'users' | 'logs' | 'settings'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('settings')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'settings', label: 'Réglages généraux', icon: '⚙️' },
    { id: 'users', label: 'Gestion utilisateurs', icon: '👥' },
    { id: 'logs', label: 'Logs système', icon: '📋' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p className="text-gray-600">
            Gérez les utilisateurs, visualisez les logs et configurez l&apos;application
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-800"
        >
          ← Retour admin
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="pb-12">
        {activeTab === 'settings' && <AppSettingsManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'logs' && <LogsViewer />}
      </div>
    </div>
  )
}
