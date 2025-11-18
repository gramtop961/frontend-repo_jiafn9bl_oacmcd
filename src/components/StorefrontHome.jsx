import { useEffect, useState } from 'react'

export default function StorefrontHome({ tenant, onSelectProduct, onAddToCart }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [theme, setTheme] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!tenant) return
    fetch(`${baseUrl}/api/theme?tenant_id=${tenant.id}`).then(r => r.json()).then(setTheme).catch(() => {})
    fetch(`${baseUrl}/api/products?tenant_id=${tenant.id}`).then(r => r.json()).then(setProducts).catch(() => {})
  }, [tenant])

  if (!tenant) {
    return <div className="text-white/70 text-center py-10">Select a store to start shopping.</div>
  }

  return (
    <div>
      <section className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="px-6 py-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{color: theme?.primary_color || '#34d399'}}>{theme?.hero_heading || 'Shop smart. Save more.'}</h2>
          <p className="text-white/70 mt-2">{theme?.hero_subtext || 'Daily deals across every category.'}</p>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Featured products</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-slate-800/60 border border-white/10 rounded-lg p-4 hover:border-emerald-400/40 transition">
              <div className="aspect-video bg-slate-700/50 rounded mb-3 flex items-center justify-center text-white/40 cursor-pointer" onClick={() => onSelectProduct(p)}>
                {p.image ? <img src={p.image} alt={p.title} className="object-cover w-full h-full rounded" /> : 'No image'}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button onClick={() => onSelectProduct(p)} className="text-left text-white font-medium hover:underline">{p.title}</button>
                  {p.category && <p className="text-xs text-white/50">{p.category}</p>}
                </div>
                <div className="text-emerald-400 font-semibold">${p.price}</div>
              </div>
              <button onClick={() => onAddToCart(p, 1)} className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-3 py-2 rounded">Add to cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
