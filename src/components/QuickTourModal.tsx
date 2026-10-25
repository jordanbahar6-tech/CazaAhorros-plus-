import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  ShoppingBag,
  Wallet,
  Bot,
  MapPin,
  DollarSign
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (moduleId: string) => void;
  onOpenAiAssistant: () => void;
  isOwnerOrAdmin?: boolean;
}

export const QuickTourModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToModule,
  onOpenAiAssistant,
  isOwnerOrAdmin = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      badge: 'Bienvenida',
      title: '¡Te damos la bienvenida a CazaAhorro!',
      subtitle: 'La SuperApp que une 10 herramientas esenciales para República Dominicana.',
      icon: Compass,
      accentColor: 'from-emerald-500 to-teal-400',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Has ingresado a una plataforma diseñada exclusivamente para ayudarte a ahorrar dinero, optimizar tu tiempo y conectar con comercios, empleos y oportunidades en todo el territorio dominicano.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">10 Módulos en 1</span>
              <span className="text-xs text-slate-200 font-semibold block mt-0.5">Precios, Finanzas, Empleo y Más</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">32 Provincias</span>
              <span className="text-xs text-slate-200 font-semibold block mt-0.5">Cobertura Nacional Completa</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">Asistente IA</span>
              <span className="text-xs text-slate-200 font-semibold block mt-0.5">Copiloto Inteligente Dominicano</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">100% Online</span>
              <span className="text-xs text-slate-200 font-semibold block mt-0.5">Base de datos y sesiones en vivo</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 2,
      badge: 'Navegación',
      title: '¿Cómo cambiar entre los 10 módulos?',
      subtitle: 'Navega rápidamente sin perder tu progreso ni tus búsquedas.',
      icon: Layers,
      accentColor: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Tienes <span className="text-white font-bold">3 formas sencillas</span> de moverte por toda la SuperApp:
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Menú Lateral (Sidebar)</h4>
                <p className="text-[11px] text-slate-400">
                  Haz clic en el botón de menú hamburguesa (o en el lateral izquierdo en pantallas grandes) para ver los 10 módulos con sus insignias de categoría.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Parrilla Interactiva de Inicio</h4>
                <p className="text-[11px] text-slate-400">
                  Desde la pantalla principal, cada tarjeta de color te da acceso directo con un solo clic.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="w-7 h-7 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Barra de Acceso Rápido</h4>
                <p className="text-[11px] text-slate-400">
                  En la parte superior (o inferior en móviles) tienes accesos directos a Precios RD, DineroClaro y más.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Pruébalo ahora mismo:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onNavigateToModule('cazaahorros');
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-[11px] text-emerald-400 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Ir a Precios RD</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToModule('dineroclaro');
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-[11px] text-blue-400 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <Wallet className="w-3 h-3" />
                <span>Ir a DineroClaro</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 3,
      badge: 'Inteligencia Artificial',
      title: 'Cómo usar el Asistente Central IA',
      subtitle: 'Tu asesor personal que conecta los 10 módulos de la SuperApp.',
      icon: Sparkles,
      accentColor: 'from-violet-500 to-fuchsia-500',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            El <span className="text-white font-bold">Asistente Central IA</span> está disponible en todo momento desde el botón con destellos ✨ en la barra superior (o el botón central flotante en celulares).
          </p>

          <div className="bg-slate-900/90 border border-violet-500/20 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
              <Bot className="w-4 h-4 text-violet-400" />
              <span>¿Qué puedes preguntarle?</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 font-bold">•</span>
                <span><strong className="text-white">Precios de supermercados:</strong> &quot;¿Dónde consigo el arroz y el aceite más barato entre Sirena y Bravo?&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 font-bold">•</span>
                <span><strong className="text-white">Consejos financieros:</strong> &quot;Calcula cuánto debo destinar a ahorro con un sueldo de RD$ 45,000.&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 font-bold">•</span>
                <span><strong className="text-white">Navegación inteligente:</strong> Pídele que te lleve a cualquier módulo y lo abrirá por ti.</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAiAssistant();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-violet-950/50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Abrir Asistente Central IA ahora mismo</span>
          </button>
        </div>
      ),
    },
    {
      stepNumber: 4,
      badge: 'Cobertura & Finanzas',
      title: 'Provincias de RD y Gestión Financiera',
      subtitle: 'Diseñado específicamente para el ecosistema dominicano.',
      icon: MapPin,
      accentColor: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            La plataforma incluye soporte oficial para las <span className="text-white font-bold">32 provincias de RD</span> (Distrito Nacional y las 31 provincias), permitiéndote filtrar técnicos, empleos, ofertas y avisos comunitarios exactamente donde te encuentras.
          </p>

          {isOwnerOrAdmin && (
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <DollarSign className="w-4 h-4" />
                <span>Panel de Ganancias y Retiros (Sección 26)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Como Dueño o Administrador autorizado, tienes acceso privado para consultar ingresos en RD$, libro contable digital y tramitar retiros seguros vía transferencia bancaria (Banreservas, Banco Popular, BHD).
              </p>
            </div>
          )}

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl text-[11px] text-slate-400">
            Puedes volver a abrir esta guía en cualquier momento desde el botón de ayuda en la barra superior o desde tu menú de perfil.
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('cazaahorro_tour_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${currentStepData.iconBg} shrink-0`}>
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
                  {currentStepData.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Paso {currentStep + 1} de {steps.length}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {currentStepData.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition cursor-pointer"
            title="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-6 pt-3 pb-1">
          <p className="text-xs text-slate-400 font-medium">
            {currentStepData.subtitle}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 pt-3 flex-1 overflow-y-auto max-h-[60vh]">
          {currentStepData.content}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 px-6 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between gap-4">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-6 bg-emerald-400'
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Ir al paso ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
                isLastStep
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <span>{isLastStep ? '¡Comenzar a explorar!' : 'Siguiente'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
