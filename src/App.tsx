/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
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
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
  ChevronRight,
  RefreshCw,
  Compass,
  HelpCircle
} from 'lucide-react';
import { User } from './types';
import { OnlineSentinel } from './components/OnlineSentinel';
import { AuthScreen } from './components/auth/AuthScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CentralAiAssistant } from './components/CentralAiAssistant';
import { QuickTourModal } from './components/QuickTourModal';
import { EarningsAndWithdrawalsPanel } from './components/financial/EarningsAndWithdrawalsPanel';
import { CazaAhorrosModule } from './components/modules/CazaAhorrosModule';
import { CercaRdModule } from './components/modules/CercaRdModule';
import { DineroClaroModule } from './components/modules/DineroClaroModule';
import { ProfeIaModule } from './components/modules/ProfeIaModule';
import { TodoKitModule } from './components/modules/TodoKitModule';
import { EmpleoYaModule } from './components/modules/EmpleoYaModule';
import { ViralLabModule } from './components/modules/ViralLabModule';
import { UltimaOfertaModule } from './components/modules/UltimaOfertaModule';
import { DocuFacilModule } from './components/modules/DocuFacilModule';
import { MiBarrioModule } from './components/modules/MiBarrioModule';
import { ExclusiveFeaturesModal } from './components/modules/ExclusiveFeaturesModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeModule, setActiveModule] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isExclusiveModalOpen, setIsExclusiveModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Check persistent session on startup
  useEffect(() => {
    const token = localStorage.getItem('cazaahorro_token');
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Sesión expirada');
        return res.json();
      })
      .then(d => {
        if (d.user) {
          setCurrentUser(d.user);
          if (!localStorage.getItem('cazaahorro_tour_seen')) {
            setIsTourOpen(true);
          }
        } else {
          localStorage.removeItem('cazaahorro_token');
          setCurrentUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('cazaahorro_token');
        setCurrentUser(null);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, []);

  const handleLoginSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setActiveModule('home');
    if (!localStorage.getItem('cazaahorro_tour_seen')) {
      setIsTourOpen(true);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('cazaahorro_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('cazaahorro_token');
    setCurrentUser(null);
  };

  // Loading screen during initial token check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-lg">
              CA
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">Iniciando base de datos y sesión segura...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login / Register screen at startup!
  if (!currentUser) {
    return (
      <>
        <OnlineSentinel />
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  const modulesList = [
    {
      id: 'cazaahorros',
      num: '1',
      title: 'CazaAhorros',
      subtitle: 'Comparador de Precios en RD',
      desc: 'Compara precios en Sirena, Jumbo, Bravo, Nacional, Colmados y Farmacias Carol con lista inteligente.',
      icon: ShoppingBag,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      tag: 'Ahorro Canasta',
    },
    {
      id: 'cercard',
      num: '2',
      title: 'CercaRD',
      subtitle: 'Servicios & Técnicos Locales',
      desc: 'Plomeros, técnicos de A/C inverter, electricistas y salones verificados con cotizaciones y WhatsApp.',
      icon: MapPin,
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400',
      tag: 'Servicios RD',
    },
    {
      id: 'dineroclaro',
      num: '3',
      title: 'DineroClaro',
      subtitle: 'Finanzas Personales en RD$',
      desc: 'Registro de gastos, caja negra del presupuesto y radar inteligente de micro-fugas de dinero.',
      icon: Wallet,
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400',
      tag: 'Presupuesto',
    },
    {
      id: 'profeia',
      num: '4',
      title: 'ProfeIA',
      subtitle: 'Tutor Educativo con IA',
      desc: 'Explicaciones paso a paso, ejercicios interactivos de matemáticas, física, química e inglés.',
      icon: GraduationCap,
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400',
      tag: 'Educación IA',
    },
    {
      id: 'todokit',
      num: '5',
      title: 'TodoKit',
      subtitle: 'Caja de Herramientas Online',
      desc: 'Tasas de cambio oficiales DOP/USD/EUR, calculadora de ITBIS 18%, generador QR y contraseñas.',
      icon: Wrench,
      color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/30 text-teal-400',
      tag: 'Utilidades',
    },
    {
      id: 'empleoya',
      num: '6',
      title: 'EmpleoYa',
      subtitle: 'Bolsa de Empleo en RD',
      desc: 'Vacantes verificadas en Santo Domingo, Santiago y zonas francas con rangos salariales transparentes.',
      icon: Briefcase,
      color: 'from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-400',
      tag: 'Carrera & Trabajo',
    },
    {
      id: 'virallab',
      num: '7',
      title: 'ViralLab',
      subtitle: 'Estudio de Contenido con IA',
      desc: 'Generador de guiones y ganchos de 3 segundos para TikTok, Reels y YouTube Shorts.',
      icon: Video,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
      tag: 'Marketing & Redes',
    },
    {
      id: 'ultimaoferta',
      num: '8',
      title: 'ÚltimaOferta',
      subtitle: 'Mercado de Descuentos & Merma',
      desc: 'Excedentes, panaderías y productos con hasta 60% de descuento con reserva online para recogida.',
      icon: Tag,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      tag: 'Liquidación',
    },
    {
      id: 'docufacil',
      num: '9',
      title: 'DocuFácil',
      subtitle: 'Documentos & Plantillas RD',
      desc: 'Contratos de alquiler, pagarés notariales, cotizaciones y auditoría de documentos con OCR.',
      icon: FileText,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      tag: 'Legal & Negocios',
    },
    {
      id: 'mibarrio',
      num: '10',
      title: 'MiBarrio',
      subtitle: 'Comunidad Vecinal',
      desc: 'Alertas vecinales por sector, mascotas extraviadas, recomendaciones de vecinos y compraventa segura.',
      icon: Users,
      color: 'from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-400',
      tag: 'Vecindad',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Strict Online Monitor (Requirement 16) */}
      <OnlineSentinel />

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={mod => setActiveModule(mod)}
        onOpenTour={() => setIsTourOpen(true)}
        activeModule={activeModule}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeModule={activeModule}
          onNavigate={mod => setActiveModule(mod)}
          currentUser={currentUser}
          onOpenExclusiveFeatures={() => setIsExclusiveModalOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-full">
          {/* SPECIAL SECTION 26: Ganancias y Retiros */}
          {activeModule === 'finanzas_admin' && (
            <EarningsAndWithdrawalsPanel
              currentUser={currentUser}
              onOpenNotifications={() => setIsNotificationOpen(true)}
            />
          )}

          {/* MODULE 1: CazaAhorros */}
          {activeModule === 'cazaahorros' && <CazaAhorrosModule />}

          {/* MODULE 2: CercaRD */}
          {activeModule === 'cercard' && <CercaRdModule />}

          {/* MODULE 3: DineroClaro */}
          {activeModule === 'dineroclaro' && <DineroClaroModule />}

          {/* MODULE 4: ProfeIA */}
          {activeModule === 'profeia' && <ProfeIaModule />}

          {/* MODULE 5: TodoKit */}
          {activeModule === 'todokit' && <TodoKitModule />}

          {/* MODULE 6: EmpleoYa */}
          {activeModule === 'empleoya' && <EmpleoYaModule />}

          {/* MODULE 7: ViralLab */}
          {activeModule === 'virallab' && <ViralLabModule />}

          {/* MODULE 8: ÚltimaOferta */}
          {activeModule === 'ultimaoferta' && <UltimaOfertaModule />}

          {/* MODULE 9: DocuFácil */}
          {activeModule === 'docufacil' && <DocuFacilModule />}

          {/* MODULE 10: MiBarrio */}
          {activeModule === 'mibarrio' && <MiBarrioModule />}

          {/* HOME SUPERAPP HUB */}
          {activeModule === 'home' && (
            <div className="space-y-8 pb-16">
              {/* Hero Banner with Brand Colors: Midnight Blue, Violet, Lime Green */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 md:p-10 shadow-2xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plataforma Oficial de Ahorro y Gestión</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    Bienvenido, {currentUser.name.split(' ')[0]}. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                      10 Aplicaciones en 1 Sola Plataforma Online.
                    </span>
                  </h1>

                  <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                    Comparador de precios en supermercados, directorio de servicios certificados en RD, finanzas en pesos dominicanos, tutor con IA, bolsa de empleo y mercado de ofertas.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveModule('cazaahorros')}
                      className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Comparar Precios Sirena / Bravo / Jumbo</span>
                    </button>

                    <button
                      onClick={() => setIsAiAssistantOpen(true)}
                      className="px-5 py-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-white font-bold text-xs md:text-sm transition flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Abrir Asistente Central IA</span>
                    </button>

                    <button
                      onClick={() => setIsTourOpen(true)}
                      className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 font-bold text-xs md:text-sm transition flex items-center gap-2 cursor-pointer shadow-sm"
                      title="Repasar la guía interactiva"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Guía Rápida / Tour</span>
                    </button>
                  </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* SECTION 26 HERO SHORTCUT FOR OWNER & ADMINS */}
              {currentUser.permissions.canViewFinancials && (
                <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Sección 26 Privada
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                          Acceso Autorizado ({currentUser.role})
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Panel de Ganancias y Retiros de la Plataforma
                      </h3>
                      <p className="text-xs text-slate-300">
                        Consulta ingresos verificados, balance disponible en RD$, libro contable digital y retiros ACH Banreservas / Popular.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModule('finanzas_admin')}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs md:text-sm transition shadow-md whitespace-nowrap self-start md:self-auto"
                  >
                    <span>Abrir Panel Financiero</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 10 MODULES GRID */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Los 10 Módulos de CazaAhorro</h2>
                    <p className="text-xs text-slate-400">Accede directamente a cada una de las herramientas de la plataforma</p>
                  </div>
                  <button
                    onClick={() => setIsExclusiveModalOpen(true)}
                    className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ver Funciones Diferenciadoras</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {modulesList.map(mod => {
                    const Icon = mod.icon;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setActiveModule(mod.id)}
                        className={`p-5 rounded-3xl bg-gradient-to-b ${mod.color} border hover:border-emerald-400/60 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 hover:-translate-y-1 shadow-lg shadow-slate-950/40`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
                              {mod.tag}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition">
                            {mod.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {mod.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-emerald-400 transition">
                          <span>Entrar al módulo</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl md:hidden px-2 py-1.5 flex items-center justify-around text-[10px]">
        <button
          onClick={() => setActiveModule('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeModule === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setActiveModule('cazaahorros')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeModule === 'cazaahorros' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Precios</span>
        </button>

        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 text-indigo-400 font-bold"
        >
          <div className="w-7 h-7 -mt-4 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Asistente</span>
        </button>

        <button
          onClick={() => setActiveModule('dineroclaro')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeModule === 'dineroclaro' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Dinero</span>
        </button>

        {currentUser.permissions.canViewFinancials ? (
          <button
            onClick={() => setActiveModule('finanzas_admin')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
              activeModule === 'finanzas_admin' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Retiros</span>
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 text-slate-400"
          >
            <Layers className="w-4 h-4" />
            <span>Módulos</span>
          </button>
        )}
      </nav>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectWithdrawal={wId => {
          setActiveModule('finanzas_admin');
        }}
      />

      {/* Central AI Assistant */}
      <CentralAiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        currentModule={activeModule}
        onNavigateToModule={mod => setActiveModule(mod)}
      />

      {/* Quick Tour / Fast Guide Modal */}
      <QuickTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateToModule={mod => setActiveModule(mod)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        isOwnerOrAdmin={Boolean(currentUser.permissions.canViewFinancials)}
      />

      {/* Exclusive Features Modal */}
      <ExclusiveFeaturesModal
        isOpen={isExclusiveModalOpen}
        onClose={() => setIsExclusiveModalOpen(false)}
      />
    </div>
  );
}
