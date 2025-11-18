export default function ProductPage({ product, onBack, onAddToCart }) {
  if (!product) return null
  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
      <button onClick={onBack} className="text-white/70 text-sm hover:text-white">← Back</button>
      <div className="grid md:grid-cols-2 gap-6 mt-3">
        <div className="aspect-video bg-slate-700/50 rounded flex items-center justify-center text-white/40">
          {product.image ? <img src={product.image} alt={product.title} className="object-cover w-full h-full rounded" /> : 'No image'}
        </div>
        <div>
          <h2 className="text-2xl text-white font-bold">{product.title}</h2>
          <p className="text-white/60 mt-1">{product.description}</p>
          <div className="text-emerald-400 font-semibold text-xl mt-3">${product.price}</div>
          <p className="text-white/60 text-sm mt-1">In stock: {product.stock ?? 0}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => onAddToCart(product, 1)} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-sm px-4 py-2 rounded">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
