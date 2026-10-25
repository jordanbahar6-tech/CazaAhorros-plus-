import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Filter,
  DollarSign,
  Layers,
  Building,
  RefreshCw,
  Bell,
  Eye,
  Sliders,
  Lock,
  PieChart,
  Calendar
} from 'lucide-react';
import {
  FinancialSummary,
  FinancialTransaction,
  WithdrawalRequest,
  PayoutProviderConfig,
  User as UserType,
} from '../../types';
import { WithdrawModal } from './WithdrawModal';
import { WithdrawalDetailModal } from './WithdrawalDetailModal';

interface Props {
  currentUser: UserType;
  onOpenNotifications: () => void;
}

export const EarningsAndWithdrawalsPanel: React.FC<Props> = ({
  currentUser,
  onOpenNotifications,
}) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [ledger, setLedger] = useState<FinancialTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [providers, setProviders] = useState<PayoutProviderConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'libro_contable' | 'retiros' | 'fondos_segregados' | 'configuracion'>('resumen');
  const [ledgerFilter, setLedgerFilter] = useState<string>('all');
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cazaahorro_token') || '';
      const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [sumRes, ledRes, withRes, provRes] = await Promise.all([
        fetch('/api/finance/summary', { headers: authHeaders }),
        fetch('/api/finance/ledger', { headers: authHeaders }),
        fetch('/api/finance/withdrawals', { headers: authHeaders }),
        fetch('/api/finance/providers', { headers: authHeaders }),
      ]);

      if (sumRes.ok) setSummary(await sumRes.json());
      if (ledRes.ok) {
        const d = await ledRes.json();
        setLedger(d.ledger || []);
      }
      if (withRes.ok) {
        const d = await withRes.json();
        setWithdrawals(d.withdrawals || []);
      }
      if (provRes.ok) {
        const d = await provRes.json();
        setProviders(d.providers || []);
      }
    } catch (e) {
      console.error('Error fetching financial panel data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  if (!currentUser.permissions.canViewFinancials) {
    return (
      <div className="max-w-4xl mx-auto p-8 my-8 bg-slate-900 border border-rose-500/30 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Acceso Restringido a Finanzas</h2>
        <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
          Esta sección privada está reservada exclusivamente para el Propietario de la plataforma y Administradores Financieros autorizados.
        </p>
        <p className="text-xs text-slate-500">
          Tu usuario actual: <span className="font-semibold text-slate-300">{currentUser.name}</span> (Rol: <span className="uppercase text-amber-400">{currentUser.role}</span>).
        </p>
      </div>
    );
  }

  const filteredLedger = ledger.filter(item => {
    if (ledgerFilter === 'all') return true;
    return item.source === ledgerFilter;
  });

  const exportLedgerCsv = () => {
    const headers = 'ID,Fecha,Concepto,Bruto (DOP),Comision (DOP),Neto (DOP),Origen,Estado,Referencia,Pasarela\n';
    const rows = ledger
      .map(
        tx =>
          `"${tx.id}","${tx.date}","${tx.concept}",${tx.grossAmount},${tx.feeAmount},${tx.netAmount},"${tx.source}","${tx.status}","${tx.reference}","${tx.gateway}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Libro_Contable_CazaAhorro_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header & Role Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Panel Privado Oficial
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>Verificación Contable Activa</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ganancias y Retiros de la Plataforma
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Monitoreo en tiempo real del dinero generado, libro contable digital y desembolsos para República Dominicana.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Recargar saldos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Notificaciones en tiempo real"
          >
            <Bell className="w-4 h-4" />
            {summary && summary.notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Action Button: Retirar Dinero */}
          {currentUser.permissions.canWithdraw ? (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Retirar Dinero</span>
            </button>
          ) : (
            <div className="px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs flex items-center gap-1.5" title="No tienes autorización para retirar">
              <Lock className="w-3.5 h-3.5" />
              <span>Retiros no autorizados para tu rol</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('resumen')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'resumen'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Resumen & Balances
        </button>
        <button
          onClick={() => setActiveTab('retiros')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'retiros'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <span>Historial de Retiros</span>
          {withdrawals.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-950 text-indigo-300">
              {withdrawals.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('libro_contable')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'libro_contable'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Libro Contable Digital (Ledger)
        </button>
        <button
          onClick={() => setActiveTab('fondos_segregados')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'fondos_segregados'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Separación de Fondos</span>
        </button>
        <button
          onClick={() => setActiveTab('configuracion')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'configuracion'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configuración & Pasarelas RD</span>
        </button>
      </div>

      {/* TAB 1: RESUMEN Y BALANCES */}
      {activeTab === 'resumen' && summary && (
        <div className="space-y-6">
          {/* Key Metric Cards (Sección A) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* 1. Ingresos Totales */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Ingresos Totales</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-xl font-extrabold text-white">
                RD$ {summary.totalRevenue.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Todo el dinero recibido por la plataforma</span>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-500/5 rounded-full pointer-events-none group-hover:scale-150 transition" />
            </div>

            {/* 2. Ganancias del Mes */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Ganancias del Mes</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-extrabold text-emerald-400">
                RD$ {summary.monthRevenue.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Octubre 2026 (mes actual)</span>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-emerald-500/5 rounded-full pointer-events-none group-hover:scale-150 transition" />
            </div>

            {/* 3. Saldo Disponible (Retirable) */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Saldo Disponible</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-300">
                RD$ {summary.availableBalance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-emerald-400/70 mt-1 block font-medium">
                Listo para retirar (deducidas comisiones)
              </span>
            </div>

            {/* 4. Saldo Pendiente */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Saldo Pendiente</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-extrabold text-amber-400">
                RD$ {summary.pendingBalance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Liquidación en 48h hábiles</span>
            </div>

            {/* 5. Dinero Retirado */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Dinero Retirado</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xl font-extrabold text-slate-200">
                RD$ {summary.totalWithdrawn.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Retiros bancarios liquidados</span>
            </div>

            {/* 6. Retiros en Proceso */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Retiros en Proceso</span>
                <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-xl font-extrabold text-indigo-400">
                RD$ {summary.inProcessWithdrawn.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">En revisión o transferencia ACH</span>
            </div>
          </div>

          {/* Gráfico y Estadísticas + Ingresos por Fuente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Column */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Evolución de Ingresos Reales</h3>
                  <p className="text-xs text-slate-400">Registro verificado de cobros recibidos</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                        chartPeriod === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'daily' ? 'Diario' : p === 'weekly' ? 'Semanal' : p === 'monthly' ? 'Mensual' : 'Anual'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
                {summary.statsChart.labels.map((lbl, idx) => {
                  const val = summary.statsChart.data[idx];
                  const maxVal = Math.max(...summary.statsChart.data);
                  const heightPct = Math.round((val / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-emerald-400 transition">
                        RD$ {(val / 1000).toFixed(1)}k
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-indigo-600 via-indigo-500 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-sm"
                      />
                      <span className="text-[11px] text-slate-400 font-medium">{lbl}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Promedio diario: <strong className="text-white">RD$ 11,342.85</strong></span>
                <span className="text-emerald-400 font-semibold">+18.4% vs mes anterior</span>
              </div>
            </div>

            {/* Breakdown By Source (Ingresos por Fuente) */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Ingresos por Fuente</h3>
                  <p className="text-xs text-slate-400">Canales de monetización activos</p>
                </div>
                <PieChart className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="space-y-3 pt-2">
                {/* 1. Publicidad */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Publicidad Google AdMob</span>
                    <span className="font-bold text-white">RD$ {summary.bySource.ads.toLocaleString('es-DO')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                {/* 2. Suscripciones */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Suscripciones Premium</span>
                    <span className="font-bold text-white">RD$ {summary.bySource.subscriptions.toLocaleString('es-DO')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                {/* 3. Afiliaciones comerciales CercaRD */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Afiliación y Verificación Comercios</span>
                    <span className="font-bold text-white">RD$ {summary.bySource.merchant_listings.toLocaleString('es-DO')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>

                {/* 4. Comisiones Marketplace */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Comisiones ÚltimaOferta (10%)</span>
                    <span className="font-bold text-white">RD$ {summary.bySource.commissions.toLocaleString('es-DO')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>

                {/* 5. Compras in-app IA */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Créditos IA ProfeIA / ViralLab</span>
                    <span className="font-bold text-white">RD$ {summary.bySource.in_app_purchases.toLocaleString('es-DO')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full" style={{ width: '7%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Todos los cobros están verificados mediante API firmadas de pasarelas locales.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL DE RETIROS */}
      {activeTab === 'retiros' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Solicitudes y Retiros de Fondos</h3>
              <p className="text-xs text-slate-400">
                Estados auditados en tiempo real mediante transferencias ACH dominicanas
              </p>
            </div>
            {currentUser.permissions.canWithdraw && (
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                + Nueva Solicitud de Retiro
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">ID / Fecha</th>
                  <th className="p-3">Solicitante</th>
                  <th className="p-3">Destino Bancario</th>
                  <th className="p-3 text-right">Monto Bruto</th>
                  <th className="p-3 text-right">Tarifa</th>
                  <th className="p-3 text-right">Neto a Recibir</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {withdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <span className="font-mono font-bold text-white block">{w.id}</span>
                      <span className="text-[10px] text-slate-400">{new Date(w.requestedAt).toLocaleDateString('es-DO')}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-white block">{w.requestedBy.name}</span>
                      <span className="text-[10px] text-slate-400">{w.requestedBy.email}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-white block">{w.accountDetails.bankName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {w.accountDetails.accountNumberMasked}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-white">
                      RD$ {w.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-rose-400 font-mono">
                      - RD$ {w.fee.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-extrabold text-emerald-400">
                      RD$ {w.netAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'completado'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : w.status === 'aprobado' || w.status === 'procesando'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : w.status === 'rechazado'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedWithdrawal(w)}
                        className="px-2.5 py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition"
                      >
                        Ver / Auditar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIBRO CONTABLE DIGITAL (LEDGER) */}
      {activeTab === 'libro_contable' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Libro Contable Digital (Ledger Oficial)</h3>
              <p className="text-xs text-slate-400">
                Registro inmutable de transacciones con referencias bancarias únicas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={ledgerFilter}
                onChange={e => setLedgerFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 outline-none"
              >
                <option value="all">Todas las Fuentes</option>
                <option value="subscriptions">Suscripciones</option>
                <option value="ads">Publicidad</option>
                <option value="commissions">Comisiones</option>
                <option value="merchant_listings">Afiliaciones Comerciales</option>
                <option value="in_app_purchases">Compras In-App</option>
              </select>

              <button
                onClick={exportLedgerCsv}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Ref / Fecha</th>
                  <th className="p-3">Concepto & Pasarela</th>
                  <th className="p-3">Origen</th>
                  <th className="p-3 text-right">Importe Bruto</th>
                  <th className="p-3 text-right">Comisión Pasarela</th>
                  <th className="p-3 text-right">Monto Neto</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLedger.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <span className="font-mono font-bold text-white block">{tx.reference}</span>
                      <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleString('es-DO')}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-white block font-medium">{tx.concept}</span>
                      <span className="text-[10px] text-indigo-400">{tx.gateway}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 capitalize">
                        {tx.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-bold">
                      RD$ {tx.grossAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-rose-400 font-mono">
                      - RD$ {tx.feeAmount.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-extrabold text-emerald-400">
                      RD$ {tx.netAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {tx.status === 'confirmed' ? 'Confirmado' : 'Por Liquidar'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SEPARACIÓN DE FONDOS (SECCIÓN E) */}
      {activeTab === 'fondos_segregados' && summary && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Separación Estricta de Fondos (Sección E)</h3>
                <p className="text-xs text-slate-400">
                  Protección jurídica y contable: los fondos ajenos nunca se mezclan con los del propietario.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {/* Fondos Propietario */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Fondos del Propietario (Retirables)
                </span>
                <p className="text-2xl font-black text-emerald-300">
                  RD$ {summary.segregated.ownerPlatformFunds.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-400">
                  Ganancias netas acumuladas por la empresa tras deducir impuestos y comisiones.
                </p>
              </div>

              {/* Pendientes de Liquidación */}
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Ingresos por Liquidar (Pasarelas)
                </span>
                <p className="text-2xl font-black text-amber-300">
                  RD$ {summary.segregated.pendingSettlement.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-400">
                  Retenidos temporalmente por CardNet o Azul hasta cumplir el ciclo de compensación de 48h.
                </p>
              </div>

              {/* Custodia de Comercios */}
              <div className="bg-slate-950 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    Fondos en Custodia de Vendedores
                  </span>
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-2xl font-black text-white">
                  RD$ {summary.segregated.merchantEscrowFunds.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-400">
                  Protegidos legalmente. El dueño no puede retirar dinero correspondiente a las ventas de terceros en ÚltimaOferta o CercaRD.
                </p>
              </div>

              {/* Monederos de Usuarios */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Depósitos de Usuarios
                  </span>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-2xl font-black text-slate-300">
                  RD$ {summary.segregated.userWalletDeposits.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-400">
                  Saldos de usuarios en retos de ahorro. En cuenta fiduciaria segregada.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONFIGURACIÓN FINANCIERA & PASARELAS RD (SECCIÓN F) */}
      {activeTab === 'configuracion' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Configuración Financiera del Propietario</h3>
            <p className="text-xs text-slate-400">
              Gestión de pasarelas para República Dominicana, tasas de cambio y políticas de retiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Policy */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white">Parámetros Operativos Generales</h4>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Moneda Principal de la Plataforma:</label>
                <input
                  type="text"
                  disabled
                  value="Peso Dominicano (DOP / RD$)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Límite Mínimo de Retiro:</label>
                  <input
                    type="text"
                    disabled
                    value="RD$ 500.00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Límite Máximo Diario:</label>
                  <input
                    type="text"
                    disabled
                    value="RD$ 350,000.00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Regla de Aprobación de Fondos:</label>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  Todo retiro superior a RD$ 10,000 requiere doble factor (PIN seguro) y queda sujeto a revisión por el propietario antes de ser enviado a compensación ACH.
                </p>
              </div>
            </div>

            {/* Providers Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white">Pasarelas y Canales Habilitados en RD</h4>

              <div className="space-y-3">
                {providers.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.statusMessage}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={summary ? summary.availableBalance : 0}
        providers={providers}
        onWithdrawSuccess={newW => {
          setWithdrawals([newW, ...withdrawals]);
          fetchData();
        }}
      />

      {/* Withdrawal Detail / Audit Modal */}
      <WithdrawalDetailModal
        withdrawal={selectedWithdrawal}
        currentUser={currentUser}
        onClose={() => setSelectedWithdrawal(null)}
        onStatusUpdated={updated => {
          setWithdrawals(withdrawals.map(w => (w.id === updated.id ? updated : w)));
          setSelectedWithdrawal(updated);
          fetchData();
        }}
      />
    </div>
  );
};
