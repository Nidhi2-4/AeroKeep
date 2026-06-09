import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/', label: 'Mission Control', icon: 'dashboard' },
  { path: '/inventory', label: 'Inventory', icon: 'inventory_2' },
  { path: '/logs', label: 'Stock Logs', icon: 'receipt_long' },
  { path: '/categories', label: 'Categories', icon: 'category' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface-container-low border-r border-outline-variant/30 flex flex-col z-40">
      
      {/* Logo */}
      <div className="p-6 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary text-[28px]">rocket_launch</span>
          <div>
            <h1 className="font-headline-lg text-[20px] text-tertiary leading-none">AeroKeep</h1>
            <p className="font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest mt-0.5">Deep Orbit</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.path
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 group
                ${isActive
                  ? 'bg-tertiary/10 border-l-2 border-tertiary text-tertiary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border-l-2 border-transparent'
                }`}>
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-tertiary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                {item.icon}
              </span>
              <span className="font-body-base text-[14px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-outline-variant/20">
        <div className="glass-panel p-3 rounded mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-tertiary text-[18px]">account_circle</span>
            <span className="font-body-base text-[13px] text-on-surface truncate">{user?.name || 'Operator'}</span>
          </div>
          <span className={`font-label-sm text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border
            ${user?.role === 'admin' 
            ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' 
            : 'bg-tertiary/10 text-tertiary border-tertiary/20'}`}>
            {user?.role === 'admin' ? '⚡ ADMIN' : '🔧 ENGINEER'}
          </span>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded transition-all duration-200 font-body-base text-[13px]">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  )
}