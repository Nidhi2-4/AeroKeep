import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'
import QRCode from 'react-qr-code'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const data = await api.get(`/products/${id}`)
      setProduct(data)
    } catch (err) {
      console.error(err)
      navigate('/inventory')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById('product-qr')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = '#131314'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.download = `QR-${product.sku}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const getStatus = (qty, threshold) => {
    if (qty === 0) return { label: 'OUT OF STOCK', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' }
    if (qty <= threshold) return { label: 'LOW STOCK', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' }
    return { label: 'IN STOCK', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' }
  }

  const formatTime = (iso) => new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="material-symbols-outlined text-tertiary text-[48px] animate-spin">progress_activity</span>
    </div>
  )

  if (!product) return null

  const status = getStatus(product.quantity, product.lowStockThreshold)
  const inventoryValue = product.price * product.quantity
  const productUrl = `${window.location.origin}/inventory/product/${id}`

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/inventory')}
          className="p-2 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-[28px] text-on-surface">{product.name}</h1>
            <span className={`font-label-sm text-[11px] px-2 py-1 rounded-full border uppercase ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="font-data-mono text-[13px] text-on-surface-variant mt-1">{product.sku} · {product.category?.name}</p>
        </div>
        <button onClick={() => setShowQR(true)}
          className="flex items-center gap-2 px-4 py-2 border border-tertiary/30 text-tertiary hover:bg-tertiary/10 rounded font-label-sm text-[12px] uppercase tracking-wider transition-all">
          <span className="material-symbols-outlined text-[16px]">qr_code</span>
          QR Label
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Product Info Card */}
        <div className="lg:col-span-2 glass-panel glow-border rounded-xl p-6">
          <h2 className="font-title-md text-[16px] text-on-surface font-semibold mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[18px]">info</span>
            Asset Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'SKU', value: product.sku, mono: true },
              { label: 'Category', value: product.category?.name },
              { label: 'Manufacturer', value: product.manufacturer || '—' },
              { label: 'Serial Number', value: product.serialNumber || '—', mono: true },
              { label: 'Unit Price', value: `₹${product.price?.toLocaleString('en-IN')}`, mono: true },
              { label: 'Low Stock Threshold', value: `${product.lowStockThreshold} units`, mono: true },
            ].map(item => (
              <div key={item.label} className="p-3 bg-surface-container rounded-lg">
                <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-[14px] text-on-surface font-medium ${item.mono ? 'font-data-mono' : 'font-body-base'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Summary Card */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel glow-border rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-tertiary text-[32px]">inventory_2</span>
            <p className={`font-data-mono text-[48px] font-bold mt-2 ${status.color}`}>{product.quantity}</p>
            <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">Units in Stock</p>
          </div>
          <div className="glass-panel glow-border-amber rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-green-400 text-[32px]">payments</span>
            <p className="font-data-mono text-[28px] font-bold mt-2 text-green-400">
              ₹{inventoryValue.toLocaleString('en-IN')}
            </p>
            <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">Inventory Value</p>
          </div>
        </div>
      </div>

      {/* Movement History */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-outline-variant/20">
          <span className="material-symbols-outlined text-tertiary text-[20px]">receipt_long</span>
          <h2 className="font-title-md text-[16px] text-on-surface font-semibold">Movement History</h2>
          <span className="font-label-sm text-[11px] px-2 py-0.5 bg-tertiary/10 text-tertiary rounded-full ml-auto">
            Last {product.movements?.length || 0} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Timestamp', 'Type', 'Quantity', 'Reason', 'Engineer'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.movements?.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant font-body-base">No movements recorded</td></tr>
              )}
              {product.movements?.map(m => (
                <tr key={m.id} className="border-b border-white/[0.03] hover:bg-tertiary/[0.03] transition-colors">
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant whitespace-nowrap">{formatTime(m.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className={`font-label-sm text-[11px] px-2 py-1 rounded-full uppercase font-bold
                      ${m.type === 'IN' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                      {m.type === 'IN' ? '↑ IN' : '↓ OUT'}
                    </span>
                  </td>
                  <td className={`px-5 py-3 font-data-mono text-[14px] font-bold ${m.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>
                    {m.type === 'IN' ? '+' : '-'}{m.quantity}
                  </td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant">{m.reason}</td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant">{m.user?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 w-full max-w-sm text-center">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-title-md text-[18px] text-on-surface">QR Label</h2>
              <button onClick={() => setShowQR(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCode id="product-qr" value={productUrl} size={180} />
            </div>

            <p className="font-data-mono text-[12px] text-tertiary mb-1">{product.sku}</p>
            <p className="font-body-base text-[14px] text-on-surface mb-1">{product.name}</p>
            <p className="font-data-mono text-[11px] text-on-surface-variant mb-6 break-all">{productUrl}</p>

            <div className="flex gap-3">
              <button onClick={() => navigator.clipboard.writeText(productUrl).then(() => alert('URL copied!'))}
                className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant hover:text-tertiary hover:border-tertiary rounded font-label-sm text-[12px] uppercase transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy URL
              </button>
              <button onClick={downloadQR}
                className="flex-1 py-2.5 bg-tertiary text-on-tertiary hover:bg-tertiary-fixed-dim rounded font-label-sm text-[12px] uppercase font-bold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}