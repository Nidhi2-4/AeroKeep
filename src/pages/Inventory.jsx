import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { exportToCSV } from '../utils/csvExport'
import { useAuth } from '../context/AuthContext'


const getStatus = (qty, threshold) => {
  if (qty === 0) return 'out'
  if (qty <= threshold) return 'low'
  return 'in'
}

const StatusBadge = ({ qty, threshold }) => {
  const status = getStatus(qty, threshold)
  if (status === 'in') return (
    <span className="font-label-sm text-[11px] px-2 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 uppercase">In Stock</span>
  )
  if (status === 'low') return (
    <span className="font-label-sm text-[11px] px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase flex items-center gap-1 w-fit animate-pulse">
      <span className="material-symbols-outlined text-[12px]">warning</span>Low Stock
    </span>
  )
  return (
    <span className="font-label-sm text-[11px] px-2 py-1 rounded-full bg-red-400/10 text-red-400 border border-red-400/20 uppercase">Out of Stock</span>
  )
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editProduct, setEditProduct] = useState(null)
  const navigate = useNavigate()
  const { canDelete } = useAuth()

  // Pull this user's products + categories from the backend.
  const load = async () => {
    try {
      setError('')
      const [prods, cats] = await Promise.all([api.get('/products'), api.get('/categories')])
      setProducts(prods || [])
      setCategories(cats || [])
    } catch (err) {
      setError(err.message || 'Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category.name === categoryFilter
    const status = getStatus(p.quantity, p.lowStockThreshold)
    const matchStatus = statusFilter === 'All' ||
      (statusFilter === 'in' && status === 'in') ||
      (statusFilter === 'low' && status === 'low') ||
      (statusFilter === 'out' && status === 'out')
    return matchSearch && matchCat && matchStatus
  })

  // Create or update a product, then refresh from the server.
  const handleSaveProduct = async (form) => {
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        categoryId: form.categoryId,
        price: Number(form.price),
        quantity: Number(form.quantity),
        lowStockThreshold: Number(form.lowStockThreshold),
        serialNumber: form.serialNumber || null,
        manufacturer: form.manufacturer || null,
      }
      if (editProduct) await api.put(`/products/${editProduct.id}`, payload)
      else await api.post('/products', payload)
      setShowAddModal(false)
      await load()
    } catch (err) {
      alert(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleStock = async (id, type, qty, reason) => {
    try {
      await api.post('/movements', { productId: id, type, quantity: qty, reason })
      setShowStockModal(false)
      await load()
    } catch (err) {
      alert(err.message || 'Stock update failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      setShowDeleteModal(false)
      await load()
    } catch (err) {
      alert(err.message || 'Delete failed')
    }
  }

  const selectClass = "bg-surface-container border border-outline-variant text-on-surface font-body-base text-[13px] px-3 py-2 rounded outline-none focus:border-tertiary transition-colors"

  if (loading) return <div className="text-on-surface-variant font-data-mono text-[13px] py-20 text-center">Loading inventory…</div>
  if (error) return <div className="text-red-400 font-data-mono text-[13px] py-20 text-center">{error}</div>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-[28px] text-on-surface">Inventory Directory</h1>
          <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
            {filtered.length} assets found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportToCSV(products)}
            className="flex items-center gap-2 px-4 py-2 border border-tertiary/30 text-tertiary hover:bg-tertiary/10 rounded font-label-sm text-[12px] uppercase tracking-wider transition-all">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export CSV
          </button>
          <button onClick={() => { setEditProduct(null); setShowAddModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-tertiary text-on-tertiary hover:bg-tertiary-fixed-dim rounded font-label-sm text-[12px] uppercase tracking-wider transition-all hover:scale-[1.02]">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Asset
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full bg-surface-container border border-outline-variant text-on-surface font-data-mono text-[13px] pl-10 pr-4 py-2 rounded outline-none focus:border-tertiary transition-colors" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={selectClass}>
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="All">All Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {['Name', 'SKU', 'Category', 'Price', 'Qty', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-tertiary/[0.03] transition-colors">
                  <td className="px-5 py-3 cursor-pointer" onClick={() => navigate(`/inventory/product/${p.id}`)}>
                     <p className="font-body-base text-[14px] text-on-surface font-medium hover:text-tertiary transition-colors">{p.name}</p>
                      {p.manufacturer && <p className="font-data-mono text-[11px] text-on-surface-variant">{p.manufacturer}</p>}
                  </td>
                  <td className="px-5 py-3 font-data-mono text-[12px] text-on-surface-variant">{p.sku}</td>
                  <td className="px-5 py-3 font-body-base text-[13px] text-on-surface-variant">{p.category.name}</td>
                  <td className="px-5 py-3 font-data-mono text-[13px] text-on-surface">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`font-data-mono text-[14px] font-bold
                      ${p.quantity === 0 ? 'text-red-400' : p.quantity <= p.lowStockThreshold ? 'text-amber-400' : 'text-green-400'}`}>
                      {p.quantity}
                    </span>
                    <span className="font-data-mono text-[11px] text-on-surface-variant ml-1">/ {p.lowStockThreshold} min</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge qty={p.quantity} threshold={p.lowStockThreshold} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedProduct(p); setShowStockModal(true) }}
                        className="p-1.5 text-tertiary hover:bg-tertiary/10 rounded transition-colors" title="Adjust Stock">
                        <span className="material-symbols-outlined text-[18px]">swap_vert</span>
                      </button>
                      <button onClick={() => { setEditProduct(p); setShowAddModal(true) }}
                        className="p-1.5 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      {canDelete() && (
                      <button onClick={() => { setSelectedProduct(p); setShowDeleteModal(true) }}
                           className="p-1.5 text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Delete">
                           <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant font-body-base">No assets found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <ProductModal product={editProduct} categories={categories} saving={saving} onClose={() => setShowAddModal(false)} onSave={handleSaveProduct} />}
      {showStockModal && <StockModal product={selectedProduct} onClose={() => setShowStockModal(false)} onSave={handleStock} />}
      {showDeleteModal && <DeleteModal product={selectedProduct} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} />}
    </div>
  )
}

