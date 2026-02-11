import { Navigation } from '@/components/layout/Navigation'
import { BaggageCalculator } from '@/components/client/BaggageCalculator'

export default function CalculateurBagagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <Navigation />

      <main className="pt-24">
        <div className="py-8 sm:py-10 lg:py-12">
          <BaggageCalculator />
        </div>
      </main>
    </div>
  )
}
