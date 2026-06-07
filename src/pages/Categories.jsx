import { useState } from 'react'

const MOCK_CATEGORIES = [
  { id: '1', name: 'Avionics', description: 'Flight controllers, GPS, telemetry systems', productCount: 6 },
  { id: '2', name: 'Power Systems', description: 'Batteries, ESCs, power distribution boards', productCount: 8 },
  { id: '3', name: 'Structure', description: 'Frames, arms, landing gear, mounts', productCount: 4 },
  { id: '4', name: 'Communications', description: 'Radio modules, antennas, data links', productCount: 3 },
  { id: '5', name: 'Finished UAVs', description: 'Completed drone units ready for deployment', productCount: 3 },
]

export default function Categories() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg text-[28px] text-on-surface">Component Categories</h1>
          <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
            {categories.length} categories defined
          </p>
        </div>
        <button onClick={() => { setEditCat(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-tertiary text-on-tertiary hover:bg-tertiary-fixed-dim rounded font-label-sm text-[12px] uppercase tracking-wider transition-all hover:scale-[1.02]">
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="glass-panel glow-border rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
              <span className="material-symbols-outlined text-tertiary text-[28px]">category</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditCat(cat); setShowModal(true) }}
                  className="p-1.5 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded transition-colors">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button
                  onClick={() => cat.productCount > 0 ? alert('Cannot delete — active products linked to this category') : setDeleteTarget(cat)}
                  className={`p-1.5 rounded transition-colors ${cat.productCount > 0 ? 'text-on-surface-variant/30 cursor-not-allowed' : 'text-on-surface-variant hover:text-red-400 hover:bg-red-400/10'}`}
                  title={cat.productCount > 0 ? 'Cannot delete — active products linked' : 'Delete category'}>
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
            <h3 className="font-title-md text-[16px] text-on-surface font-semibold mb-1">{cat.name}</h3>
            <p className="font-body-base text-[13px] text-on-surface-variant mb-4 leading-relaxed">{cat.description || 'No description'}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
              <span className="material-symbols-outlined text-tertiary text-[16px]">inventory_2</span>
              <span className="font-label-sm text-[12px] text-tertiary">{cat.productCount} Products</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-title-md text-[18px] text-on-surface">{editCat ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <CategoryForm cat={editCat} onSave={(data) => {
              if (editCat) setCategories(categories.map(c => c.id === editCat.id ? { ...c, ...data } : c))
              else setCategories([...categories, { ...data, id: String(Date.now()), productCount: 0 }])
              setShowModal(false)
            }} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-red-400/20 rounded-xl p-8 w-full max-w-sm text-center">
            <span className="material-symbols-outlined text-red-400 text-[48px] mb-4 block">warning</span>
            <h2 className="font-title-md text-[18px] text-on-surface mb-2">Delete Category</h2>
            <p className="font-data-mono text-[13px] text-red-400 mb-6">{deleteTarget.name}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded font-label-sm text-[12px] uppercase">Cancel</button>
              <button onClick={() => { setCategories(categories.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null) }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded font-label-sm text-[12px] uppercase font-bold transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryForm({ cat, onSave, onClose }) {
  const [form, setForm] = useState({ name: cat?.name || '', description: cat?.description || '' })
  const inputClass = "w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-data-mono text-[13px] py-2.5 px-2 outline-none transition-all rounded-none"

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="font-label-sm text-[11px] text-on-surface-variant uppercase">Category Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Avionics" className={inputClass} />
      </div>
      <div className="space-y-1">
        <label className="font-label-sm text-[11px] text-on-surface-variant uppercase">Description (optional)</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description..." className={inputClass + ' resize-none'} />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant rounded font-label-sm text-[12px] uppercase transition-colors">Cancel</button>
        <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-tertiary text-on-tertiary rounded font-label-sm text-[12px] uppercase font-bold transition-all">
          {cat ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </div>
  )
}