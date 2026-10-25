import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  onStatusChange?: (isOnline: boolean) => void;
}

export const OnlineSentinel: React.FC<Props> = ({ onStatusChange }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());

  const checkServerConnection = async () => {
    setIsChecking(true);
    const startTime = performance.now();
    try {
      const response = await fetch('/api/health/ping', {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const latency = Math.round(performance.now() - startTime);
        setIsOnline(true);
        setPingLatency(latency);
        setLastCheckTime(new Date());
        onStatusChange?.(true);
      } else {
        setIsOnline(false);
        onStatusChange?.(false);
      }
    } catch (e) {
      setIsOnline(false);
      onStatusChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => checkServerConnection();
    const handleOffline = () => {
      setIsOnline(false);
      onStatusChange?.(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkServerConnection();

    // Heartbeat online check every 30 seconds
    const interval = setInterval(checkServerConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="fixed bottom-2 left-3 z-30 hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-900/90 text-emerald-400 border border-emerald-500/20 backdrop-blur-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>En Línea</span>
        {pingLatency !== null && <span className="text-slate-400">({pingLatency}ms)</span>}
      </div>
    );
  }

  // Full blocking overlay strictly satisfying Requirement 16
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <WifiOff className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Sin conexión a Internet
        </h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Conéctate para utilizar <strong>CazaAhorro</strong>. Toda la plataforma funciona exclusivamente en tiempo real en línea para garantizar la exactitud de los precios, los saldos financieros, las cotizaciones y la seguridad de las transacciones.
        </p>

        <div className="bg-slate-950/60 rounded-xl p-3 mb-6 text-xs text-slate-400 border border-slate-800 flex items-center gap-2 text-left">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Las operaciones locales no se guardan en caché para proteger tus datos financieros y evitar transacciones duplicadas.</span>
        </div>

        <button
          onClick={checkServerConnection}
          disabled={isChecking}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Verificando enlace...' : 'Reintentar conexión'}</span>
        </button>
      </div>
    </div>
  );
};
