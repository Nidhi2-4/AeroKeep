import { useState } from 'react'

const MOCK_LOGS = [
  { id: 1, createdAt: '2026-06-07T08:30:00Z', product: { name: 'BMS LiPo Pack', sku: 'PWR-BMS-001' }, type: 'OUT', quantity: 5, reason: 'Allocated for UAV Assembly', user: { name: 'Raj Mehta' } },
  { id: 2, createdAt: '2026-06-07T07:15:00Z', product: { name: 'Flight Controller X7', sku: 'AVI-FC-007' }, type: 'IN', quantity: 10, reason: 'Shipment Received', user: { name: 'Priya Shah' } },
  { id: 3, createdAt: '2026-06-06T16:45:00Z', product: { name: 'GPS Module NEO-9', sku: 'AVI-GPS-009' }, type: 'OUT', quantity: 2, reason: 'Damaged during flight testing', user: { name: 'Arjun Nair' } },
  { id: 4, createdAt: '2026-06-06T14:20:00Z', product: { name: 'ESC 40A Pro', sku: 'PWR-ESC-040' }, type: 'IN', quantity: 20, reason: 'Restocked from supplier', user: { name: 'Raj Mehta' } },
  { id: 5, createdAt: '2026-06-06T11:00:00Z', product: { name: 'Carbon Frame X500', sku: 'STR-CF-500' }, type: 'OUT', quantity: 1, reason: 'Allocated for UAV Assembly', user: { name: 'Priya Shah' } },
  { id: 6, createdAt: '2026-06-05T09:00:00Z', product: { name: 'Telemetry Radio 915MHz', sku: 'COM-TLM-915' }, type: 'OUT', quantity: 4, reason: 'Dispatched for field testing', user: { name: 'Arjun Nair' } },
]

export default function Logs() {
  const [logs] = useState(MOCK_LOGS)
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = logs.filter(l => {
    const matchType = typeFilter === 'All' || l.type === typeFilter
    const matchSearch = l.product.name.toLowerCase().includes(search.toLowerCase()) || l.product.sku.toLowerCase().includes(search.toLowerCase())
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
              {filtered.map((log, i) => (
                <tr key={log.id} className="border-b border-white/[0.03] hover:bg-tertiary/[0.03] transition-colors">
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant">{String(i + 1).padStart(3, '0')}</td>
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant whitespace-nowrap">{formatTime(log.createdAt)}</td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface">{log.product.name}</td>
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant">{log.product.sku}</td>
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
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant">{log.user.name}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-on-surface-variant">No logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}