import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <div className="spinner" style={{ marginTop: '45vh' }} />
  return admin ? children : <Navigate to="/admin/login" replace />
}
