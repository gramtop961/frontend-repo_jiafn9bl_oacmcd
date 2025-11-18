import { useEffect, useState } from 'react'

export default function Header({ tenant, onChangeTenant }) {
  const [tenantId, setTenantId] = useState(tenant?.id || '')
  const [tenants, setTenants] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/tenants`)
      .then(r => r.json())
      .then(setTenants)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const found = tenants.find(t => t.id === tenantId)
    if (found) onChangeTenant(found)
  }, [tenantId, tenants])

  return (
    <header className="w-full border-b border-white/10 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center text-slate-900 font-black">D</div>
          <div>
            <h1 className="text-white font-semibold leading-tight">DailyBudgetMart</h1>
            <p className="text-xs text-white/60 -mt-0.5">Multi-tenant commerce</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            className="bg-slate-800 text-white text-sm rounded px-3 py-2 border border-white/10"
          >
            <option value="">Select tenant</option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} {t.domain ? `• ${t.domain}` : ''}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
