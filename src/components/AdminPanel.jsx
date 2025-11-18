import { useEffect, useMemo, useState } from 'react'

export default function AdminPanel({ tenant, onTenantCreated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ name: '', domain: '', plan: 'free', contact_email: '' })
  const [product, setProduct] = useState({ title: '', price: '', image: '', stock: '', category: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [adding, setAdding] = useState(false)

  const disabled = useMemo(() => !form.name, [form])

  const createTenant = async () => {
    try {
      setCreating(true)
      const r = await fetch(`${baseUrl}/api/tenants`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await r.json()
      onTenantCreated(data.id)
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  const addProduct = async () => {
    if (!tenant) return
    try {
      setAdding(true)
      const payload = { ...product, tenant_id: tenant.id, price: parseFloat(product.price || '0'), stock: parseInt(product.stock || '0', 10) }
      const r = await fetch(`${baseUrl}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      await r.json()
      setProduct({ title: '', price: '', image: '', stock: '', category: '', description: '' })
      alert('Product added')
    } catch (e) {
      console.error(e)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Admin</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-white/70 mb-2">Create a new store</p>
          <div className="grid grid-cols-2 gap-2">
            <input className="col-span-2 bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Business name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Domain (optional)" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} />
            <input className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Contact email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
            <select className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
            </select>
          </div>
          <button onClick={createTenant} disabled={disabled || creating} className="mt-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-900 font-semibold text-sm px-3 py-2 rounded">{creating ? 'Creating...' : 'Create store'}</button>
        </div>

        <div>
          <p className="text-white/70 mb-2">Quick add product {tenant ? `(for ${tenant.name})` : ''}</p>
          <div className="grid grid-cols-2 gap-2">
            <input className="col-span-2 bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Title" value={product.title} onChange={e => setProduct({ ...product, title: e.target.value })} />
            <input className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Price" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} />
            <input className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Stock" value={product.stock} onChange={e => setProduct({ ...product, stock: e.target.value })} />
            <input className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Category" value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })} />
            <input className="col-span-2 bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Image URL" value={product.image} onChange={e => setProduct({ ...product, image: e.target.value })} />
            <textarea className="col-span-2 bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" placeholder="Description" value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} />
          </div>
          <button onClick={addProduct} disabled={!tenant || adding} className="mt-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-900 font-semibold text-sm px-3 py-2 rounded">{adding ? 'Adding...' : 'Add product'}</button>
        </div>
      </div>
    </div>
  )
}
