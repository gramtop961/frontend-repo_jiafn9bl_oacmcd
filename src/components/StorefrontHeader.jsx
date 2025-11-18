import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function StorefrontHeader({ tenant, onChangeTenant, cartCount }) {
  const [tenantId, setTenantId] = useState(tenant?.id || '')
  const [tenants, setTenants] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${baseUrl}/api/tenants`).then(r => r.json()).then(setTenants).catch(() => {})
  }, [])

  useEffect(() => {
    const found = tenants.find(t => t.id === tenantId)
    if (found) onChangeTenant(found)
  }, [tenantId, tenants])

  return (
    <header className="w-full border-b border-white/10 bg-slate-900/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center text-slate-900 font-black">D</div>
          <div>
            <h1 className="text-white font-semibold leading-tight">DailyBudgetMart</h1>
            <p className="text-xs text-white/60 -mt-0.5">Multi-tenant commerce</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-white/80 text-sm">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/admin" className="hover:text-white">Admin</Link>
          <a href="/test" className="hover:text-white">Status</a>
        </nav>

        <div className="flex items-center gap-2">
          <select
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            className="bg-slate-800 text-white text-sm rounded px-3 py-2 border border-white/10"
          >
            <option value="">Select tenant</option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}{t.domain ? ` • ${t.domain}` : ''}</option>
            ))}
          </select>
          <button onClick={() => navigate('/cart')} className="relative bg-slate-800/80 text-white rounded px-3 py-2 border border-white/10">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-900 text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
