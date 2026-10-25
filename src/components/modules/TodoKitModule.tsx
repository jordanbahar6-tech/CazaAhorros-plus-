import React, { useState } from 'react';
import {
  Wrench,
  DollarSign,
  Percent,
  QrCode,
  KeyRound,
  FileText,
  Copy,
  Check,
  Calculator,
  RefreshCw
} from 'lucide-react';

export const TodoKitModule: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'currency' | 'itbis' | 'qr' | 'passwords' | 'text'>('currency');

  // Currency Converter State
  const [currencyAmount, setCurrencyAmount] = useState('100');
  const [currencyFrom, setCurrencyFrom] = useState<'USD' | 'DOP' | 'EUR' | 'CAD'>('USD');
  const [currencyTo, setCurrencyTo] = useState<'USD' | 'DOP' | 'EUR' | 'CAD'>('DOP');

  // Rates vs DOP (Official reference rates Banco Central RD / Banreservas)
  const ratesToDop: Record<string, number> = {
    DOP: 1.0,
    USD: 60.25,
    EUR: 64.80,
    CAD: 43.50,
  };

  const convertCurrency = () => {
    const val = parseFloat(currencyAmount) || 0;
    const inDop = val * ratesToDop[currencyFrom];
    const target = inDop / ratesToDop[currencyTo];
    return target.toFixed(2);
  };

  // ITBIS Calculator (18% & 16% in Dominican Republic)
  const [itbisSubtotal, setItbisSubtotal] = useState('1000');
  const [itbisRate, setItbisRate] = useState(0.18);
  const numSubtotal = parseFloat(itbisSubtotal) || 0;
  const itbisAmount = numSubtotal * itbisRate;
  const itbisTotal = numSubtotal + itbisAmount;

  // QR Generator
  const [qrText, setQrText] = useState('https://cazaahorro.com');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}&color=10-185-129`;

  // Password Generator
  const [generatedPass, setGeneratedPass] = useState('');
  const [passLength, setPassLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+~';
    let res = '';
    for (let i = 0; i < passLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(res);
  };

  // Text Analyzer
  const [textInput, setTextInput] = useState('');
  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const charCount = textInput.length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">TodoKit — Caja de Herramientas Digitales</h2>
            <p className="text-xs text-slate-400">
              Conversor de divisas RD$, cálculo de ITBIS 18%, generador QR, contraseñas y utilidades online
            </p>
          </div>
        </div>

        {/* Tools tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTool('currency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === 'currency' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Divisas RD$</span>
          </button>
          <button
            onClick={() => setActiveTool('itbis')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === 'itbis' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Calculadora ITBIS</span>
          </button>
          <button
            onClick={() => setActiveTool('qr')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === 'qr' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generador QR</span>
          </button>
          <button
            onClick={() => {
              setActiveTool('passwords');
              if (!generatedPass) generateSecurePassword();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === 'passwords' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Contraseñas Seguras</span>
          </button>
          <button
            onClick={() => setActiveTool('text')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === 'text' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Contador de Texto</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: CURRENCY */}
      {activeTool === 'currency' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Conversor Oficial de Monedas (Banco Central RD)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monto a convertir:</label>
              <input
                type="number"
                value={currencyAmount}
                onChange={e => setCurrencyAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-white outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Desde:</label>
                <select
                  value={currencyFrom}
                  onChange={e => setCurrencyFrom(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="DOP">Peso Dominicano (DOP)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="CAD">Dólar Canadiense (CAD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Hacia:</label>
                <select
                  value={currencyTo}
                  onChange={e => setCurrencyTo(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="DOP">Peso Dominicano (DOP)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="CAD">Dólar Canadiense (CAD)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center mt-4">
              <span className="text-xs text-slate-400 block mb-1">Resultado estimado:</span>
              <p className="text-3xl font-black text-emerald-400">
                {convertCurrency()} <span className="text-sm font-semibold">{currencyTo}</span>
              </p>
              <span className="text-[10px] text-slate-500 mt-2 block">
                Tasa de referencia BCRD: 1 USD = RD$ {ratesToDop.USD.toFixed(2)} | 1 EUR = RD$ {ratesToDop.EUR.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: ITBIS */}
      {activeTool === 'itbis' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-teal-400" />
            <span>Calculadora de Impuestos e ITBIS en República Dominicana</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monto Subtotal (RD$):</label>
              <input
                type="number"
                value={itbisSubtotal}
                onChange={e => setItbisSubtotal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tasa de ITBIS:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setItbisRate(0.18)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    itbisRate === 0.18 ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  18% (Tasa General RD)
                </button>
                <button
                  type="button"
                  onClick={() => setItbisRate(0.16)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    itbisRate === 0.16 ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  16% (Reducido / Alimentos seleccionados)
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 mt-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Neto:</span>
                <span className="font-bold text-white">RD$ {numSubtotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ITBIS ({itbisRate * 100}%):</span>
                <span className="font-bold text-amber-400">+ RD$ {itbisAmount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-white pt-2 border-t border-slate-800">
                <span>Total a Pagar / Facturar:</span>
                <span className="text-emerald-400">RD$ {itbisTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: QR GENERATOR */}
      {activeTool === 'qr' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 max-w-xl mx-auto space-y-4 text-center">
          <h3 className="text-base font-bold text-white">Generador de Código QR Online</h3>
          <input
            type="text"
            value={qrText}
            onChange={e => setQrText(e.target.value)}
            placeholder="Introduce enlace, teléfono, WhatsApp o texto..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-teal-500"
          />

          <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto mt-2">
            <img src={qrUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
          </div>

          <p className="text-xs text-slate-400">
            Escanea este código directamente con la cámara de tu smartphone.
          </p>
        </div>
      )}

      {/* TOOL 4: PASSWORDS */}
      {activeTool === 'passwords' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-teal-400" />
            <span>Generador de Contraseñas Criptográficamente Seguras</span>
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="font-mono text-base font-bold text-emerald-400 tracking-wider break-all">
              {generatedPass}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedPass);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition shrink-0 ml-2"
              title="Copiar contraseña"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Longitud: {passLength} caracteres</span>
            <input
              type="range"
              min="10"
              max="32"
              value={passLength}
              onChange={e => setPassLength(Number(e.target.value))}
              className="accent-teal-500 w-44"
            />
          </div>

          <button
            onClick={generateSecurePassword}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition"
          >
            Generar Nueva Contraseña
          </button>
        </div>
      )}

      {/* TOOL 5: TEXT */}
      {activeTool === 'text' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Contador y Analizador de Texto</span>
          </h3>

          <textarea
            rows={5}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Pega o escribe tu texto aquí..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-teal-500"
          />

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">Palabras</span>
              <p className="text-xl font-bold text-white">{wordCount}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">Caracteres</span>
              <p className="text-xl font-bold text-teal-400">{charCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
