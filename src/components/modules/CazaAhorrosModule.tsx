import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Trash2,
  TrendingDown,
  Sparkles,
  Barcode,
  CheckCircle,
  Building2,
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';
import { StoreProduct, ShoppingItem } from '../../types';
import { DOMINICAN_PROVINCES } from '../../constants/provinces';

export const CazaAhorrosModule: React.FC = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('Distrito Nacional');
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: 'item_1', name: 'Arroz Selecto Grano Largo (Funda 10 lbs)', quantity: 1, selectedStore: 'Sirena', estimatedPrice: 385.0 },
    { id: 'item_2', name: 'Aceite de Soya Puro Criollo 128 oz (Galón)', quantity: 1, selectedStore: 'Bravo', estimatedPrice: 529.0 },
    { id: 'item_3', name: 'Leche Entera UHT 1 Litro (Caja)', quantity: 4, selectedStore: 'Bravo', estimatedPrice: 78.0 },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  useEffect(() => {
    fetch('/api/modules/cazaahorros/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addItemToShoppingList = (product: StoreProduct) => {
    const minPrice = Math.min(...product.prices.map(p => p.price));
    const store = product.prices.find(p => p.price === minPrice)?.storeName || 'Sirena';
    const newItem: ShoppingItem = {
      id: `item_${Date.now()}`,
      name: product.name,
      quantity: 1,
      selectedStore: store,
      estimatedPrice: minPrice,
    };
    setShoppingList([...shoppingList, newItem]);
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  // Calculate totals by supermarket
  const stores = ['Supermercados Sirena', 'Bravo Churchill', 'Jumbo Luperón'];
  const storeTotals = stores.map(storeName => {
    let total = 0;
    shoppingList.forEach(item => {
      // Find product price in store
      const prod = products.find(p => p.name === item.name);
      if (prod) {
        const storePrice = prod.prices.find(p => p.storeName.includes(storeName.split(' ')[0]))?.price || item.estimatedPrice;
        total += storePrice * item.quantity;
      } else {
        total += item.estimatedPrice * item.quantity;
      }
    });
    return { storeName, total };
  }).sort((a, b) => a.total - b.total);

  const bestStore = storeTotals[0];
  const mostExpensiveStore = storeTotals[storeTotals.length - 1];
  const potentialSavings = mostExpensiveStore ? mostExpensiveStore.total - (bestStore ? bestStore.total : 0) : 0;

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">CazaAhorros — Comparador Inteligente de Precios</h2>
            <p className="text-xs text-slate-400">
              Supermercados Sirena, Jumbo, Bravo, Nacional, Colmados y Farmacias Carol de República Dominicana
            </p>
          </div>
        </div>

        {/* Search Bar & Province Selector */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto o marca (ej. Arroz, Aceite, Leche)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-white outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="bg-transparent text-white outline-none font-semibold cursor-pointer max-w-[200px]"
            >
              {DOMINICAN_PROVINCES.map(prov => (
                <option key={prov.id} value={prov.name} className="bg-slate-900 text-white">
                  {prov.name} ({prov.region})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Precios Verificados en Tiempo Real</span>
            <span className="text-xs text-slate-400 font-normal">{filteredProducts.length} productos</span>
          </h3>

          <div className="space-y-3">
            {filteredProducts.map(product => {
              const prices = product.prices.map(p => p.price);
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);

              return (
                <div
                  key={product.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 hover:border-emerald-500/40 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{product.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Barcode className="w-3.5 h-3.5" />
                        <span className="font-mono">{product.barcode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Mejor precio:</span>
                        <span className="text-lg font-extrabold text-emerald-400">
                          RD$ {minPrice.toFixed(2)}
                        </span>
                        {minPrice < maxPrice && (
                          <span className="text-[10px] text-rose-400 line-through block">
                            Hasta RD$ {maxPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addItemToShoppingList(product)}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md"
                        title="Añadir a mi lista de compras"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Store Prices breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60">
                    {product.prices.map((st, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-xl text-xs border ${
                          st.price === minPrice
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 truncate">{st.storeName}</span>
                          {st.verified && <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />}
                        </div>
                        <p className={`font-bold mt-0.5 ${st.price === minPrice ? 'text-emerald-300' : 'text-slate-200'}`}>
                          RD$ {st.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Cheaper Alternative Recommendation */}
                  {product.cheaperAlternative && (
                    <div className="p-2.5 bg-gradient-to-r from-emerald-950/40 to-slate-950 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-slate-300 font-medium">Alternativa inteligente: </span>
                          <strong className="text-white">{product.cheaperAlternative.name}</strong>
                          <span className="text-slate-400 block text-[11px]">En {product.cheaperAlternative.store} por RD$ {product.cheaperAlternative.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] whitespace-nowrap">
                        Ahorras {product.cheaperAlternative.savingsPercent}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shopping List & Store Total Comparator (1 col) */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Lista de Compras Inteligente</span>
              </h3>
              <span className="text-xs text-slate-400">{shoppingList.length} ítems</span>
            </div>

            {/* List items */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {shoppingList.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="font-bold text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Cant: {item.quantity} • RD$ {(item.estimatedPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeShoppingItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Comparison by Supermarket */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Total Comparado por Establecimiento:</span>
              <div className="space-y-1.5">
                {storeTotals.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      idx === 0
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-white">{st.storeName}</span>
                    </div>
                    <span className={`font-extrabold ${idx === 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      RD$ {st.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {potentialSavings > 0 && (
                <div className="p-3 bg-gradient-to-r from-emerald-950/60 to-slate-950 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span>Ahorro total estimado:</span>
                  </div>
                  <span>RD$ {potentialSavings.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
