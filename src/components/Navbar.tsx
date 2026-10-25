import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  User as UserIcon,
  DollarSign,
  Menu,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
  Building,
  HelpCircle
} from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser: User;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenAiAssistant: () => void;
  onToggleSidebar: () => void;
  onNavigate: (module: string) => void;
  onOpenTour?: () => void;
  activeModule: string;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  onLogout,
  onOpenNotifications,
  onOpenAiAssistant,
  onToggleSidebar,
  onNavigate,
  onOpenTour,
  activeModule,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 md:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-0.5 shadow-md shadow-indigo-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 font-black text-sm">
                CA
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-400 transition">
                  CazaAhorro
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950">
                  SUPERAPP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">10 aplicaciones en 1 plataforma online</p>
            </div>
          </div>
        </div>

        {/* Center / Fast Module Switcher on Tablet+ */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/70 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeModule === 'home' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate('cazaahorros')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeModule === 'cazaahorros' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Precios RD
          </button>
          <button
            onClick={() => onNavigate('dineroclaro')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeModule === 'dineroclaro' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            DineroClaro
          </button>

          {currentUser.permissions.canViewFinancials && (
            <button
              onClick={() => onNavigate('finanzas_admin')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1.5 ${
                activeModule === 'finanzas_admin'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Ganancias & Retiros</span>
            </button>
          )}
        </div>

        {/* Right Actions: AI Assistant, Notifications, User Profile */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-violet-300 hover:text-white hover:bg-violet-600/40 text-xs font-bold transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Asistente IA</span>
          </button>

          {/* Quick Tour / Guía Rápida */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition flex items-center gap-1.5 cursor-pointer"
              title="Guía rápida y tour interactivo"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline text-xs font-semibold">Tour</span>
            </button>
          )}

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition cursor-pointer"
            title="Notificaciones de retiros y alertas"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[11px] font-bold text-indigo-300">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-3">
                <div className="pb-2 border-b border-slate-800/80">
                  <span className="font-bold text-xs text-white block truncate">{currentUser.name}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{currentUser.email}</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Rol: {currentUser.role}
                    </span>
                    <span className="text-[10px] text-slate-500">{currentUser.city}</span>
                  </div>
                </div>

                {currentUser.permissions.canViewFinancials && (
                  <button
                    onClick={() => {
                      onNavigate('finanzas_admin');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Panel de Ganancias y Retiros</span>
                  </button>
                )}

                {onOpenTour && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenTour();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-500/10 transition cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Ver Guía Rápida / Tour</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
