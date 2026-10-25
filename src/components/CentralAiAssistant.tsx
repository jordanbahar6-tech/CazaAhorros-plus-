import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShoppingBag,
  Briefcase,
  HelpCircle,
  Minimize2,
  Maximize2,
  RefreshCw,
  Compass
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentModule: string;
  onNavigateToModule: (moduleId: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const CentralAiAssistant: React.FC<Props> = ({
  isOpen,
  onClose,
  currentModule,
  onNavigateToModule,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '¡Hola! Soy tu Asistente Central de CazaAhorro. Conecto los 10 módulos de la superapp: comparar precios en supermercados dominicanos (Sirena, Bravo, Jumbo), cotizar servicios en CercaRD, tutorías de ProfeIA, cálculo de presupuestos en DineroClaro, ofertas relámpago y más. ¿En qué te ayudo a ahorrar o gestionar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages.slice(-6).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          currentModule,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.message || 'Lo siento, ocurrió un error temporal conectando con el servicio de IA.',
          },
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error de red: La función requiere conexión activa a Internet.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '¿Dónde está más barato el arroz y aceite hoy?',
    'Dame una misión de ahorro de RD$ 2,000 para esta semana',
    '¿Qué técnico de A/C me recomiendas en Santo Domingo?',
    'Explícame cómo funciona el cálculo de retiros ACH Banreservas',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>Asistente CazaAhorro</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400">
                IA Real
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Enlazado a los 10 módulos de la superapp</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm whitespace-pre-wrap'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Consultando inteligencia de ahorro y módulos...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu consulta o decisión de compra..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition shadow-md shadow-emerald-900/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
