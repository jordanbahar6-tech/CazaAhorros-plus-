import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  CheckCircle,
  FileCheck,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { JobListing } from '../../types';
import { DOMINICAN_PROVINCES } from '../../constants/provinces';

export const EmpleoYaModule: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [search, setSearch] = useState('');
  const [modalityFilter, setModalityFilter] = useState('Todos');
  const [provinceFilter, setProvinceFilter] = useState('Todas');
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/modules/empleoya/jobs')
      .then(res => res.json())
      .then(d => setJobs(d.jobs || []))
      .catch(console.error);
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchesMod = modalityFilter === 'Todos' || j.modality === modalityFilter;
    const matchesProv =
      provinceFilter === 'Todas' ||
      j.location.toLowerCase().includes(provinceFilter.toLowerCase());
    return matchesSearch && matchesMod && matchesProv;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">EmpleoYa — Empleo en las 32 Provincias de RD</h2>
            <p className="text-xs text-slate-400">
              Vacantes verificadas en toda la República Dominicana con rangos salariales transparentes en RD$
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar puesto, empresa o tecnología (ej. Frontend, Contador, Compras)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-white outline-none"
            />
          </div>

          <select
            value={provinceFilter}
            onChange={e => setProvinceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-2xl px-4 py-3 text-white outline-none font-semibold min-w-[200px]"
          >
            <option value="Todas">🇩🇴 Todas las Provincias</option>
            {DOMINICAN_PROVINCES.map(prov => (
              <option key={prov.id} value={prov.name}>
                {prov.name}
              </option>
            ))}
          </select>

          <select
            value={modalityFilter}
            onChange={e => setModalityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-2xl px-4 py-3 text-white outline-none font-semibold"
          >
            <option value="Todos">Todas las modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-full">
                    {job.modality}
                  </span>
                  {job.verified && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      <span>Empresa Verificada</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{job.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{job.company}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{job.location}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block">Salario publicado:</span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">
                  {job.salaryRangeDOP}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{job.experience}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.requirements.map((req, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[11px] border border-slate-800">
                  {req}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Publicado: {job.postedAt}</span>
              {appliedJobId === job.id ? (
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Postulación enviada</span>
                </span>
              ) : (
                <button
                  onClick={() => setAppliedJobId(job.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md"
                >
                  Postularme con Currículum CazaAhorro
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
