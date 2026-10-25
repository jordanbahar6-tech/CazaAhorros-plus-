import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Star,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Clock,
  Filter,
  Send
} from 'lucide-react';
import { LocalBusiness } from '../../types';
import { DOMINICAN_PROVINCES } from '../../constants/provinces';

export const CercaRdModule: React.FC = () => {
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [selectedBiz, setSelectedBiz] = useState<LocalBusiness | null>(null);
  const [quoteService, setQuoteService] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/modules/cercard/businesses')
      .then(res => res.json())
      .then(d => setBusinesses(d.businesses || []))
      .catch(console.error);
  }, []);

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.sector.toLowerCase().includes(search.toLowerCase());
    const matchesProv =
      selectedProvince === 'Todas' ||
      b.city.toLowerCase().includes(selectedProvince.toLowerCase()) ||
      b.sector.toLowerCase().includes(selectedProvince.toLowerCase());
    return matchesSearch && matchesProv;
  });

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteService.trim()) return;
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedBiz(null);
      setQuoteService('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">CercaRD — Negocios y Técnicos en las 32 Provincias de RD</h2>
            <p className="text-xs text-slate-400">
              Directorio geolocalizado de plomeros, electricistas, técnicos y talleres en toda la República Dominicana
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar servicio (ej. Plomero, Aire Acondicionado, Electricista)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-white outline-none"
            />
          </div>
          <select
            value={selectedProvince}
            onChange={e => setSelectedProvince(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-2xl px-4 py-3 text-white outline-none font-semibold min-w-[260px]"
          >
            <option value="Todas">🇩🇴 Todas las 32 Provincias de RD</option>
            {DOMINICAN_PROVINCES.map(prov => (
              <option key={prov.id} value={prov.name}>
                {prov.name} ({prov.capital})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Businesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map(biz => (
          <div
            key={biz.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  {biz.category}
                </span>
                {biz.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verificado CazaAhorro</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white">{biz.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{biz.description}</p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{biz.rating}</span>
                  <span className="text-slate-500 font-normal">({biz.reviewsCount} reseñas)</span>
                </div>
                <span>•</span>
                <span className="text-slate-400">{biz.priceRange}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{biz.sector}, {biz.city}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{biz.hours}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <a
                href={`https://wa.me/${biz.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => setSelectedBiz(biz)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition text-center"
              >
                Cotizar Online
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Modal */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Solicitar Cotización Formal</h3>
            <p className="text-xs text-slate-400">
              Para: <strong className="text-slate-200">{selectedBiz.name}</strong> ({selectedBiz.category})
            </p>

            {quoteSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center text-xs text-emerald-300 space-y-1">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="font-bold">¡Cotización Enviada con Éxito!</p>
                <p className="text-slate-400">El profesional se comunicará contigo vía WhatsApp o CazaAhorro.</p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">
                    Describe el trabajo o servicio requerido:
                  </label>
                  <textarea
                    rows={3}
                    value={quoteService}
                    onChange={e => setQuoteService(e.target.value)}
                    placeholder="Ej. Necesito mantenimiento de un aire inverter de 12,000 BTU en Piantini que no enfría bien..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBiz(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Solicitud</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
