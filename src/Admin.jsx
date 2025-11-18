import { useEffect, useState } from 'react'
import StorefrontHeader from './components/StorefrontHeader'
import AdminDashboard from './components/AdminDashboard'

export default function Admin() {
  const [tenant, setTenant] = useState(null)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <StorefrontHeader tenant={tenant} onChangeTenant={setTenant} cartCount={0} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AdminDashboard tenant={tenant} />
      </main>
    </div>
  )
}
