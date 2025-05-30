// src/router/index.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import DashboardPage from '../pages/Dashboard'
import MainLayout from '../components/Layout'
import LoginPage from '../pages/Login'
import CategoryPage from '../pages/CateogryPage'

const AppRouter = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        
        {/* Protected layout */}
        <Route element={user ? <MainLayout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
