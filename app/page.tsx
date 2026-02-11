import Link from 'next/link'
import { SearchForm } from '@/components/client/SearchForm'
import { AdvertisementBanner } from '@/components/advertisements/AdvertisementBanner'
import { Navigation } from '@/components/layout/Navigation'
import { BestDestinationsModule } from '@/components/client/BestDestinationsModule'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(245,158,11,0.18),transparent_60%),radial-gradient(900px_circle_at_90%_80%,rgba(59,130,246,0.18),transparent_60%),linear-gradient(180deg,#05060a_0%,#0b1020_55%,#0f172a_100%)] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      <Navigation />

      <main className="relative z-10">
        <section className="pt-28 md:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200/90">
                  Voyage premium
                </div>
                <h1 className="auth-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
                  Voyagez en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500">excellence</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-xl">
                  Confort premium, securite absolue et service irreprochable pour chaque depart.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#search" className="rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-slate-900">
                    Reserver un trajet
                  </Link>
                  <Link href="/services" className="rounded-full border border-amber-200/30 px-6 py-3 text-sm font-semibold text-amber-200 hover:bg-white/5">
                    Voir les services
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6">
                  {[
                    { label: 'Satisfaction', value: '98%' },
                    { label: 'Itineraires', value: '+120' },
                    { label: 'Support', value: '24/7' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-2xl font-semibold text-amber-200">{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="search" className="rounded-3xl border border-amber-200/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 text-xs uppercase tracking-[0.25em] text-amber-200/80">Recherche rapide</div>
                <SearchForm />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl">
            <AdvertisementBanner
              type="BANNER_HOMEPAGE"
              reserveHeight
              showPlaceholder
              heightClassName="h-32 sm:h-40 md:h-48"
            />
          </div>
        </section>

        <section className="container mx-auto px-6 pb-16">
          <div className="text-center mb-10">
            <h2 className="auth-serif text-3xl sm:text-4xl">Nos offres exclusives</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Des tarifs avantageux sans compromis sur le confort.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="absolute top-4 right-4 rounded-full bg-amber-200/10 px-3 py-1 text-xs text-amber-200">Populaire</div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Standard</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-white">5 000</span>
                <span className="text-sm text-slate-400">FC</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">Voyagez confortablement sur nos lignes principales a prix mini.</p>
              <Link href="/trips/search" className="mt-6 inline-flex w-full justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-white/15">
                Reserver
              </Link>
            </div>
            <div className="relative rounded-3xl border border-amber-200/30 bg-gradient-to-br from-amber-200/10 via-white/5 to-transparent p-6 shadow-xl">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-200">Premium</div>
              <div className="mt-3 text-3xl font-semibold text-white">VIP</div>
              <p className="mt-3 text-sm text-slate-300">Salons prives, snacks inclus, sieges extra-larges et Wi-Fi haut debit.</p>
              <Link href="/trips/search?class=vip" className="mt-6 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_-16px_rgba(251,191,36,0.8)]">
                Voir les offres VIP
              </Link>
            </div>
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200">Parrainage</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-white">+500</span>
                <span className="text-sm text-slate-400">FC / ami</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">Gagnez des credits de voyage pour chaque ami invite.</p>
              <Link href="/referral" className="mt-6 inline-flex w-full justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-white/15">
                Inviter un ami
              </Link>
            </div>
          </div>
        </section>

        <BestDestinationsModule />

        <section className="container mx-auto px-6 pb-20">
          <div className="text-center mb-10">
            <h2 className="auth-serif text-3xl sm:text-4xl">L&apos;experience Aigle Royale</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Une plateforme complete pour reserver, suivre et voyager en toute serenite.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Reservation simple', desc: 'Interface fluide, rapide et intuitive.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Paiement securise', desc: 'Mobile Money et carte bancaire securises.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { title: 'Service colis', desc: 'Suivi en temps reel de vos envois.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            ].map((f) => (
              <div key={f.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-200/10 text-amber-200">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
