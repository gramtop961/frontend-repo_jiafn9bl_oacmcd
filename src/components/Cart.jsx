import { useMemo, useState } from 'react'

export default function Cart({ tenant, items, onUpdateQty, onCheckout }) {
  const [coupon, setCoupon] = useState('')
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items])

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Your Cart</h3>
      {items.length === 0 && <p className="text-white/60">Your cart is empty.</p>}
      {items.length > 0 && (
        <div>
          <ul className="divide-y divide-white/10">
            {items.map((it) => (
              <li key={it.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-slate-700/50 rounded flex items-center justify-center text-white/40">
                    {it.image ? <img src={it.image} alt={it.title} className="object-cover w-full h-full rounded" /> : 'No image'}
                  </div>
                  <div>
                    <p className="text-white">{it.title}</p>
                    <p className="text-white/60 text-sm">${it.price} × </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQty(it.id, Math.max(1, it.quantity - 1))} className="px-2 py-1 bg-slate-700 text-white rounded">-</button>
                  <span className="text-white">{it.quantity}</span>
                  <button onClick={() => onUpdateQty(it.id, it.quantity + 1)} className="px-2 py-1 bg-slate-700 text-white rounded">+</button>
                </div>
                <div className="text-emerald-400 font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="bg-slate-900/60 border border-white/10 text-white text-sm rounded px-3 py-2" />
            <div className="text-right text-white">Subtotal: <span className="text-emerald-400 font-semibold">${subtotal.toFixed(2)}</span></div>
          </div>

          <div className="mt-3 text-right">
            <button onClick={() => onCheckout(coupon || null)} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-4 py-2 rounded">Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}
