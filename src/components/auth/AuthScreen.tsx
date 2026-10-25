import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Building
} from 'lucide-react';
import { User } from '../../types';
import { DOMINICAN_PROVINCES } from '../../constants/provinces';

interface Props {
  onLoginSuccess: (user: User, token: string) => void;
}

export const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCity, setRegCity] = useState('Distrito Nacional, Santo Domingo');
  const [regPhone, setRegPhone] = useState('');
  const [regAccountType, setRegAccountType] = useState<'personal' | 'merchant'>('personal');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas.');
      }

      localStorage.setItem('cazaahorro_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regEmail.trim() || !regPassword || !regName.trim()) {
      setErrorMsg('Por favor completa los campos requeridos.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          city: regCity,
          phone: regPhone,
          accountType: regAccountType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar usuario.');
      }

      localStorage.setItem('cazaahorro_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOwnerFill = () => {
    setLoginEmail('jeiishin75@gmail.com');
    setLoginPassword('Admin2026*');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Oficial Seguro CazaAhorro</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-0.5 shadow-xl shadow-indigo-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-lg">
                CA
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">
                CazaAhorro
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mt-0.5">
                SUPERAPP • 10 MÓDULOS
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Plataforma financiera y comparador inteligente para República Dominicana
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                tab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Correo Electrónico:</span>
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@cazaahorro.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs md:text-sm text-white outline-none transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contraseña:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs md:text-sm text-white outline-none transition"
                  required
                />
              </div>

              {/* Owner quick access button */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Cuenta de Propietario</span>
                  <span className="text-[11px] text-indigo-300">jeiishin75@gmail.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickOwnerFill}
                  className="px-2.5 py-1 bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold rounded-lg transition"
                >
                  Autocompletar
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                <span>{isLoading ? 'Iniciando sesión...' : 'Entrar a CazaAhorro'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Ej. Juan Pérez Santana"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="tu.correo@dominio.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Contraseña:</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Confirmar Clave:</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repite la clave"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Provincia (República Dominicana):</label>
                  <select
                    value={regCity}
                    onChange={e => setRegCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {DOMINICAN_PROVINCES.map(prov => (
                      <option key={prov.id} value={`${prov.name} (${prov.capital})`}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Teléfono o WhatsApp:</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="809-555-0000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tipo de Cuenta:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegAccountType('personal')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      regAccountType === 'personal'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Usuario Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegAccountType('merchant')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      regAccountType === 'merchant'
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Comercio / Técnico
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs md:text-sm rounded-xl transition shadow-lg shadow-emerald-500/25 mt-2 disabled:opacity-50"
              >
                {isLoading ? 'Registrando cuenta...' : 'Crear Cuenta en CazaAhorro'}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT */}
          {tab === 'forgot' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm">Recuperación de Contraseña</h3>
              <p className="text-slate-400">
                Introduce el correo asociado a tu cuenta para restablecer tu clave de acceso.
              </p>

              {forgotSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold">Solicitud enviada</p>
                  <p className="text-slate-400">Si el correo está registrado, recibirás un enlace de confirmación.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccess(false);
                      setTab('login');
                    }}
                    className="mt-3 px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold"
                  >
                    Volver al Inicio de Sesión
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!forgotEmail) return;
                    setForgotSuccess(true);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="tu.correo@dominio.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                    required
                  />

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
                    >
                      Enviar Enlace
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>© 2026 CazaAhorro SuperApp. Todos los derechos reservados.</p>
          <p>Conexión en línea y almacenamiento persistente oficial.</p>
        </div>
      </div>
    </div>
  );
};
