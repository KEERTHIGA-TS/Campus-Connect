import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './context/authStore'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CreatePostPage from './pages/CreatePostPage'
import PostDetailPage from './pages/PostDetailPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from "./pages/EditProfilePage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('cc_token')
  return token ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const token = localStorage.getItem('cc_token')
  return !token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />

          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
