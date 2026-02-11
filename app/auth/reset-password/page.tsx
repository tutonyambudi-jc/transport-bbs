'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Token manquant. Veuillez utiliser le lien reçu par email.' })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Mot de passe réinitialisé avec succès ! Redirection...',
        })
        setTimeout(() => router.push('/auth/signin'), 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Une erreur est survenue' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(245,158,11,0.18),transparent_60%),radial-gradient(900px_circle_at_90%_80%,rgba(59,130,246,0.18),transparent_60%),linear-gradient(180deg,#05060a_0%,#0b1020_55%,#0f172a_100%)] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 md:py-16 auth-sans">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden md:flex flex-col gap-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200/90">
              Nouveau code
            </div>
            <h1 className="auth-serif text-4xl leading-tight text-white">
              Redefinir un mot de passe fort
            </h1>
            <p className="text-sm text-slate-300/90">
              Choisissez une nouvelle cle pour votre espace securise.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/90 via-amber-400 to-amber-500 text-slate-900 font-semibold">
                AR
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-amber-200/80">Nouveau mot de passe</div>
                <div className="auth-serif text-2xl">Reinitialiser</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Nouveau mot de passe
                </label>
                <div className="relative mt-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={!token}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30 disabled:opacity-60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-amber-200 focus:outline-none"
                    disabled={!token}
                  >
                    {showNewPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Confirmer
                </label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={!token}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30 disabled:opacity-60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-amber-200 focus:outline-none"
                    disabled={!token}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success'
                      ? 'border-emerald-400/30 bg-emerald-950/50 text-emerald-100'
                      : 'border-rose-400/30 bg-rose-950/60 text-rose-100'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_-16px_rgba(251,191,36,0.8)] transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <span className="relative z-10">{loading ? 'Reinitialisation...' : 'Reinitialiser le mot de passe'}</span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer"></span>
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <Link href="/auth/signin" className="text-amber-200/90 hover:text-amber-200">
                ← Retour a la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#05060a] text-amber-200">
        Chargement...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
