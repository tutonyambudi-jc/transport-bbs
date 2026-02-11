import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-amber-200/10 bg-[#05060a] text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_10%_20%,rgba(245,158,11,0.08),transparent_60%),radial-gradient(500px_circle_at_90%_80%,rgba(59,130,246,0.08),transparent_60%)]"></div>
      <div className="relative container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/90 via-amber-400 to-amber-500 text-slate-900 font-semibold">
                AR
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-amber-200/80">Aigle Royale</div>
                <div className="auth-serif text-xl text-white">Transport Premium</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Votre compagnie de transport premium depuis 2003.
            </p>
          </div>

          <div>
            <h4 className="auth-serif text-lg text-white">Liens utiles</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-amber-200">A propos</Link></li>
              <li><Link href="/contact" className="hover:text-amber-200">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-amber-200">FAQ</Link></li>
              <li><Link href="/partners" className="hover:text-amber-200">Partenaires</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="auth-serif text-lg text-white">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/trips/search" className="hover:text-amber-200">Nos trajets</Link></li>
              <li><Link href="/freight" className="hover:text-amber-200">Transport de colis</Link></li>
              <li><Link href="/calculateur-bagages" className="hover:text-amber-200">Calculateur de bagages</Link></li>
              <li><Link href="/services" className="hover:text-amber-200">Services a bord</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="auth-serif text-lg text-white">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>contact@aigleroyale.com</li>
              <li>+243 85 469 3378</li>
              <li>Kinshasa, RDC</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          &copy; 2024 Aigle Royale. Tous droits reserves.
        </div>
      </div>
    </footer>
  )
}
