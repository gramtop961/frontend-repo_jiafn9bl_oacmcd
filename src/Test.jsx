import { useEffect, useState } from 'react'

export default function Test() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch(`${baseUrl}/test`).then(r => r.json()).then(setStatus).catch(()=>setStatus({ error: 'failed'}))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">System Status</h1>
        <pre className="bg-slate-900/80 border border-white/10 rounded p-3 mt-4 overflow-auto">{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  )
}
