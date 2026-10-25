import React, { useState, useEffect } from 'react';
import {
  Tag,
  Clock,
  MapPin,
  CheckCircle,
  ShoppingBag,
  AlertCircle,
  Building
} from 'lucide-react';
import { ClearanceDeal } from '../../types';
import { DOMINICAN_PROVINCES } from '../../constants/provinces';

export const UltimaOfertaModule: React.FC = () => {
  const [deals, setDeals] = useState<ClearanceDeal[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/modules/ultimaoferta/deals')
      .then(res => res.json())
      .then(d => setDeals(d.deals || []))
      .catch(console.error);
  }, []);

  const handleReserve = async (dealId: string) => {
    try {
      const res = await fetch(`/api/modules/ultimaoferta/deals/${dealId}/reserve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setDeals(deals.map(d => (d.id === dealId ? data.deal : d)));
        setReservationMessage(`¡Reserva confirmada! Muestra tu código de reserva [RES-${Date.now().toString().slice(-5)}] al retirar en el establecimiento.`);
        setTimeout(() => setReservationMessage(null), 6000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (selectedProvince === 'Todas') return true;
    return deal.location.toLowerCase().includes(selectedProvince.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ÚltimaOferta — Excedentes en las 32 Provincias de RD</h2>
              <p className="text-xs text-slate-400">
                Productos rebajados, panaderías y alimentos con recogida rápida en República Dominicana
              </p>
            </div>
          </div>

          <select
            value={selectedProvince}
            onChange={e => setSelectedProvince(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-2xl px-4 py-2.5 text-white outline-none font-semibold min-w-[220px]"
          >
            <option value="Todas">🇩🇴 Todas las Provincias</option>
            {DOMINICAN_PROVINCES.map(prov => (
              <option key={prov.id} value={prov.name}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {reservationMessage && (
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{reservationMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map(deal => (
          <div
            key={deal.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  -{deal.discountPercentage}% OFF
                </span>
                <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Quedan {deal.expiresInHours}h</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{deal.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{deal.store}</span>
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{deal.location}</span>
                </p>
              </div>

              {/* Price comparison */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 line-through block">
                    Precio antes: RD$ {deal.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    RD$ {deal.discountPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Disponibles:</span>
                  <span className="text-xs font-bold text-white">{deal.stockRemaining} unidades</span>
                </div>
              </div>

              <div className="text-[11px] text-indigo-300 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Horario de recogida: {deal.pickupWindow}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              {deal.reserved ? (
                <div className="w-full py-2.5 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  ✓ Reservado por ti
                </div>
              ) : (
                <button
                  onClick={() => handleReserve(deal.id)}
                  disabled={deal.stockRemaining <= 0}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {deal.stockRemaining > 0 ? 'Reservar Oferta sin Pago Previo' : 'Oferta Agotada'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
