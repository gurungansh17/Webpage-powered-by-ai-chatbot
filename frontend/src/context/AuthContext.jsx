import { createContext, useContext, useState, useEffect } from 'react'
import { getAdminProfile } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      getAdminProfile()
        .then((res) => setAdmin(res.data))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, adminData) => {
    localStorage.setItem('adminToken', token)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
