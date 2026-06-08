import { useState, useEffect } from 'react'
import { api } from '../utils/api'

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        const data = await api.get('/movements')
        setLogs(data || [])
      } catch (err) {
        setError(err.message || 'Failed to load logs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = logs.filter(l => {
    const matchType = typeFilter === 'All' || l.type === typeFilter
    const matchSearch = (l.product?.name || '').toLowerCase().includes(search.toLowerCase()) || (l.product?.sku || '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const formatTime = (iso) => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const selectClass = "bg-surface-container border border-outline-variant text-on-surface font-body-base text-[13px] px-3 py-2 rounded outline-none focus:border-tertiary transition-colors"

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline-lg text-[28px] text-on-surface">Stock Movement Logs</h1>
        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
          Full audit trail · {filtered.length} entries
        </p>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product or SKU..."
            className="w-full bg-surface-container border border-outline-variant text-on-surface font-data-mono text-[13px] pl-10 pr-4 py-2 rounded outline-none focus:border-tertiary transition-colors" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectClass}>
          <option value="All">All Types</option>
          <option value="IN">Stock In</option>
          <option value="OUT">Stock Out</option>
        </select>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {['#', 'Timestamp', 'Product', 'SKU', 'Type', 'Change', 'Reason', 'Engineer'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-on-surface-variant font-data-mono text-[13px]">Loading logs…</td></tr>
              ) : error ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-red-400 font-data-mono text-[13px]">{error}</td></tr>
              ) : filtered.map((log, i) => (
                <tr key={log.id} className="border-b border-white/[0.03] hover:bg-tertiary/[0.03] transition-colors">
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant">{String(i + 1).padStart(3, '0')}</td>
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant whitespace-nowrap">{formatTime(log.createdAt)}</td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface">{log.product?.name}</td>
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant">{log.product?.sku}</td>
                  <td className="px-5 py-3">
                    <span className={`font-label-sm text-[11px] px-2 py-1 rounded-full uppercase font-bold
                      ${log.type === 'IN' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                      {log.type === 'IN' ? '↑ IN' : '↓ OUT'}
                    </span>
                  </td>
                  <td className={`px-5 py-3 font-data-mono text-[14px] font-bold ${log.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>
                    {log.type === 'IN' ? '+' : '-'}{log.quantity}
                  </td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant max-w-[200px] truncate">{log.reason}</td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant">{log.user?.name}</td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-on-surface-variant">No logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}