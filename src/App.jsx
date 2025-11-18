import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import StorefrontHeader from './components/StorefrontHeader'
import StorefrontHome from './components/StorefrontHome'
import ProductPage from './components/ProductPage'
import Cart from './components/Cart'
import AdminPanel from './components/AdminPanel'

function App() {
  const [tenant, setTenant] = useState(null)
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-select first tenant if available
    fetch(`${baseUrl}/api/tenants`).then(r => r.json()).then(list => {
      if (list && list.length > 0) setTenant(list[0])
    }).catch(() => {})
  }, [])

  const cartCount = useMemo(() => cart.reduce((s, it) => s + it.quantity, 0), [cart])

  const addToCart = (p, qty) => {
    setCart(prev => {
      const existing = prev.find(x => x.id === p.id)
      if (existing) {
        return prev.map(x => x.id === p.id ? { ...x, quantity: x.quantity + qty } : x)
      }
      return [...prev, { ...p, quantity: qty }]
    })
  }

  const updateQty = (id, qty) => {
    setCart(prev => prev.map(x => x.id === id ? { ...x, quantity: qty } : x))
  }

  const checkout = async (coupon) => {
    if (!tenant || cart.length === 0) return
    const items = cart.map(it => ({ product_id: it.id, quantity: it.quantity }))
    const payload = { tenant_id: tenant.id, items, coupon_code: coupon || undefined }
    const r = await fetch(`${baseUrl}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await r.json()
    if (r.ok) {
      alert(`Order placed! Total: $${data.total}`)
      setCart([])
      navigate('/')
    } else {
      alert(data.detail || 'Checkout failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <StorefrontHeader tenant={tenant} onChangeTenant={setTenant} cartCount={cartCount} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            selected ? (
              <ProductPage product={selected} onBack={() => setSelected(null)} onAddToCart={addToCart} />
            ) : (
              <>
                <section className="text-center py-6">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">DailyBudgetMart</h2>
                  <p className="text-white/70 mt-2">A lightweight multi‑tenant e‑commerce platform you can spin up anywhere.</p>
                </section>
                <StorefrontHome tenant={tenant} onSelectProduct={setSelected} onAddToCart={addToCart} />
                <section className="mt-8 text-center text-white/50 text-sm">
                  <p>Use the Admin section to create a store and add products. Then select the store at the top.</p>
                </section>
              </>
            )
          } />
          <Route path="/cart" element={<Cart tenant={tenant} items={cart} onUpdateQty={updateQty} onCheckout={checkout} />} />
          <Route path="/admin" element={<AdminPanel tenant={tenant} onTenantCreated={(id)=>{}} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