function ProductModal({ product, categories, saving, onClose, onSave }) {
  const [form, setForm] = useState(
    product
      ? { name: product.name, sku: product.sku, categoryId: product.categoryId, price: product.price, quantity: product.quantity, lowStockThreshold: product.lowStockThreshold, serialNumber: product.serialNumber || '', manufacturer: product.manufacturer || '' }
      : { name: '', sku: '', categoryId: categories[0]?.id || '', price: '', quantity: '', lowStockThreshold: '', serialNumber: '', manufacturer: '' }
  )
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const inputClass = "w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-data-mono text-[13px] py-2.5 px-2 outline-none transition-all rounded-none"

  const fields = [['name', 'Asset Name', 'text'], ['sku', 'SKU', 'text'], ['manufacturer', 'Manufacturer', 'text'], ['price', 'Price (₹)', 'number'], ['quantity', 'Quantity', 'number'], ['lowStockThreshold', 'Low Stock Threshold', 'number'], ['serialNumber', 'Serial Number (optional)', 'text']]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-title-md text-[18px] text-on-surface">{product ? 'Edit Asset' : 'Add New Asset'}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Category dropdown (real category ids from the backend) */}
          <div className="space-y-1">
            <label className="font-label-sm text-[11px] text-on-surface-variant uppercase">Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass}>
              <option value="" disabled>Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {fields.map(([name, label, type]) => (
            <div key={name} className="space-y-1">
              <label className="font-label-sm text-[11px] text-on-surface-variant uppercase">{label}</label>
              <input name={name} type={type} value={form[name] ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant hover:text-on-surface rounded font-label-sm text-[12px] uppercase transition-colors">Cancel</button>
          <button disabled={saving} onClick={() => onSave(form)} className="flex-1 py-2.5 bg-tertiary text-on-tertiary hover:bg-tertiary-fixed-dim rounded font-label-sm text-[12px] uppercase font-bold transition-all disabled:opacity-60">
            {saving ? 'Saving…' : product ? 'Save Changes' : 'Add Asset'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StockModal({ product, onClose, onSave }) {
  const [type, setType] = useState('IN')
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState('')
  const reasons = ['Shipment Received', 'Allocated for UAV Assembly', 'Damaged during testing', 'Quality Check', 'Restocked from supplier']

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-title-md text-[18px] text-on-surface">Stock Adjustment</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <p className="font-data-mono text-[13px] text-on-surface-variant mb-1">{product?.sku}</p>
        <p className="font-body-base text-[16px] text-on-surface font-semibold mb-1">{product?.name}</p>
        <p className="font-data-mono text-[28px] font-bold text-tertiary mb-6">{product?.quantity} <span className="text-[14px] text-on-surface-variant">units</span></p>

        <div className="flex gap-3 mb-5">
          {['IN', 'OUT'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-3 rounded font-label-sm text-[12px] uppercase font-bold border-2 transition-all
                ${type === t
                  ? t === 'IN' ? 'bg-green-400/10 border-green-400 text-green-400' : 'bg-red-400/10 border-red-400 text-red-400'
                  : 'border-outline-variant text-on-surface-variant hover:border-outline'}`}>
              {t === 'IN' ? '↑ Stock In' : '↓ Stock Out'}
            </button>
          ))}
        </div>

        <div className="space-y-1 mb-4">
          <label className="font-label-sm text-[11px] text-on-surface-variant uppercase">Quantity</label>
          <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1"
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-data-mono text-[16px] py-2.5 px-2 outline-none transition-all rounded-none" />
        </div>

        <div className="space-y-2 mb-4">
          <label className="font-label-sm text-[11px] text-on-surface-variant uppercase">Reason</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {reasons.map(r => (
              <button key={r} onClick={() => setReason(r)}
                className={`px-2 py-1 rounded-full text-[11px] font-label-sm border transition-all
                  ${reason === r ? 'bg-tertiary/20 border-tertiary text-tertiary' : 'border-outline-variant text-on-surface-variant hover:border-tertiary/50'}`}>
                {r}
              </button>
            ))}
          </div>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Or type custom reason..."
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-body-base text-[13px] py-2 px-2 outline-none transition-all rounded-none resize-none" />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded font-label-sm text-[12px] uppercase transition-colors">Cancel</button>
          <button onClick={() => {
              const n = parseInt(qty)
              if (!n || n < 1) return alert('Enter a valid quantity')
              if (!reason.trim()) return alert('Please provide a reason')
              onSave(product.id, type, n, reason.trim())
            }}
            className={`flex-1 py-2.5 rounded font-label-sm text-[12px] uppercase font-bold transition-all
              ${type === 'IN' ? 'bg-green-400 text-black hover:bg-green-300' : 'bg-red-400 text-white hover:bg-red-300'}`}>
            Confirm {type === 'IN' ? '↑ Stock In' : '↓ Stock Out'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ product, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-red-400/20 rounded-xl p-8 w-full max-w-sm text-center">
        <span className="material-symbols-outlined text-red-400 text-[48px] mb-4 block">warning</span>
        <h2 className="font-title-md text-[18px] text-on-surface mb-2">Delete Asset</h2>
        <p className="font-body-base text-[14px] text-on-surface-variant mb-2">This action cannot be undone.</p>
        <p className="font-data-mono text-[13px] text-red-400 mb-6">{product?.sku} — {product?.name}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded font-label-sm text-[12px] uppercase transition-colors">Cancel</button>
          <button onClick={() => onConfirm(product.id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded font-label-sm text-[12px] uppercase font-bold transition-all">
            Delete Asset
          </button>
        </div>
      </div>
    </div>
  )
}