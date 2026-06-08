import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await api.post('/auth/login', { email, password })
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="font-body-base text-on-background flex items-center justify-center min-h-screen relative overflow-hidden bg-background">
      
      {/* Background */}
      <div className="fixed inset-0 hud-grid z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-tertiary/5 z-0"></div>
      
      {/* Floating orbit rings */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/5 rounded-full z-0 opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] border border-tertiary/10 rounded-full z-0 opacity-10"></div>

      {/* Corner brackets */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-tertiary/20"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-tertiary/20"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l border-b border-tertiary/20"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-tertiary/20"></div>
      </div>

      {/* Main card */}
      <main className="relative z-10 w-full max-w-[420px] px-4 md:px-0">
        
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-tertiary text-[48px]">rocket_launch</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-tertiary tracking-tight">AeroKeep</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.2em] mt-1">
            Deep Orbit Network · BeRAM Drones
          </p>
        </div>

        {/* Glass panel */}
        <div className="glass-panel glow-border p-10 relative overflow-hidden">
          <div className="scanline"></div>
          
          <header className="mb-6">
            <h2 className="font-title-md text-title-md text-primary-fixed">Secure Access</h2>
            <div className="w-12 h-0.5 bg-tertiary/30 mt-2"></div>
          </header>

          {error && (
            <div className="mb-4 p-3 bg-error-container/20 border border-error/30 rounded text-error font-label-sm text-label-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex justify-between">
                <span>OPERATOR ID</span>
                
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@beram.aero"
                  required
                  className="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-data-mono text-data-mono py-3 px-3 outline-none transition-all duration-300 rounded-none"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[18px]">badge</span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex justify-between">
                <span>ACCESS KEY</span>
                
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-tertiary text-on-surface font-data-mono text-data-mono py-3 px-3 outline-none transition-all duration-300 rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-tertiary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold py-4 rounded-none transition-all duration-300 hover:bg-tertiary-fixed-dim hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    SIGN IN
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer inside panel */}
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-data-mono text-[10px] text-on-surface-variant/40">SYSTEM READY</span>
            </div>
            <Link to="/register" className="font-label-sm text-[11px] text-on-surface-variant/40 hover:text-tertiary transition-colors uppercase tracking-wider">
              New Operator? Register →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center">
          <p className="font-data-mono text-[11px] text-on-surface-variant/30 uppercase tracking-widest leading-relaxed">
            Classified Environment // Authorized Personnel Only
          </p>
        </footer>
      </main>
    </div>
  )
}