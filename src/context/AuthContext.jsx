import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('aerokeep_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  // TEMPORARY - skip API check until backend is ready
  if (token) {
    const savedUser = { name: 'Test Operator', email: 'test@beram.aero', role: 'engineer' }
    setUser(savedUser)
  }
  setLoading(false)
}, [token])

  const login = (token, user) => {
    localStorage.setItem('aerokeep_token', token)
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('aerokeep_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)