import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle,
  RotateCcw,
  RefreshCw,
  BrainCircuit
} from 'lucide-react';

export const ProfeIaModule: React.FC = () => {
  const [subject, setSubject] = useState('Matemáticas');
  const [topic, setTopic] = useState('Interés compuesto y préstamos');
  const [question, setQuestion] = useState('¿Cómo se calcula el valor futuro de una inversión con interés compuesto y qué diferencia tiene con el interés simple?');
  const [level, setLevel] = useState('Bachillerato / Universidad');
  const [lessonAnswer, setLessonAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    'Matemáticas',
    'Física',
    'Química',
    'Inglés y Conversación',
    'Historia Dominicana y Universal',
    'Contabilidad y Finanzas Personales',
  ];

  const handleAskTutor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setLessonAnswer(null);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          question,
          level,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setLessonAnswer(data.answer);
      } else {
        setLessonAnswer(data.error || 'No se pudo generar la explicación del tutor.');
      }
    } catch (err) {
      setLessonAnswer('Error de red: La función requiere conexión activa a Internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ProfeIA — Tutor Educativo con Inteligencia Artificial</h2>
            <p className="text-xs text-slate-400">
              Explicaciones paso a paso, ejercicios interactivos y preparación para exámenes
            </p>
          </div>
        </div>

        {/* Form controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Materia:</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white outline-none focus:border-violet-500"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nivel Académico:</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white outline-none focus:border-violet-500"
            >
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Bachillerato / Universidad">Bachillerato / Universidad</option>
              <option value="Profesional / Libre">Profesional / Adultos</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tema Principal:</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ej. Ecuaciones cuadráticas, Geometría..."
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-2.5 text-white outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Main interaction */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <form onSubmit={handleAskTutor} className="space-y-3">
          <label className="block text-xs font-bold text-white flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-violet-400" />
            <span>¿Qué duda o ejercicio deseas que ProfeIA te explique?</span>
          </label>
          <textarea
            rows={3}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Escribe tu ejercicio, duda de examen o pide una lección detallada..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl p-4 text-xs md:text-sm text-white outline-none leading-relaxed transition"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-violet-900/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ProfeIA está redactando tu lección...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Explicación Pedagógica</span>
                </>
              )}
            </button>
          </div>
        </form>

        {lessonAnswer && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <span>Lección de ProfeIA ({subject})</span>
              </span>
              <span className="text-[11px] text-slate-400">Nivel: {level}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {lessonAnswer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
