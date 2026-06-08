import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalValue: 0, lowStockCount: 0, categoryCount: 0 })
  const [movements, setMovements] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsData, movementsData] = await Promise.all([
        api.get('/products/stats'),
        api.get('/movements')
      ])
      setStats(statsData)
      setMovements(movementsData.slice(0, 5))
      setLowStock(statsData.lowStockItems || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val) =>
    '₹' + val.toLocaleString('en-IN')

  const formatTime = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const cards = [
    { label: 'TOTAL PRODUCTS', value: stats.totalProducts, icon: 'inventory_2', color: 'text-tertiary', border: 'glow-border', valueColor: 'text-tertiary' },
    { label: 'STOCK VALUE', value: formatCurrency(stats.totalValue), icon: 'payments', color: 'text-green-400', border: 'glow-border-green', valueColor: 'text-green-400' },
    { label: 'LOW STOCK ALERTS', value: stats.lowStockCount, icon: 'warning', color: 'text-amber-400', border: 'glow-border-amber', valueColor: 'text-amber-400', pulse: true },
    { label: 'CATEGORIES', value: stats.categoryCount, icon: 'category', color: 'text-blue-400', border: 'glow-border', valueColor: 'text-blue-400' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline-lg text-[28px] text-on-surface">Mission Control</h1>
        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
          AeroKeep · Live Inventory Overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className={`glass-panel ${card.border} p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:border-tertiary/30`}>
            <div className="flex items-start justify-between">
              <span className={`material-symbols-outlined text-[28px] ${card.color} ${card.pulse ? 'animate-pulse' : ''}`}>
                {card.icon}
              </span>
            </div>
            <p className={`font-data-mono text-[30px] font-bold mt-3 ${card.valueColor}`}>
              {card.value}
            </p>
            <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert Banner */}
      {lowStock.length > 0 && (
        <div className="mb-6 p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl border-l-4 border-l-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 animate-pulse text-[20px]">warning</span>
            <div>
              <p className="font-body-base text-[13px] text-on-surface">
                <span className="text-amber-400 font-semibold">{lowStock.length} components</span> are critically low — immediate restocking required
              </p>
              <p className="font-data-mono text-[11px] text-on-surface-variant mt-0.5">
                {lowStock.map(p => p.sku).join(' · ')}
              </p>
            </div>
          </div>
          <Link to="/inventory?filter=low" className="font-label-sm text-[11px] text-amber-400 hover:text-amber-300 uppercase tracking-wider whitespace-nowrap ml-4">
            View Alerts →
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">receipt_long</span>
            <h2 className="font-title-md text-[16px] text-on-surface font-semibold">Recent Activity</h2>
          </div>
          <Link to="/logs" className="font-label-sm text-[11px] text-tertiary hover:text-tertiary-fixed uppercase tracking-wider">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Timestamp', 'Product', 'SKU', 'Type', 'Qty', 'Reason', 'Engineer'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movements.map((m, i) => (
                <tr key={m.id} className="border-b border-white/[0.03] hover:bg-tertiary/[0.03] transition-colors">
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant whitespace-nowrap">
                    {formatTime(m.createdAt)}
                  </td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface">{m.product.name}</td>
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant">{m.product.sku}</td>
                  <td className="px-5 py-3">
                    <span className={`font-label-sm text-[11px] px-2 py-1 rounded-full uppercase font-bold
                      ${m.type === 'IN'
                        ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                        : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                      {m.type === 'IN' ? '↑ IN' : '↓ OUT'}
                    </span>
                  </td>
                  <td className={`px-5 py-3 font-data-mono text-[13px] font-bold ${m.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>
                    {m.type === 'IN' ? '+' : '-'}{m.quantity}
                  </td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant max-w-[180px] truncate">
                    {m.reason}
                  </td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant">{m.user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}