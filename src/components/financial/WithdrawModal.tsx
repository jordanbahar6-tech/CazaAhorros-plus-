import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  DollarSign,
  Info
} from 'lucide-react';
import { PayoutProviderConfig, DominicanPayoutProvider, WithdrawalRequest } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  providers: PayoutProviderConfig[];
  onWithdrawSuccess: (newWithdrawal: WithdrawalRequest) => void;
}

export const WithdrawModal: React.FC<Props> = ({
  isOpen,
  onClose,
  availableBalance,
  providers,
  onWithdrawSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProviderId, setSelectedProviderId] = useState<DominicanPayoutProvider>('ACH_BANRESERVAS');
  const [amount, setAmount] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('Corporación CazaAhorro SRL');
  const [cedulaOrRnc, setCedulaOrRnc] = useState<string>('1-32-45892-1');
  const [accountType, setAccountType] = useState<'corriente' | 'ahorros'>('corriente');
  const [accountNumber, setAccountNumber] = useState<string>('96023849102');
  const [securityPin, setSecurityPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completedWithdrawal, setCompletedWithdrawal] = useState<WithdrawalRequest | null>(null);

  if (!isOpen) return null;

  const currentProvider = providers.find(p => p.id === selectedProviderId) || providers[0];
  const numAmount = parseFloat(amount) || 0;

  // Real-time server-side fee replica for live preview
  const estimatedFee = currentProvider
    ? currentProvider.fixedFee + numAmount * currentProvider.percentageFee
    : 0;
  const netEstimatedAmount = Math.max(0, numAmount - estimatedFee);

  const handleNextStep = () => {
    setErrorMsg(null);
    if (numAmount < currentProvider.minWithdrawal) {
      setErrorMsg(`El importe mínimo para este método es RD$ ${currentProvider.minWithdrawal.toLocaleString()}.`);
      return;
    }
    if (numAmount > currentProvider.maxWithdrawal) {
      setErrorMsg(`El importe máximo diario por solicitud es RD$ ${currentProvider.maxWithdrawal.toLocaleString()}.`);
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMsg(`El importe supera tu saldo disponible retirable (RD$ ${availableBalance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}).`);
      return;
    }
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!accountHolderName.trim() || !accountNumber.trim()) {
        setErrorMsg('Por favor completa todos los datos bancarios del titular.');
        return;
      }
      if (currentProvider.requiresCedula && (!cedulaOrRnc || cedulaOrRnc.trim().length < 9)) {
        setErrorMsg('El sistema ACH dominicano requiere Cédula o RNC registrado.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmitWithdrawal = async () => {
    setErrorMsg(null);
    if (!securityPin || securityPin.length < 4) {
      setErrorMsg('Debes ingresar tu PIN de seguridad de 4 dígitos para autorizar el débito.');
      return;
    }

    setIsLoading(true);
    // Generate unique idempotency key
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const token = localStorage.getItem('cazaahorro_token') || '';
      const response = await fetch('/api/finance/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          idempotencyKey,
          amount: numAmount,
          currency: 'DOP',
          providerId: currentProvider.id,
          accountDetails: {
            bankName: currentProvider.name,
            accountType,
            accountNumberMasked: accountNumber.length > 4 ? `****-****-${accountNumber.slice(-4)}` : accountNumber,
            accountHolderName,
            cedulaOrRnc,
          },
          securityPin,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al procesar la solicitud de retiro.');
      }

      setCompletedWithdrawal(data.withdrawal);
      onWithdrawSuccess(data.withdrawal);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setAmount('');
    setSecurityPin('');
    setErrorMsg(null);
    setCompletedWithdrawal(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Solicitar Retiro de Fondos</h3>
              <p className="text-xs text-slate-400">Transferencias y pagos para República Dominicana</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {completedWithdrawal ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">¡Solicitud de Retiro Exitosa!</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Tu solicitud #{completedWithdrawal.id} ha sido registrada formalmente en el libro contable de la plataforma.
              </p>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Importe Solicitado:</span>
                  <span className="font-semibold text-white">RD$ {completedWithdrawal.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Comisión e Impuesto DGII:</span>
                  <span className="text-rose-400">- RD$ {completedWithdrawal.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 font-bold">Neto a Recibir:</span>
                  <span className="font-bold text-emerald-400 text-sm">RD$ {completedWithdrawal.netAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Destino:</span>
                  <span className="text-white">{completedWithdrawal.accountDetails.bankName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Estado inicial:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium uppercase text-[10px]">
                    {completedWithdrawal.status}
                  </span>
                </div>
              </div>

              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3 text-left flex items-start gap-2 text-xs text-indigo-300">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Tiempo estimado: 24 a 48 horas hábiles según el ciclo ACH del Banco Central de la República Dominicana (SIPARD). Recibirás una notificación en tiempo real tan pronto sea liquidado.</span>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
              >
                Volver al Panel Financiero
              </button>
            </div>
          ) : (
            <>
              {/* Stepper Progress */}
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-800/60">
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
                  <span>Importe & Método</span>
                </div>
                <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
                  <span>Datos Bancarios</span>
                </div>
                <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">3</span>
                  <span>Confirmación</span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: Amount & Dominican Provider */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Balance Display */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Saldo Disponible Retirable:</p>
                      <p className="text-2xl font-extrabold text-emerald-400">
                        RD$ {availableBalance.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAmount(String(availableBalance))}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                    >
                      Retirar Todo
                    </button>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Importe a Retirar (DOP):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                        RD$
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 text-white text-lg font-bold outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Provider Selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">
                      Selecciona Método de Retiro en República Dominicana:
                    </label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {providers.map(prov => {
                        const isSelected = selectedProviderId === prov.id;
                        return (
                          <div
                            key={prov.id}
                            onClick={() => setSelectedProviderId(prov.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                                : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                                <Building className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white">{prov.name}</p>
                                <p className="text-[11px] text-slate-400">
                                  Comisión: RD$ {prov.fixedFee} + {(prov.percentageFee * 100).toFixed(2)}% | {prov.processingTimeText}
                                </p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="providerRadio"
                              checked={isSelected}
                              onChange={() => setSelectedProviderId(prov.id)}
                              className="accent-emerald-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fee & Net preview */}
                  {numAmount > 0 && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>Comisión del canal y DGII:</span>
                        <span className="text-rose-400">- RD$ {estimatedFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                        <span>Neto estimado que recibirás:</span>
                        <span className="text-emerald-400">RD$ {netEstimatedAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Bank Account Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Proveedor Seleccionado:</span>
                      <p className="font-bold text-white">{currentProvider.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nombre Completo del Titular o Razón Social:
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={e => setAccountHolderName(e.target.value)}
                      placeholder="Ej. Juan Manuel Pérez o Mi Empresa SRL"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Cédula de Identidad o RNC:
                      </label>
                      <input
                        type="text"
                        value={cedulaOrRnc}
                        onChange={e => setCedulaOrRnc(e.target.value)}
                        placeholder="001-XXXXXXX-X o 1-XX-XXXXX-X"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Tipo de Cuenta:
                      </label>
                      <select
                        value={accountType}
                        onChange={e => setAccountType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                      >
                        <option value="corriente">Cuenta Corriente</option>
                        <option value="ahorros">Cuenta de Ahorros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Número de Cuenta Bancaria:
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="Número de cuenta estándar dominicano"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm font-mono outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-[11px] text-amber-300">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Cumplimiento Monetario y Financiero de RD: No almacenamos credenciales bancarias ni contraseñas. Los datos se verifican mediante la red de pagos ACH autorizada.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: Security PIN & Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                    <h5 className="font-bold text-white text-sm pb-1 border-b border-slate-800">
                      Resumen Oficial de la Operación
                    </h5>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Importe Bruto a Retirar:</span>
                      <span className="text-white font-semibold">RD$ {numAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tarifa Canal + DGII:</span>
                      <span className="text-rose-400">- RD$ {estimatedFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-800">
                      <span className="text-slate-200">Monto Neto a Transferir:</span>
                      <span className="text-emerald-400">RD$ {netEstimatedAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Banco / Pasarela:</span>
                      <span className="text-white">{currentProvider.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Titular y Cédula/RNC:</span>
                      <span className="text-white">{accountHolderName} ({cedulaOrRnc})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cuenta:</span>
                      <span className="text-slate-300 font-mono">****-{accountNumber.slice(-4)} ({accountType})</span>
                    </div>
                  </div>

                  {/* 2FA PIN Code */}
                  <div className="bg-gradient-to-r from-slate-950 to-indigo-950/40 p-4 border border-indigo-500/20 rounded-2xl">
                    <label className="block text-xs font-semibold text-indigo-300 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>PIN de Autorización Administrativa (2FA):</span>
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={securityPin}
                      onChange={e => setSecurityPin(e.target.value)}
                      placeholder="Ingresa PIN (ej. 2026)"
                      className="w-full bg-slate-900 border border-indigo-500/40 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-white text-center font-mono tracking-widest text-lg outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 text-center">
                      Clave de demostración autorizada: <code className="text-emerald-400 font-bold">2026</code> o <code className="text-emerald-400 font-bold">1234</code>
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as any)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
                  >
                    Atrás
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/30"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitWithdrawal}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/40 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Procesando solicitud...</span>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        <span>Confirmar y Retirar Fondos</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
