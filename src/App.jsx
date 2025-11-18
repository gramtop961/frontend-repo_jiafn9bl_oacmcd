import { useEffect, useState } from 'react'
import Header from './components/Header'
import ProductList from './components/ProductList'
import AdminPanel from './components/AdminPanel'

function App() {
  const [tenant, setTenant] = useState(null)

  useEffect(() => {
    // Auto-select first tenant if available
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    fetch(`${baseUrl}/api/tenants`).then(r => r.json()).then(list => {
      if (list && list.length > 0) setTenant(list[0])
    }).catch(() => {})
  }, [])

  const handleTenantChange = (t) => setTenant(t)

  const onTenantCreated = async (id) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const r = await fetch(`${baseUrl}/api/tenants`)
    const list = await r.json()
    const created = list.find(t => t.id === id)
    if (created) setTenant(created)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header tenant={tenant} onChangeTenant={handleTenantChange} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="text-center py-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">DailyBudgetMart</h2>
          <p className="text-white/70 mt-2">A lightweight multi-tenant e‑commerce platform you can spin up anywhere.</p>
        </section>

        <AdminPanel tenant={tenant} onTenantCreated={onTenantCreated} />
        <ProductList tenant={tenant} />

        <section className="mt-8 text-center text-white/50 text-sm">
          <p>Use the Admin section to create a store and add products. Then select the store at the top.</p>
        </section>
      </main>
    </div>
  )
}

export default App
