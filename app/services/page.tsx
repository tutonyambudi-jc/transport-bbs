import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <Navigation />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_10%,rgba(245,158,11,0.16),transparent_60%),radial-gradient(700px_circle_at_90%_80%,rgba(59,130,246,0.16),transparent_60%)]" />
        <div className="relative container mx-auto px-6 pt-28 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200/90">
              Services
            </div>
            <h1 className="auth-serif text-4xl sm:text-5xl mt-5">Des services concus pour votre confort</h1>
            <p className="mt-4 text-slate-300">
              Chaque trajet est pense pour offrir une experience premium, fluide et securisee.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Link href="/services/a-bord" className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80 mb-3">A bord</div>
              <div className="text-xl font-semibold text-white mb-2">Services a bord</div>
              <p className="text-sm text-slate-300">Confort, bagages, pauses, securite, informations et conseils.</p>
            </Link>

            <Link href="/services/mobilite-reduite" className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80 mb-3">Accessibilite</div>
              <div className="text-xl font-semibold text-white mb-2">Mobilite reduite</div>
              <p className="text-sm text-slate-300">Assistance et recommandations pour un voyage plus simple.</p>
            </Link>

            <Link href="/services/satisfaction" className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80 mb-3">Qualite</div>
              <div className="text-xl font-semibold text-white mb-2">Satisfaction clients</div>
              <p className="text-sm text-slate-300">Reclamations, suggestions, suivi et engagements qualite.</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

