import { Link, useNavigate } from 'react-router-dom'
import { LogOut, PenSquare, User, Home } from 'lucide-react'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-elevated">
            <span className="text-white font-display font-bold text-sm">CC</span>
          </div>
          <span className="font-display font-bold text-gray-900 text-lg hidden sm:block">
            Campus<span className="text-brand-500">Connect</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/"
                className="p-2 rounded-xl text-gray-500 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                title="Home"
              >
                <Home size={20} />
              </Link>

              <Link
                to="/create"
                className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4"
              >
                <PenSquare size={15} />
                <span className="hidden sm:inline">New Post</span>
              </Link>

              <Link
                to={`/profile/${user.userId}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-brand-600 font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-secondary text-sm py-2">Sign in</Link>
              <Link to="/register" className="btn-primary  text-sm py-2">Join free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
