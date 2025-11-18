import { useEffect, useState } from 'react'

export default function ProductList({ tenant }) {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!tenant) return
    load()
  }, [tenant])

  const load = async () => {
    try {
      setLoading(true)
      const r = await fetch(`${baseUrl}/api/products?tenant_id=${tenant.id}&q=${encodeURIComponent(query)}`)
      const data = await r.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products..."
          className="bg-slate-800/60 border border-white/10 text-white text-sm rounded px-3 py-2 w-full"
        />
        <button onClick={load} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-3 py-2 rounded">Search</button>
      </div>

      {loading && <p className="text-white/70">Loading...</p>}
      {!loading && products.length === 0 && <p className="text-white/60">No products yet.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-slate-800/60 border border-white/10 rounded-lg p-4">
            <div className="aspect-video bg-slate-700/50 rounded mb-3 flex items-center justify-center text-white/40">
              {p.image ? <img src={p.image} alt={p.title} className="object-cover w-full h-full rounded" /> : 'No image'}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-white font-medium">{p.title}</h3>
                {p.category && <p className="text-xs text-white/50">{p.category}</p>}
              </div>
              <div className="text-emerald-400 font-semibold">${p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
