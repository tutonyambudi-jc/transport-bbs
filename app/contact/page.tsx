'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici vous pouvez ajouter la logique pour envoyer l'email
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <Navigation />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_10%,rgba(245,158,11,0.16),transparent_60%),radial-gradient(700px_circle_at_90%_80%,rgba(59,130,246,0.16),transparent_60%)]" />
        <div className="relative container mx-auto px-6 pt-28 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200/90">
              Contact
            </div>
            <h1 className="auth-serif text-4xl sm:text-5xl mt-5">Contactez-nous</h1>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
              Nous sommes la pour vous aider. Posez vos questions, nous repondons rapidement.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h2 className="auth-serif text-2xl mb-6">Envoyez-nous un message</h2>

              {submitted && (
                <div className="mb-6 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-emerald-100">
                  Merci pour votre message ! Nous vous repondrons rapidement.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Email *
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
                  <label htmlFor="subject" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  >
                    <option value="">Selectionnez un sujet</option>
                    <option value="reservation">Reservation</option>
                    <option value="annulation">Annulation</option>
                    <option value="reclamation">Reclamation</option>
                    <option value="fret">Transport de colis</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_-16px_rgba(251,191,36,0.8)]"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="auth-serif text-2xl mb-6">Nos coordonnees</h2>
                <div className="space-y-4 text-sm text-slate-300">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Adresse</div>
                    <p className="mt-2">Avenue Batoba, Commune de Mont Ngafula, Kinshasa, RDC</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Telephone</div>
                    <p className="mt-2">+243 85 469 3378</p>
                    <p className="text-xs text-slate-400">Lun - Dim: 6h00 - 22h00</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Email</div>
                    <p className="mt-2">contact@aigleroyale.com</p>
                    <p>support@aigleroyale.com</p>
                    <p>fret@aigleroyale.com</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="auth-serif text-xl mb-4">Horaires d&apos;ouverture</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="text-amber-200">6h00 - 22h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="text-amber-200">7h00 - 20h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-amber-200">8h00 - 18h00</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200/30 bg-amber-200/10 p-6">
                <h3 className="text-lg font-semibold text-amber-200">Besoin d&apos;aide urgente ?</h3>
                <p className="mt-2 text-sm text-slate-300">Notre service client est disponible 24/7.</p>
                <a
                  href="tel:+243854693378"
                  className="mt-4 inline-flex rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 px-5 py-2 text-sm font-semibold text-slate-900"
                >
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
