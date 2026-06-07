import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { postApi } from '../api'
import PostCard from '../components/PostCard'
import { PageLoader } from '../components/Spinner'
import { PenSquare, Rss } from 'lucide-react'
import useAuthStore from '../context/authStore'

const CATEGORIES = ['All', 'Academic', 'Events', 'Sports', 'Campus', 'Clubs', 'Jobs', 'General']

export default function HomePage() {
  const [posts, setPosts]         = useState([])
  const [filtered, setFiltered]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [category, setCategory]   = useState('All')
  const { user } = useAuthStore()

  const fetchPosts = useCallback(async () => {
    try {
      const res = await postApi.getAll()
      setPosts(res.data.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  useEffect(() => {
    setFiltered(
      category === 'All' ? posts : posts.filter(p => p.category === category)
    )
  }, [posts, category])

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p.id !== id))
  const handleLike   = (updated) =>
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))

  if (loading) return <PageLoader />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white mb-8 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Rss size={18} className="opacity-80" />
            <span className="text-brand-200 text-sm font-medium">Campus Feed</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            What's happening on campus?
          </h1>
          <p className="text-brand-200 text-sm mb-5 max-w-md">
            Discover events, academic updates, campus news and more — all in one place.
          </p>
          {user ? (
            <Link to="/create" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm">
              <PenSquare size={15} />
              Share something
            </Link>
          ) : (
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm">
              Join Campus Connect
            </Link>
          )}
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              category === cat
                ? 'bg-brand-500 text-white shadow-elevated'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-display font-semibold text-gray-700 text-xl mb-2">No posts yet</h3>
          <p className="text-gray-400 text-sm mb-6">
            {category !== 'All' ? `No posts in "${category}" yet.` : 'Be the first to share something!'}
          </p>
          {user && (
            <Link to="/create" className="btn-primary inline-flex items-center gap-2 text-sm">
              <PenSquare size={15} /> Create the first post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </div>
  )
}
