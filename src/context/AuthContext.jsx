import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('aerokeep_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aerokeep_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading] = useState(false)

  const login = (token, user) => {
    localStorage.setItem('aerokeep_token', token)
    localStorage.setItem('aerokeep_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('aerokeep_token')
    localStorage.removeItem('aerokeep_user')
    setToken(null)
    setUser(null)
  }
  const isAdmin = () => user?.role === 'admin'
  const isEngineer = () => user?.role === 'engineer'
  const canEdit = () => ['admin', 'engineer'].includes(user?.role)
  const canDelete = () => user?.role === 'admin'
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin, isEngineer, canEdit, canDelete }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)