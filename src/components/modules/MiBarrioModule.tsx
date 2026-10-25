import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Search,
  PlusCircle,
  ThumbsUp,
  MapPin,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';
import { NeighborhoodPost } from '../../types';
import { DOMINICAN_PROVINCES } from '../../constants/provinces';

export const MiBarrioModule: React.FC = () => {
  const [posts, setPosts] = useState<NeighborhoodPost[]>([]);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<any>('alerta');
  const [newProvince, setNewProvince] = useState('Distrito Nacional');
  const [newSector, setNewSector] = useState('Bella Vista');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/modules/mibarrio/posts');
      if (res.ok) {
        const d = await res.json();
        setPosts(d.posts || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const token = localStorage.getItem('cazaahorro_token') || '';
      const res = await fetch('/api/modules/mibarrio/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          sector: `${newSector}, ${newProvince}`,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setPosts(d.posts);
        setShowNewPostModal(false);
        setNewTitle('');
        setNewContent('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesCat = filterCat === 'all' || p.category === filterCat;
    const matchesProv = selectedProvince === 'Todas' || p.sector.toLowerCase().includes(selectedProvince.toLowerCase());
    return matchesCat && matchesProv;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">MiBarrio — Red Vecinal en las 32 Provincias de RD</h2>
            <p className="text-xs text-slate-400">
              Alertas comunitarias, objetos extraviados y avisos vecinales en cada rincón de República Dominicana
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-md whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Publicar en Mi Sector</span>
        </button>
      </div>

      {/* Province and Category filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <select
          value={selectedProvince}
          onChange={e => setSelectedProvince(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs rounded-2xl px-4 py-2.5 text-white outline-none font-semibold w-full sm:w-auto min-w-[240px]"
        >
          <option value="Todas">🇩🇴 Todas las 32 Provincias de RD</option>
          {DOMINICAN_PROVINCES.map(prov => (
            <option key={prov.id} value={prov.name}>
              {prov.name} ({prov.capital})
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full">
          {[
            { id: 'all', label: 'Todas las Categorías' },
            { id: 'alerta', label: 'Alertas Vecinales' },
            { id: 'objetos_perdidos', label: 'Objetos Extraviados' },
            { id: 'recomendacion', label: 'Recomendaciones' },
            { id: 'compraventa', label: 'Compraventa' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterCat === cat.id ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 hover:border-orange-500/40 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    post.category === 'alerta'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : post.category === 'objetos_perdidos'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {post.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-white">{post.author}</span>
                {post.verifiedCommunityUser && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Residente Verificado</span>
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500">{post.timestamp}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{post.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{post.content}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{post.sector}</span>
              </span>

              <button
                onClick={() => {
                  setPosts(
                    posts.map(p => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 transition"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-orange-400" />
                <span>{post.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Publicar Mensaje en la Comunidad</h3>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej. Aviso sobre servicio de agua o perro encontrado"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoría:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white outline-none"
                  >
                    <option value="alerta">Alerta Vecinal</option>
                    <option value="objetos_perdidos">Objetos Extraviados</option>
                    <option value="recomendacion">Recomendación</option>
                    <option value="compraventa">Compraventa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Provincia (RD):</label>
                  <select
                    value={newProvince}
                    onChange={e => setNewProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white outline-none"
                  >
                    {DOMINICAN_PROVINCES.map(prov => (
                      <option key={prov.id} value={prov.name}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sector o Barrio:</label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={e => setNewSector(e.target.value)}
                    placeholder="Ej. Bella Vista"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Contenido:</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Escribe los detalles de tu publicación..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
