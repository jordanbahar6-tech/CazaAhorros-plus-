import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  Calendar,
  AlertTriangle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { FinancialRecord } from '../../types';

export const DineroClaroModule: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Supermercado');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [radarAnalysis, setRadarAnalysis] = useState<string | null>(null);
  const [isAnalyzingRadar, setIsAnalyzingRadar] = useState(false);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('cazaahorro_token') || '';
      const res = await fetch('/api/modules/dineroclaro/records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setRecords(d.records || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const totalIncome = records.filter(r => r.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newConcept) return;

    try {
      const token = localStorage.getItem('cazaahorro_token') || '';
      const res = await fetch('/api/modules/dineroclaro/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          concept: newConcept,
          amount: parseFloat(newAmount),
          category: newCategory,
          type: newType,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setRecords(d.records);
        setShowAddModal(false);
        setNewConcept('');
        setNewAmount('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runRadarAnalysis = async () => {
    setIsAnalyzingRadar(true);
    try {
      const res = await fetch('/api/gemini/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: records }),
      });
      const data = await res.json();
      setRadarAnalysis(data.analysis || 'No se pudieron detectar gastos invisibles en este momento.');
    } catch (e) {
      setRadarAnalysis('Error ejecutando el radar. Se requiere conexión activa.');
    } finally {
      setIsAnalyzingRadar(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">DineroClaro — Finanzas Personales en RD$</h2>
            <p className="text-xs text-slate-400">
              Control de gastos, caja negra del presupuesto y radar de micro-fugas en pesos dominicanos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runRadarAnalysis}
            disabled={isAnalyzingRadar}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAnalyzingRadar ? 'Analizando...' : 'Radar de Gastos Invisibles'}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Registrar Movimiento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-semibold">Ingresos Totales</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            RD$ {totalIncome.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-semibold">Gastos Totales</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">
            RD$ {totalExpense.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-semibold">Caja Negra (Ahorro Neto)</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">
            RD$ {netSavings.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Margen de ahorro: {totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0}%</span>
        </div>
      </div>

      {/* Radar AI Analysis Panel */}
      {radarAnalysis && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Informe de Detección de Gastos Invisibles</span>
            </h3>
            <button onClick={() => setRadarAnalysis(null)} className="text-xs text-slate-400 hover:text-white">
              Cerrar
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{radarAnalysis}</p>
        </div>
      )}

      {/* Recent Records Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Historial de Operaciones Financieras</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Concepto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Tipo</th>
                <th className="p-3 text-right">Importe (DOP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 text-slate-400 font-mono">{r.date}</td>
                  <td className="p-3 text-white font-semibold">{r.concept}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                      {r.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {r.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className={`p-3 text-right font-extrabold ${r.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {r.type === 'income' ? '+' : '-'} RD$ {r.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Nuevo Registro Financiero</h3>
            <form onSubmit={handleAddRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipo de Movimiento:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('expense')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      newType === 'expense'
                        ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Gasto
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('income')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      newType === 'income'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Ingreso
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Concepto:</label>
                <input
                  type="text"
                  value={newConcept}
                  onChange={e => setNewConcept(e.target.value)}
                  placeholder="Ej. Compra en Colmado o Salario"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Importe (RD$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoría:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Supermercado">Supermercado</option>
                    <option value="Combustible">Combustible</option>
                    <option value="Comida Fuera">Comida Fuera</option>
                    <option value="Servicios">Luz / Agua / Teléfono</option>
                    <option value="Suscripciones">Suscripciones</option>
                    <option value="Salario">Salario</option>
                    <option value="Ingreso Extra">Ingreso Extra</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
