'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [devLink, setDevLink] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setDevLink(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Si cet email existe, un lien de réinitialisation a été envoyé',
        })
        if (data.resetUrl) {
          setDevLink(data.resetUrl)
        }
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
              Recuperation
            </div>
            <h1 className="auth-serif text-4xl leading-tight text-white">
              Retrouver l&apos;acces en quelques instants
            </h1>
            <p className="text-sm text-slate-300/90">
              Nous envoyons un lien securise pour reinitialiser votre mot de passe.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300/90">
              Pour plus de securite, le lien expire rapidement.
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/90 via-amber-400 to-amber-500 text-slate-900 font-semibold">
                AR
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-amber-200/80">Mot de passe oublie</div>
                <div className="auth-serif text-2xl">Reinitialiser</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                  placeholder="vous@aigleroyale.com"
                />
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

              {devLink && (
                <div className="rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4">
                  <p className="text-xs font-semibold text-amber-200 mb-2">
                    Mode developpement - Lien de reset :
                  </p>
                  <a
                    href={devLink}
                    className="text-xs text-amber-200/90 hover:text-amber-200 break-all"
                  >
                    {devLink}
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_-16px_rgba(251,191,36,0.8)] transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <span className="relative z-10">{loading ? 'Envoi en cours...' : 'Envoyer le lien de reinitialisation'}</span>
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
