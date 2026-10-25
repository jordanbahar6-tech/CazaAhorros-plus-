import React from 'react';
import {
  Home,
  ShoppingBag,
  MapPin,
  Wallet,
  GraduationCap,
  Wrench,
  Briefcase,
  Video,
  Tag,
  FileText,
  Users,
  DollarSign,
  Sparkles,
  ShieldCheck,
  X,
  Target,
  HelpCircle
} from 'lucide-react';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onNavigate: (moduleId: string) => void;
  currentUser: User;
  onOpenExclusiveFeatures: () => void;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  activeModule,
  onNavigate,
  currentUser,
  onOpenExclusiveFeatures,
  onOpenTour,
}) => {
  const modules = [
    { id: 'home', name: 'SuperApp Hub (Inicio)', icon: Home, color: 'text-indigo-400' },
    { id: 'cazaahorros', name: '1. CazaAhorros', desc: 'Precios Sirena, Bravo, Jumbo', icon: ShoppingBag, color: 'text-emerald-400' },
    { id: 'cercard', name: '2. CercaRD', desc: 'Directorio de servicios en RD', icon: MapPin, color: 'text-indigo-400' },
    { id: 'dineroclaro', name: '3. DineroClaro', desc: 'Finanzas personales y fugas', icon: Wallet, color: 'text-emerald-400' },
    { id: 'profeia', name: '4. ProfeIA', desc: 'Tutor educativo con IA', icon: GraduationCap, color: 'text-violet-400' },
    { id: 'todokit', name: '5. TodoKit', desc: 'Caja digital y divisas BCRD', icon: Wrench, color: 'text-teal-400' },
    { id: 'empleoya', name: '6. EmpleoYa', desc: 'Empleos verificados en RD', icon: Briefcase, color: 'text-blue-400' },
    { id: 'virallab', name: '7. ViralLab', desc: 'Guiones virales TikTok/Reels', icon: Video, color: 'text-rose-400' },
    { id: 'ultimaoferta', name: '8. ÚltimaOferta', desc: 'Excedentes y descuentos', icon: Tag, color: 'text-amber-400' },
    { id: 'docufacil', name: '9. DocuFácil', desc: 'Contratos en RD y OCR', icon: FileText, color: 'text-cyan-400' },
    { id: 'mibarrio', name: '10. MiBarrio', desc: 'Comunidad barrial en RD', icon: Users, color: 'text-orange-400' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4">
          {/* Top Logo in Sidebar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
                CA
              </div>
              <span className="font-extrabold text-white text-sm">CazaAhorro</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Special Section 26: Ganancias y Retiros */}
          {currentUser.permissions.canViewFinancials && (
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 p-3 rounded-2xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                Sección Administrativa 26
              </span>
              <button
                onClick={() => {
                  onNavigate('finanzas_admin');
                  onClose();
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeModule === 'finanzas_admin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                <DollarSign className="w-4 h-4 shrink-0" />
                <span className="truncate">Ganancias y Retiros</span>
              </button>
            </div>
          )}

          {/* Module Links */}
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
              10 Módulos de la Plataforma
            </span>
            {modules.map(mod => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    onNavigate(mod.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : mod.color}`} />
                  <div className="truncate">
                    <span className="text-xs font-semibold block leading-tight truncate">{mod.name}</span>
                    {mod.desc && (
                      <span className={`text-[10px] block leading-tight truncate ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {mod.desc}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions: Exclusive Features & Tour */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          {onOpenTour && (
            <button
              onClick={() => {
                onClose();
                onOpenTour();
              }}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Guía Rápida / Tour</span>
            </button>
          )}

          <button
            onClick={onOpenExclusiveFeatures}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Funciones Exclusivas</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">9 Pro</span>
          </button>
        </div>
      </aside>
    </>
  );
};
