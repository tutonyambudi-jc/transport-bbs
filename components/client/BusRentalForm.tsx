'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
    Calendar,
    Users,
    MapPin,
    Clock,
    Mail,
    Phone,
    User,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Bus,
    Star,
    MessageSquare
} from 'lucide-react'

type RentalType = 'FULL_DAY' | 'HALF_DAY'
type BusType = 'STANDARD' | 'VIP'

export function BusRentalForm() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        rentalType: 'FULL_DAY' as RentalType,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: '08:00',
        endTime: '18:00',
        departureLocation: '',
        destination: '',
        passengerCount: 1,
        preferredBusType: 'STANDARD' as BusType,
        specialRequests: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
    })

    const nextStep = () => setStep(s => Math.min(s + 1, 3))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (step < 3) {
            nextStep()
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/rentals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erreur lors de la soumission')
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-12 px-6 rounded-3xl border border-white/10 bg-slate-950/60 text-white animate-in fade-in zoom-in duration-500 shadow-xl">
                <div className="w-20 h-20 bg-amber-200/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
                    <CheckCircle2 className="w-10 h-10 text-amber-200" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Demande envoyee !</h3>
                <p className="text-slate-300 mb-8 max-w-sm mx-auto font-medium">
                    Nous avons bien recu votre demande. Un conseiller vous contactera tres bientot.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 text-slate-900 font-bold rounded-xl hover:opacity-90 transition-all"
                >
                    Fermer
                </button>
            </div>
        )
    }

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-amber-300' : 'w-2 bg-white/10'
                        }`}
                />
            ))}
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
            <StepIndicator />

            <div className="min-h-[320px]">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-400">
                        <div className="flex gap-3">
                            {(['FULL_DAY', 'HALF_DAY'] as RentalType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rentalType: type })}
                                    className={`flex-1 p-4 rounded-2xl border transition-all text-left group ${formData.rentalType === type
                                        ? 'border-amber-300/60 bg-amber-200/10'
                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${formData.rentalType === type ? 'bg-amber-300 text-slate-900' : 'bg-white/10 text-slate-400'
                                        }`}>
                                        {type === 'FULL_DAY' ? <Calendar className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                    <h4 className="font-bold text-sm text-white">
                                        {type === 'FULL_DAY' ? 'Journée' : 'Demi-journée'}
                                    </h4>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Passagers</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.passengerCount}
                                    onChange={(e) => setFormData({ ...formData, passengerCount: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categorie de car</label>
                            <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                                {(['STANDARD', 'VIP'] as BusType[]).map((bType) => (
                                    <button
                                        key={bType}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, preferredBusType: bType })}
                                        className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${formData.preferredBusType === bType
                                            ? 'bg-amber-200 text-slate-900 shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {bType === 'VIP' ? 'PREMIUM / VIP' : 'STANDARD'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-400">
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Depart</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Lieu de prise en charge"
                                        value={formData.departureLocation}
                                        onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Destination finale"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Heure debut</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Heure fin</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Besoins particuliers</label>
                            <textarea
                                placeholder="Optionnel..."
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-medium text-sm text-white placeholder:text-slate-500 min-h-[80px] resize-none"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-400">
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl space-y-3 border border-white/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Service</span>
                                <span className="font-black text-white">{formData.rentalType === 'FULL_DAY' ? 'Journee' : 'Demi-journee'} • {formData.preferredBusType}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Date</span>
                                <span className="font-black text-white">{format(new Date(formData.startDate), 'dd MMMM yyyy', { locale: fr })}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-wider">Trajet</span>
                                <span className="font-black text-white truncate max-w-[150px]">{formData.departureLocation} → {formData.destination}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nom complet"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    placeholder="Téléphone"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl focus:border-amber-300/60 outline-none font-semibold text-sm text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="p-3 bg-red-500/10 text-red-200 rounded-xl text-xs font-bold border border-red-500/30">⚠️ {error}</div>}

            <div className="flex gap-3 pt-4 border-t border-white/10">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 text-slate-900 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {step === 3 ? 'Confirmer la demande' : 'Continuer'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
