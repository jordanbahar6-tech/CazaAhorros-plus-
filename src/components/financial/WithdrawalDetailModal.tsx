import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Send,
  FileText
} from 'lucide-react';
import { WithdrawalRequest, WithdrawalStatus, User as UserType } from '../../types';

interface Props {
  withdrawal: WithdrawalRequest | null;
  currentUser: UserType;
  onClose: () => void;
  onStatusUpdated: (updatedWithdrawal: WithdrawalRequest) => void;
}

export const WithdrawalDetailModal: React.FC<Props> = ({
  withdrawal,
  currentUser,
  onClose,
  onStatusUpdated,
}) => {
  if (!withdrawal) return null;

  const [isUpdating, setIsUpdating] = useState(false);
  const [rejectReason, setRejectReason] = useState(
    'Discrepancia en número de cédula o titular de cuenta en Banreservas ACH.'
  );
  const [rejectFixInstructions, setRejectFixInstructions] = useState(
    'Por favor verifique que la Cédula coincida exactamente con la registrada en la entidad financiera.'
  );
  const [providerRef, setProviderRef] = useState(`ACH-BR-${Date.now().toString().slice(-6)}`);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canApprove = currentUser.role === 'owner' || currentUser.permissions.canWithdraw;

  const handleUpdateStatus = async (newStatus: WithdrawalStatus) => {
    setIsUpdating(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('cazaahorro_token') || '';
      const response = await fetch(`/api/finance/withdrawals/${withdrawal.id}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus,
          rejectionReason: newStatus === 'rechazado' ? rejectReason : undefined,
          rejectionFixInstructions: newStatus === 'rechazado' ? rejectFixInstructions : undefined,
          providerReference: newStatus === 'completado' ? providerRef : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al actualizar estado');
      }

      onStatusUpdated(data.withdrawal);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de comunicación');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case 'completado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completado / Liquidado</span>;
      case 'aprobado':
      case 'procesando':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">En Transferencia Bancaria</span>;
      case 'en_revision':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">En Revisión Administrativa</span>;
      case 'rechazado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Rechazado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">Solicitado</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Retiro #{withdrawal.id}</h3>
                {getStatusBadge(withdrawal.status)}
              </div>
              <p className="text-xs text-slate-400">ID de Idempotencia: {withdrawal.idempotencyKey}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Amount Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Monto Bruto</p>
              <p className="text-lg font-bold text-white">RD$ {withdrawal.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Tarifa & DGII</p>
              <p className="text-lg font-bold text-rose-400">- RD$ {withdrawal.fee.toFixed(2)}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Neto Transferido</p>
              <p className="text-lg font-extrabold text-emerald-400">RD$ {withdrawal.netAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Bank & Beneficiary Info */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 mb-2">
              Detalles Bancarios del Beneficiario
            </h4>
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <span className="text-slate-400">Titular:</span>
                <p className="font-semibold text-white">{withdrawal.accountDetails.accountHolderName}</p>
              </div>
              <div>
                <span className="text-slate-400">Cédula / RNC:</span>
                <p className="font-semibold text-white font-mono">{withdrawal.accountDetails.cedulaOrRnc || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400">Entidad Bancaria:</span>
                <p className="font-semibold text-white">{withdrawal.accountDetails.bankName}</p>
              </div>
              <div>
                <span className="text-slate-400">Número de Cuenta:</span>
                <p className="font-semibold text-white font-mono">{withdrawal.accountDetails.accountNumberMasked} ({withdrawal.accountDetails.accountType})</p>
              </div>
              <div>
                <span className="text-slate-400">Solicitante:</span>
                <p className="font-semibold text-white">{withdrawal.requestedBy.name} ({withdrawal.requestedBy.email})</p>
              </div>
              <div>
                <span className="text-slate-400">Fecha de Solicitud:</span>
                <p className="font-semibold text-white">{new Date(withdrawal.requestedAt).toLocaleString('es-DO')}</p>
              </div>
            </div>

            {withdrawal.providerReference && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Referencia Bancaria Oficial (SIPARD):</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md">
                  {withdrawal.providerReference}
                </span>
              </div>
            )}
          </div>

          {/* Rejection Details if rejected */}
          {withdrawal.status === 'rechazado' && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <XCircle className="w-4 h-4" />
                <span>Motivo del Rechazo:</span>
              </div>
              <p className="text-slate-300">{withdrawal.rejectionReason}</p>
              {withdrawal.rejectionFixInstructions && (
                <div className="pt-2 border-t border-rose-500/20 text-slate-400">
                  <strong className="text-slate-200">Instrucciones para corregir: </strong>
                  {withdrawal.rejectionFixInstructions}
                </div>
              )}
            </div>
          )}

          {/* Audit Trail (Sección C & D) */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Libro de Auditoría y Verificación
            </h4>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2 max-h-36 overflow-y-auto">
              {withdrawal.auditTrail.map((log, idx) => (
                <div key={idx} className="text-[11px] border-b border-slate-900 pb-1.5 last:border-none">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString('es-DO')}</span>
                    <span className="text-indigo-400">{log.actor}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{log.action}</p>
                  {log.notes && <p className="text-slate-400 italic text-[10px]">{log.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Admin / Owner Status Controls */}
          {canApprove && withdrawal.status !== 'completado' && withdrawal.status !== 'rechazado' && (
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">Acciones Administrativas de Retiro:</span>
                <span className="text-[10px] text-slate-400">Solo dueño y administradores autorizados</span>
              </div>

              {!showRejectForm ? (
                <div className="flex flex-wrap items-center gap-2">
                  {withdrawal.status === 'solicitado' && (
                    <button
                      onClick={() => handleUpdateStatus('en_revision')}
                      disabled={isUpdating}
                      className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl transition"
                    >
                      Pasar a En Revisión
                    </button>
                  )}

                  {(withdrawal.status === 'solicitado' || withdrawal.status === 'en_revision') && (
                    <button
                      onClick={() => handleUpdateStatus('aprobado')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md"
                    >
                      Aprobar Retiro
                    </button>
                  )}

                  {withdrawal.status === 'aprobado' && (
                    <div className="flex items-center gap-2 w-full pt-1">
                      <input
                        type="text"
                        value={providerRef}
                        onChange={e => setProviderRef(e.target.value)}
                        placeholder="Referencia bancaria ACH"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => handleUpdateStatus('completado')}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md whitespace-nowrap flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Marcar como Liquidado</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl transition ml-auto"
                  >
                    Rechazar...
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-300 mb-1">
                      Motivo del rechazo formal:
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Instrucciones de corrección para el usuario:
                    </label>
                    <input
                      type="text"
                      value={rejectFixInstructions}
                      onChange={e => setRejectFixInstructions(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('rechazado')}
                      disabled={isUpdating}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      Confirmar Rechazo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
