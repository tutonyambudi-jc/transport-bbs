'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isAgentLogin = searchParams?.get('role') === 'agent'
  const isSuperAgentLogin = searchParams?.get('role') === 'super-agent'
  const isLogisticsLogin = searchParams?.get('role') === 'logistics'
  const callbackUrl = searchParams?.get('callbackUrl') || ''

  const safeCallbackUrl = (() => {
    // Only allow relative in-app redirects to avoid open-redirects
    if (!callbackUrl) return ''
    if (!callbackUrl.startsWith('/')) return ''
    if (callbackUrl.startsWith('//')) return ''
    if (callbackUrl.includes('://')) return ''
    return callbackUrl
  })()

  useEffect(() => {
    // Pré-remplir l'email en mode "Agent" (compte démo)
    if (isAgentLogin && !email) {
      setEmail('agent@demo.com')
    }
    if (isSuperAgentLogin && !email) {
      setEmail('superagent@demo.com')
    }
    if (isLogisticsLogin && !email) {
      setEmail('logistics@demo.com')
    }
  }, [isAgentLogin, isSuperAgentLogin, isLogisticsLogin, email])

  const redirectByRole = async () => {
    const session = await getSession()
    const role = session?.user?.role

    if (role === 'AGENT') {
      router.push('/agent')
    } else if (role === 'SUPER_AGENT') {
      router.push('/super-agent')
    } else if (role === 'LOGISTICS') {
      router.push('/logistics')
    } else if (role === 'ADMINISTRATOR' || role === 'SUPERVISOR') {
      router.push('/admin')
    } else if (role === 'AGENCY_STAFF') {
      router.push('/agency')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
        return
      }

      // If user came from a protected page (ex: booking), honor callbackUrl first
      if (safeCallbackUrl) {
        router.push(safeCallbackUrl)
        router.refresh()
        return
      }

      // Si l'utilisateur est sur le mode Agent, on force la redirection sur /agent
      if (isAgentLogin) {
        router.push('/agent')
        router.refresh()
      } else if (isSuperAgentLogin) {
        router.push('/super-agent')
        router.refresh()
      } else if (isLogisticsLogin) {
        router.push('/logistics')
        router.refresh()
      } else {
        await redirectByRole()
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAgentLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: 'agent@demo.com',
        password: 'demo123',
        redirect: false,
      })

      if (result?.error) {
        setError('Impossible de se connecter avec le compte démo')
        return
      }

      router.push('/agent')
      router.refresh()
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSuperAgentLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: 'superagent@demo.com',
        password: 'demo123',
        redirect: false,
      })

      if (result?.error) {
        setError('Impossible de se connecter avec le compte démo')
        return
      }

      router.push('/super-agent')
      router.refresh()
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogisticsLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: 'logistics@demo.com',
        password: 'demo123',
        redirect: false,
      })

      if (result?.error) {
        setError('Impossible de se connecter avec le compte démo')
        return
      }

      router.push('/logistics')
      router.refresh()
    } catch (err) {
      setError('Une erreur est survenue')
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

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-12 md:py-16 auth-sans">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden md:flex flex-col gap-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200/90">
              Aigle Royale
            </div>
            <h1 className="auth-serif text-4xl leading-tight text-white">
              Voyagez avec la precision d&apos;une compagnie royale
            </h1>
            <p className="text-sm text-slate-300/90">
              Billets, logistique et agences reunis dans une experience premium pour vos equipes.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-amber-200">24/7</div>
                <div className="text-xs text-slate-300">Support</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-amber-200">98%</div>
                <div className="text-xs text-slate-300">Satisfaction</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold text-amber-200">+120</div>
                <div className="text-xs text-slate-300">Itineraires</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/90 via-amber-400 to-amber-500 text-slate-900 font-semibold">
                    AR
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-amber-200/80">Espace securise</div>
                    <div className="auth-serif text-2xl">Connexion</div>
                  </div>
                </div>
              </div>
              {(isAgentLogin || isSuperAgentLogin || isLogisticsLogin) && (
                <span className="rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-xs text-amber-200">
                  {isAgentLogin ? 'Agent' : isSuperAgentLogin ? 'Super Agent' : 'Logistique'}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-slate-300">
              {isAgentLogin
                ? 'Accedez a votre espace de vente.'
                : isSuperAgentLogin
                  ? 'Gestion agence pour entreprise proprietaire.'
                  : isLogisticsLogin
                    ? 'Planning chauffeurs, dispatch et rotations.'
                    : 'Connectez-vous a votre compte.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-950/60 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                  placeholder="vous@aigleroyale.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Mot de passe
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs text-amber-200/90 hover:text-amber-200">
                    Mot de passe oublie ?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-amber-200 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="relative z-10">{loading ? 'Connexion...' : 'Se connecter'}</span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer"></span>
              </button>

              {isAgentLogin && (
                <button
                  type="button"
                  onClick={handleDemoAgentLogin}
                  disabled={loading}
                  className="w-full rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/20 disabled:opacity-50"
                >
                  Connexion demo Agent (1 clic)
                </button>
              )}

              {isSuperAgentLogin && (
                <button
                  type="button"
                  onClick={handleDemoSuperAgentLogin}
                  disabled={loading}
                  className="w-full rounded-2xl border border-purple-300/30 bg-purple-300/10 px-4 py-3 text-sm font-semibold text-purple-100 transition hover:bg-purple-300/20 disabled:opacity-50"
                >
                  Connexion demo Super Agent (1 clic)
                </button>
              )}

              {isLogisticsLogin && (
                <button
                  type="button"
                  onClick={handleDemoLogisticsLogin}
                  disabled={loading}
                  className="w-full rounded-2xl border border-orange-300/30 bg-orange-300/10 px-4 py-3 text-sm font-semibold text-orange-100 transition hover:bg-orange-300/20 disabled:opacity-50"
                >
                  Connexion demo Logistique (1 clic)
                </button>
              )}
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className="text-amber-200/90 hover:text-amber-200">
                Inscrivez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#05060a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-300"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
