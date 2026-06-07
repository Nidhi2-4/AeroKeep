import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Logs from './pages/Logs'
import Categories from './pages/Categories'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/inventory" element={<ProtectedLayout><Inventory /></ProtectedLayout>} />
        <Route path="/logs" element={<ProtectedLayout><Logs /></ProtectedLayout>} />
        <Route path="/categories" element={<ProtectedLayout><Categories /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}