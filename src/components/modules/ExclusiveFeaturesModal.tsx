import React, { useState } from 'react';
import {
  X,
  Target,
  Sparkles,
  TrendingDown,
  History,
  Shield,
  HelpCircle,
  Share2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const ExclusiveFeaturesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  featureName = 'radar',
}) => {
  const [activeTab, setActiveTab] = useState<'misiones' | 'memoria' | 'simulador' | 'privacidad'>('misiones');

  // Simulator state
  const [simOptionA, setSimOptionA] = useState('Comer fuera todos los días (RD$ 350/día)');
  const [costA, setCostA] = useState(350);
  const [simOptionB, setSimOptionB] = useState('Cocinar almuerzo en casa (RD$ 120/día)');
  const [costB, setCostB] = useState(120);
  const diffPerDay = Math.max(0, costA - costB);
  const monthlySavings = diffPerDay * 30;
  const annualSavings = diffPerDay * 365;

  // Adaptive missions state
  const [missions, setMissions] = useState([
    { id: 1, title: 'Reto Sin Café de Calle (Semana 1)', reward: 'RD$ 750 ahorrados', completed: true, badge: '☕ Ahorrador Espresso' },
    { id: 2, title: 'Comparar Arroz y Aceite en 2 súper antes de comprar', reward: 'RD$ 340 ahorrados', completed: false, badge: '🌾 Ojo Clínico' },
    { id: 3, title: 'Cancelar una suscripción de streaming en desuso', reward: 'RD$ 650/mes ahorrados', completed: false, badge: '✂️ Tijera Digital' },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Funciones Exclusivas de CazaAhorro</h3>
              <p className="text-xs text-slate-400">Herramientas diferenciadoras de inteligencia financiera</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/60 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('misiones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'misiones' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Misiones de Ahorro
          </button>
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'simulador' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Simulador de Decisiones
          </button>
          <button
            onClick={() => setActiveTab('memoria')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'memoria' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Memoria de Precios RD
          </button>
          <button
            onClick={() => setActiveTab('privacidad')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'privacidad' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Centro de Privacidad
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* TAB 1: MISIONES */}
          {activeTab === 'misiones' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-300">Retos Adaptativos Semanales</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Desafíos gamificados para acumular rachas y reducir gastos sin sacrificar tu calidad de vida.
                </p>
              </div>

              <div className="space-y-3">
                {missions.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setMissions(missions.map(x => x.id === m.id ? { ...x, completed: !x.completed } : x));
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      m.completed ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${m.completed ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'border-slate-700'}`}>
                        {m.completed && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${m.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>{m.title}</h5>
                        <p className="text-[11px] text-slate-400">{m.badge} • Recompensa estimada: {m.reward}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {m.completed ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SIMULADOR */}
          {activeTab === 'simulador' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white text-sm">Simulador de Decisión de Consumo</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Opción A (Gasto Habitual):</label>
                    <input
                      type="text"
                      value={simOptionA}
                      onChange={e => setSimOptionA(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none"
                    />
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Costo por ocasión (RD$):</span>
                      <input
                        type="number"
                        value={costA}
                        onChange={e => setCostA(Number(e.target.value))}
                        className="w-20 bg-slate-900 border border-slate-800 rounded-lg p-1 text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Opción B (Alternativa de Ahorro):</label>
                    <input
                      type="text"
                      value={simOptionB}
                      onChange={e => setSimOptionB(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white outline-none"
                    />
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Costo por ocasión (RD$):</span>
                      <input
                        type="number"
                        value={costB}
                        onChange={e => setCostB(Number(e.target.value))}
                        className="w-20 bg-slate-900 border border-slate-800 rounded-lg p-1 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Result card */}
              <div className="bg-gradient-to-r from-emerald-950/50 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-2">
                <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Impacto Proyectado si eliges la Opción B:
                </span>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Ahorro Mensual (30 días):</span>
                    <p className="text-xl font-black text-emerald-400">RD$ {monthlySavings.toLocaleString('es-DO')}</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Ahorro Anual Proyectado:</span>
                    <p className="text-xl font-black text-emerald-300">RD$ {annualSavings.toLocaleString('es-DO')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEMORIA DE PRECIOS */}
          {activeTab === 'memoria' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-white text-sm">Historial Verificable de Precios en RD</h4>
                <p className="text-slate-300 leading-relaxed">
                  CazaAhorro registra fechas y fuentes de observación. Si un comercio afirma un "50% de descuento", nuestro detector compara con el historial verificado para alertar sobre descuentos falsos.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Arroz Selecto Grano Largo 10 lbs</span>
                    <span className="text-[10px] text-slate-400">Supermercados Sirena • Ago: RD$ 360 &gt; Sep: RD$ 375 &gt; Oct: RD$ 385</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">+6.9%</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Aceite de Soya Puro 128 oz</span>
                    <span className="text-[10px] text-slate-400">Bravo Churchill • Ago: RD$ 560 &gt; Sep: RD$ 540 &gt; Oct: RD$ 529</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">-5.5% (Ahorro)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CENTRO DE PRIVACIDAD */}
          {activeTab === 'privacidad' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Políticas de Seguridad y Privacidad</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Tus datos financieros y transacciones se almacenan cifrados. No compartimos tus listas de compra ni saldos personales con anunciantes. Cumplimiento con la ley de protección de datos personales de República Dominicana.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert('Informe de datos personales generado y verificado.')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition text-left px-4 flex items-center justify-between"
                >
                  <span>Exportar Historial Completo de mi Cuenta</span>
                  <span className="text-slate-400 text-[10px]">JSON / CSV</span>
                </button>

                <button
                  onClick={() => alert('Para eliminar la cuenta, se requiere confirmación por correo verificado.')}
                  className="w-full py-2.5 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/20 text-rose-400 rounded-xl font-bold transition text-left px-4 flex items-center justify-between"
                >
                  <span>Solicitar Eliminación Definitiva de Datos</span>
                  <span className="text-rose-500 text-[10px]">Derecho al Olvido</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
