'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referralCode: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Pré-remplir le code parrain depuis ?ref=XXXX
  useEffect(() => {
    const ref = searchParams?.get('ref')
    if (ref && ref.trim() && !formData.referralCode) {
      setFormData((prev) => ({ ...prev, referralCode: ref.trim().toUpperCase() }))
    }
  }, [searchParams, formData.referralCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          referralCode: formData.referralCode,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        setLoading(false)
        return
      }

      router.push('/auth/login?registered=true')
    } catch (err) {
      setError('Une erreur est survenue')
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

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-12 md:py-16 auth-sans">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden md:flex flex-col gap-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200/90">
              Aigle Royale
            </div>
            <h1 className="auth-serif text-4xl leading-tight text-white">
              Un compte pour reserver vos trajets d&apos;exception
            </h1>
            <p className="text-sm text-slate-300/90">
              Acces aux meilleures offres, suivi logistique et programme de fidelite.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300/90">
              <div className="text-amber-200">Bonus d&apos;inscription</div>
              <div className="mt-1 text-xs">Cumulez des credits et miles a chaque voyage.</div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/90 via-amber-400 to-amber-500 text-slate-900 font-semibold">
                AR
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-amber-200/80">Creation de compte</div>
                <div className="auth-serif text-2xl">Inscription</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {error && (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-950/60 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Prenom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Telephone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                />
              </div>

              <div>
                <label htmlFor="referralCode" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Code parrainage
                </label>
                <input
                  type="text"
                  id="referralCode"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  placeholder="AR-ABCD-1A2B3C"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Entrez un code pour profiter d&apos;un bonus de bienvenue.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Mot de passe
                </label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-amber-200 focus:outline-none"
                  >
                    {showPassword ? (
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
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-amber-200 focus:outline-none"
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

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_-16px_rgba(251,191,36,0.8)] transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <span className="relative z-10">{loading ? 'Inscription...' : "S'inscrire"}</span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer"></span>
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Deja un compte ?{' '}
              <Link href="/auth/login" className="text-amber-200/90 hover:text-amber-200">
                Connectez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#05060a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-300"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
