import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCheck,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  ScanText
} from 'lucide-react';
import { DocumentTemplate } from '../../types';

export const DocuFacilModule: React.FC = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrAnalysis, setOcrAnalysis] = useState<string | null>(null);
  const [isAnalyzingOcr, setIsAnalyzingOcr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/modules/docufacil/templates')
      .then(res => res.json())
      .then(d => {
        setTemplates(d.templates || []);
        if (d.templates && d.templates.length > 0) {
          setSelectedTemplate(d.templates[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleFieldChange = (name: string, val: string) => {
    setFormValues({ ...formValues, [name]: val });
  };

  const handleGenerateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    let doc = `DOCUMENTO LEGAL Y COMERCIAL — CTI-RD-${Date.now().toString().slice(-6)}\n`;
    doc += `TÍTULO: ${selectedTemplate.title.toUpperCase()}\n`;
    doc += `FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-DO')}\n`;
    doc += `JURISDICCIÓN: República Dominicana\n\n`;
    doc += `--------------------------------------------------------\n`;

    selectedTemplate.fields.forEach(f => {
      doc += `${f.label.toUpperCase()}: ${formValues[f.name] || '[PENDIENTE]'}\n`;
    });

    doc += `\nCLÁUSULA DE CUMPLIMIENTO:\nLas partes convienen regirse por las leyes de la República Dominicana, en especial el Código Civil y la legislación aplicable a contratos y documentos solemnes. En fe de lo cual se formaliza en la ciudad de Santo Domingo.\n\n`;
    doc += `_______________________            _______________________\n`;
    doc += `Firma de la Parte Emisora          Firma de la Contraparte`;

    setGeneratedDoc(doc);
  };

  const handleRunOcr = async () => {
    if (!ocrText.trim() || isAnalyzingOcr) return;
    setIsAnalyzingOcr(true);
    setOcrAnalysis(null);
    try {
      const res = await fetch('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'Documento o Contrato Dominicano',
          textContent: ocrText,
        }),
      });
      const data = await res.json();
      setOcrAnalysis(data.analysis || 'Análisis finalizado sin observaciones.');
    } catch (e) {
      setOcrAnalysis('Error de conexión con el servicio de IA.');
    } finally {
      setIsAnalyzingOcr(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">DocuFácil — Documentos Digitales y Plantillas en RD</h2>
            <p className="text-xs text-slate-400">
              Generador de contratos legales dominicanos (alquiler, pagarés, cotizaciones) y analizador OCR inteligente
            </p>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {templates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => {
                setSelectedTemplate(tpl);
                setGeneratedDoc(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedTemplate?.id === tpl.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Template Generator */}
        {selectedTemplate && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">{selectedTemplate.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedTemplate.description}</p>
            </div>

            <form onSubmit={handleGenerateContract} className="space-y-3 text-xs">
              {selectedTemplate.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-slate-300 font-medium mb-1">{field.label}:</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formValues[field.name] || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition shadow-md"
              >
                Generar Documento Formal
              </button>
            </form>

            {generatedDoc && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Documento Generado:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedDoc);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-2.5 py-1 bg-slate-800 text-white text-[11px] rounded-lg flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={generatedDoc}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Right: OCR & Clause Intelligence */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ScanText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Analizador de Documentos y OCR con IA</h3>
              <p className="text-xs text-slate-400">Pega texto de contratos, recibos o facturas para auditoría legal</p>
            </div>
          </div>

          <textarea
            rows={5}
            value={ocrText}
            onChange={e => setOcrText(e.target.value)}
            placeholder="Pega aquí el texto escaneado de un contrato o cotización..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-cyan-500"
          />

          <button
            onClick={handleRunOcr}
            disabled={isAnalyzingOcr || !ocrText.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzingOcr ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extrayendo cláusulas y montos...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Auditar Documento con Gemini</span>
              </>
            )}
          </button>

          {ocrAnalysis && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {ocrAnalysis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
