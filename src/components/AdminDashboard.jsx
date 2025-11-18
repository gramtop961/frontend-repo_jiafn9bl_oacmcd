import { useEffect, useMemo, useState } from 'react'
import AdminPanel from './AdminPanel'

export default function AdminDashboard({ tenant }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const [auth, setAuth] = useState({ email: '', password: '', token: null, role: null })
  const [view, setView] = useState('overview')
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [coupons, setCoupons] = useState([])
  const [theme, setTheme] = useState(null)
  const [couponForm, setCouponForm] = useState({ code: '', percent_off: '', amount_off: '' })
  const [adminForm, setAdminForm] = useState({ email: '', password: '', role: 'owner' })
  const [webhooks, setWebhooks] = useState([])
  const [webhookForm, setWebhookForm] = useState({ url: '', events: 'order.created' })

  const canManage = useMemo(() => !!auth.token, [auth])

  useEffect(() => {
    if (!tenant) return
    loadAll()
  }, [tenant])

  const loadAll = async () => {
    try {
      const [p, c, o, cp, th, wh] = await Promise.all([
        fetch(`${baseUrl}/api/products?tenant_id=${tenant.id}`).then(r=>r.json()),
        fetch(`${baseUrl}/api/customers?tenant_id=${tenant.id}`).then(r=>r.json()).catch(()=>[]),
        fetch(`${baseUrl}/api/orders?tenant_id=${tenant.id}`).then(r=>r.json()).catch(()=>[]),
        fetch(`${baseUrl}/api/coupons?tenant_id=${tenant.id}`).then(r=>r.json()).catch(()=>[]),
        fetch(`${baseUrl}/api/theme?tenant_id=${tenant.id}`).then(r=>r.json()).catch(()=>null),
        fetch(`${baseUrl}/api/webhooks?tenant_id=${tenant.id}`).then(r=>r.json()).catch(()=>[]),
      ])
      setProducts(p||[]); setCustomers(c||[]); setOrders(o||[]); setCoupons(cp||[]); setTheme(th||null); setWebhooks(wh||[])
    } catch(e) { console.error(e) }
  }

  const login = async () => {
    if (!tenant) return
    const r = await fetch(`${baseUrl}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenant.id, email: auth.email, password: auth.password }) })
    const data = await r.json()
    if (r.ok) setAuth(prev => ({ ...prev, token: data.token, role: data.role }))
    else alert(data.detail || 'Login failed')
  }

  const registerAdmin = async () => {
    if (!tenant) return
    const r = await fetch(`${baseUrl}/api/admin/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenant.id, email: adminForm.email, password: adminForm.password, role: adminForm.role }) })
    const data = await r.json()
    if (r.ok) { alert('Admin registered'); setAdminForm({ email: '', password: '', role: 'staff' }) }
    else alert(data.detail || 'Registration failed')
  }

  const createCoupon = async () => {
    if (!tenant) return
    const payload = {
      tenant_id: tenant.id,
      code: couponForm.code,
      percent_off: couponForm.percent_off ? parseFloat(couponForm.percent_off) : undefined,
      amount_off: couponForm.amount_off ? parseFloat(couponForm.amount_off) : undefined,
      active: true
    }
    const r = await fetch(`${baseUrl}/api/coupons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await r.json()
    if (r.ok) { setCouponForm({ code: '', percent_off: '', amount_off: '' }); loadAll() }
    else alert(data.detail || 'Failed to create coupon')
  }

  const saveTheme = async () => {
    if (!tenant || !theme) return
    const payload = { ...theme, tenant_id: tenant.id }
    const r = await fetch(`${baseUrl}/api/theme`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await r.json()
    alert('Theme saved')
  }

  const addWebhook = async () => {
    if (!tenant) return
    const payload = { tenant_id: tenant.id, url: webhookForm.url, events: webhookForm.events.split(',').map(s=>s.trim()), active: true }
    const r = await fetch(`${baseUrl}/api/webhooks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await r.json()
    if (r.ok) { setWebhookForm({ url: '', events: 'order.created' }); loadAll() } else alert(data.detail || 'Failed')
  }

  const updateStock = async (id, delta) => {
    if (!tenant) return
    const r = await fetch(`${baseUrl}/api/products/${id}/stock?tenant_id=${tenant.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delta }) })
    const data = await r.json()
    if (r.ok) loadAll(); else alert(data.detail || 'Failed to update stock')
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Admin Dashboard {tenant ? `• ${tenant.name}` : ''}</h3>
          <div className="flex items-center gap-2">
            {!canManage && (
              <div className="flex items-center gap-2">
                <input placeholder="Email" value={auth.email} onChange={e=>setAuth({...auth, email:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-2 py-1" />
                <input type="password" placeholder="Password" value={auth.password} onChange={e=>setAuth({...auth, password:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-2 py-1" />
                <button onClick={login} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-sm font-semibold px-3 py-1.5 rounded">Login</button>
              </div>
            )}
            {canManage && <span className="text-xs text-emerald-400">Logged in ({auth.role})</span>}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {['overview','products','customers','orders','coupons','theme','team','webhooks'].map(v => (
            <button key={v} onClick={()=>setView(v)} className={`px-3 py-1.5 rounded border ${view===v? 'bg-emerald-500 text-slate-900 border-transparent':'bg-slate-900/60 text-white border-white/10'}`}>{v[0].toUpperCase()+v.slice(1)}</button>
          ))}
        </div>
      </div>

      {view === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <AdminPanel tenant={tenant} onTenantCreated={()=>{}} />
          <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2">Recent orders</h4>
            <ul className="space-y-2 max-h-72 overflow-auto pr-2">
              {orders.map(o => (
                <li key={o.id} className="text-white/80 text-sm flex items-center justify-between">
                  <span>#{o.id.slice(-6)} • ${o.total} • {o.status}</span>
                  <span className="text-white/50">{(o.created_at && new Date(o.created_at).toLocaleString()) || ''}</span>
                </li>
              ))}
              {orders.length===0 && <p className="text-white/60 text-sm">No orders yet.</p>}
            </ul>
          </div>
        </div>
      )}

      {view === 'products' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Products</h4>
          <ul className="divide-y divide-white/10">
            {products.map(p => (
              <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-slate-700/50 rounded" />
                  <div>
                    <p className="text-white">{p.title}</p>
                    <p className="text-white/60 text-sm">${p.price} • Stock: {p.stock}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>updateStock(p.id, 1)} className="px-2 py-1 bg-slate-700 text-white rounded">+1</button>
                  <button onClick={()=>updateStock(p.id, -1)} className="px-2 py-1 bg-slate-700 text-white rounded">-1</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === 'customers' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Customers</h4>
          <ul className="space-y-2">
            {customers.map(c => (<li key={c.id} className="text-white/80 text-sm">{c.name} • {c.email}</li>))}
            {customers.length===0 && <p className="text-white/60 text-sm">No customers yet.</p>}
          </ul>
        </div>
      )}

      {view === 'orders' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Orders</h4>
          <ul className="space-y-3">
            {orders.map(o => (
              <li key={o.id} className="text-white/80 text-sm border border-white/10 rounded p-3">
                <div className="flex items-center justify-between">
                  <span>#{o.id.slice(-6)} • ${o.total} • {o.status}</span>
                </div>
                <ul className="mt-2 text-white/70">
                  {o.items?.map((it, idx) => (<li key={idx}>• {it.title} × {it.quantity} (${it.price})</li>))}
                </ul>
              </li>
            ))}
            {orders.length===0 && <p className="text-white/60 text-sm">No orders yet.</p>}
          </ul>
        </div>
      )}

      {view === 'coupons' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
          <h4 className="text-white font-semibold">Coupons</h4>
          <div className="grid sm:grid-cols-3 gap-2">
            <input placeholder="CODE" value={couponForm.code} onChange={e=>setCouponForm({...couponForm, code:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input placeholder="Percent off (e.g., 10)" value={couponForm.percent_off} onChange={e=>setCouponForm({...couponForm, percent_off:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input placeholder="Amount off (e.g., 5)" value={couponForm.amount_off} onChange={e=>setCouponForm({...couponForm, amount_off:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
          </div>
          <button onClick={createCoupon} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-3 py-2 rounded">Create coupon</button>
          <ul className="divide-y divide-white/10">
            {coupons.map(cp => (<li key={cp.id} className="py-2 text-white/80 text-sm">{cp.code} • {cp.active? 'active':'inactive'} • redeemed {cp.times_redeemed||0}x</li>))}
            {coupons.length===0 && <p className="text-white/60 text-sm">No coupons yet.</p>}
          </ul>
        </div>
      )}

      {view === 'theme' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
          <h4 className="text-white font-semibold">Website Builder</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            <input placeholder="Primary color" value={theme?.primary_color || ''} onChange={e=>setTheme(prev=>({...prev, primary_color:e.target.value}))} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input placeholder="Logo URL" value={theme?.logo_url || ''} onChange={e=>setTheme(prev=>({...prev, logo_url:e.target.value}))} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input placeholder="Hero heading" value={theme?.hero_heading || ''} onChange={e=>setTheme(prev=>({...prev, hero_heading:e.target.value}))} className="col-span-2 bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input placeholder="Hero subtext" value={theme?.hero_subtext || ''} onChange={e=>setTheme(prev=>({...prev, hero_subtext:e.target.value}))} className="col-span-2 bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
          </div>
          <button onClick={saveTheme} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-3 py-2 rounded">Save theme</button>
        </div>
      )}

      {view === 'team' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
          <h4 className="text-white font-semibold">Team</h4>
          <div className="grid sm:grid-cols-3 gap-2">
            <input placeholder="Email" value={adminForm.email} onChange={e=>setAdminForm({...adminForm, email:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input type="password" placeholder="Password" value={adminForm.password} onChange={e=>setAdminForm({...adminForm, password:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <select value={adminForm.role} onChange={e=>setAdminForm({...adminForm, role:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2">
              <option value="owner">Owner</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <button onClick={registerAdmin} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-3 py-2 rounded">Invite / Register</button>
          <p className="text-white/50 text-xs">Basic auth is token-based from login. For production, integrate OAuth/SAML/2FA.</p>
        </div>
      )}

      {view === 'webhooks' && (
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3">
          <h4 className="text-white font-semibold">Webhooks</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            <input placeholder="https://example.com/webhook" value={webhookForm.url} onChange={e=>setWebhookForm({...webhookForm, url:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <input placeholder="Comma-separated events (order.created)" value={webhookForm.events} onChange={e=>setWebhookForm({...webhookForm, events:e.target.value})} className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
          </div>
          <button onClick={addWebhook} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-3 py-2 rounded">Add webhook</button>
          <ul className="divide-y divide-white/10">
            {webhooks.map(w => (<li key={w.id} className="py-2 text-white/80 text-sm">{w.url} • {Array.isArray(w.events)? w.events.join(', '): ''}</li>))}
            {webhooks.length===0 && <p className="text-white/60 text-sm">No webhooks yet.</p>}
          </ul>
        </div>
      )}
    </div>
  )
}
