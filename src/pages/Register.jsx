import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'engineer' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Access keys do not match')
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, password: form.password, role: form.role })
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-data-mono text-data-mono py-3 px-3 outline-none transition-all duration-300 rounded-none"

  return (
    <div className="font-body-base text-on-background flex items-center justify-center min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 hud-grid z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-tertiary/5 z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/5 rounded-full z-0 opacity-20 animate-pulse"></div>

      {/* Corner brackets */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-tertiary/20"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-tertiary/20"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l border-b border-tertiary/20"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-tertiary/20"></div>
      </div>

      <main className="relative z-10 w-full max-w-[420px] px-4 md:px-0 py-8">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-tertiary text-[48px]">rocket_launch</span>
          <h1 className="font-headline-lg text-headline-lg text-tertiary tracking-tight">AeroKeep</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.2em] mt-1">
            Operator Enrollment
          </p>
        </div>

        <div className="glass-panel glow-border p-10 relative overflow-hidden">
          <div className="scanline"></div>
          <header className="mb-6">
            <h2 className="font-title-md text-title-md text-primary-fixed">New Operator Profile</h2>
            <div className="w-12 h-0.5 bg-tertiary/30 mt-2"></div>
          </header>

          {error && (
            <div className="mb-4 p-3 bg-error-container/20 border border-error/30 rounded text-error font-label-sm text-label-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Operator Name" required className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Operator ID (Email)</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="operator@beram.aero" required className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Access Key</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••••••" required className={inputClass} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-tertiary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Confirm Access Key</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••••••" required className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Clearance Level</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                <option value="engineer">Engineer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full bg-tertiary text-on-tertiary font-label-sm font-bold py-4 rounded-none transition-all duration-300 hover:bg-tertiary-fixed-dim hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60">
                {loading ? (
                  <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> ENROLLING...</>
                ) : (
                  <>REGISTER OPERATOR <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-data-mono text-[10px] text-on-surface-variant/40">ENROLLMENT PORTAL OPEN</span>
            </div>
            <Link to="/login" className="font-label-sm text-[11px] text-on-surface-variant/40 hover:text-tertiary transition-colors uppercase tracking-wider">
              Have Access? Login →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}