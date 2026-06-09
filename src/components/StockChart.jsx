import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { api } from '../utils/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StockChart() {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    api.get('/products').then(products => {
      const categoryMap = {}
      products.forEach(p => {
        const cat = p.category?.name || 'Unknown'
        if (!categoryMap[cat]) categoryMap[cat] = { value: 0, qty: 0 }
        categoryMap[cat].value += p.price * p.quantity
        categoryMap[cat].qty += p.quantity
      })
      const labels = Object.keys(categoryMap)
      setChartData({
        labels,
        datasets: [
          {
            label: 'Stock Quantity',
            data: labels.map(l => categoryMap[l].qty),
            backgroundColor: 'rgba(76, 215, 246, 0.2)',
            borderColor: '#4cd7f6',
            borderWidth: 2,
            borderRadius: 4,
          },
          {
            label: 'Stock Value (₹00s)',
            data: labels.map(l => Math.round(categoryMap[l].value / 100)),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            borderRadius: 4,
          }
        ]
      })
    }).catch(console.error)
  }, [])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#c7c6cc', font: { family: 'JetBrains Mono', size: 11 } }
      },
      tooltip: {
        backgroundColor: 'rgba(32,31,32,0.95)',
        borderColor: 'rgba(76,215,246,0.3)',
        borderWidth: 1,
        titleColor: '#4cd7f6',
        bodyColor: '#e5e2e2',
        titleFont: { family: 'JetBrains Mono' },
        bodyFont: { family: 'JetBrains Mono' },
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } },
        grid: { color: 'rgba(255,255,255,0.03)' }
      },
      y: {
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  }

  if (!chartData) return (
    <div className="flex items-center justify-center h-48">
      <span className="material-symbols-outlined text-tertiary animate-spin">progress_activity</span>
    </div>
  )

  return (
    <div className="glass-panel rounded-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-tertiary text-[20px]">bar_chart</span>
        <h2 className="font-title-md text-[16px] text-on-surface font-semibold">Stock Distribution by Category</h2>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  )
}