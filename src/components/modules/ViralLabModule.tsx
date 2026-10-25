import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Flame,
  Hash,
  Clapperboard
} from 'lucide-react';

export const ViralLabModule: React.FC = () => {
  const [platform, setPlatform] = useState<'TikTok' | 'Instagram Reels' | 'YouTube Shorts'>('TikTok');
  const [niche, setNiche] = useState('Ahorro de dinero y ofertas en supermercados');
  const [goal, setGoal] = useState('Viralizar truco de compra inteligente en Sirena');
  const [targetAudience, setTargetAudience] = useState('Jóvenes y amas de casa en RD');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setGeneratedScript(null);

    try {
      const res = await fetch('/api/gemini/virallab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          niche,
          goal,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedScript(data.script);
      } else {
        setGeneratedScript(data.error || 'No se pudo generar el guion viral.');
      }
    } catch (err) {
      setGeneratedScript('Error de conexión a Internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ViralLab — Estudio de Creación de Contenido con IA</h2>
            <p className="text-xs text-slate-400">
              Generador de guiones virales para TikTok, Reels y Shorts con ganchos de alta retención para negocios y creadores
            </p>
          </div>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-2 mt-4">
          {(['TikTok', 'Instagram Reels', 'YouTube Shorts'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                platform === p
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Configuración del Vídeo</span>
          </h3>

          <form onSubmit={handleGenerateScript} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nicho o Tema:</label>
              <input
                type="text"
                value={niche}
                onChange={e => setNiche(e.target.value)}
                placeholder="Ej. Compras baratas, Belleza, Tecnología..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Objetivo del vídeo:</label>
              <input
                type="text"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                placeholder="Ej. Ganar seguidores o vender producto..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Público Objetivo:</label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="Ej. Consumidores en Santo Domingo..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl transition shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diseñando guion viral...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Guion & Hashtags</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Script Preview (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clapperboard className="w-4 h-4 text-indigo-400" />
              <span>Guion Producido para {platform}</span>
            </h3>

            {generatedScript && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedScript);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Guion'}</span>
              </button>
            )}
          </div>

          {generatedScript ? (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {generatedScript}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <Video className="w-10 h-10 mx-auto text-slate-700" />
              <p>Completa los datos y presiona "Generar Guion" para crear un guion estructurado con ganchos y notas de dirección de cámara.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
