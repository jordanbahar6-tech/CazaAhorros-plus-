import React, { useEffect, useState } from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { WithdrawalNotification } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectWithdrawal?: (withdrawalId: string) => void;
}

export const NotificationDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectWithdrawal,
}) => {
  const [notifications, setNotifications] = useState<WithdrawalNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/finance/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/finance/notifications/mark-all-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Notificaciones de Retiros</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1"
            >
              Marcar leídas
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No hay notificaciones recientes.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition text-xs space-y-1.5 ${
                  !n.read
                    ? 'bg-slate-950 border-indigo-500/40 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {n.type === 'withdrawal_processed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : n.type === 'withdrawal_rejected' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>{n.title}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.timestamp).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                {n.withdrawalId && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectWithdrawal?.(n.withdrawalId);
                        onClose();
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>Ver retiro #{n.withdrawalId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
