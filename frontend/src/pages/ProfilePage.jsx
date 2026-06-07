import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { userApi } from '../api'
import { PageLoader } from '../components/Spinner'
import PostCard from '../components/PostCard'
import useAuthStore from '../context/authStore'
import { formatDistanceToNow } from 'date-fns'
import { CalendarDays, Grid, User, PenSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const isOwnProfile = user?.userId === Number(id)

  const fetchProfile = useCallback(async () => {
    try {
      const [userRes, postsRes] = await Promise.all([
        userApi.getById(id),
        userApi.getPosts(id),
      ])
      setProfile(userRes.data.data)
      setPosts(postsRes.data.data)
    } catch {
      toast.error('User not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleDelete = (postId) => setPosts(prev => prev.filter(p => p.id !== postId))
  const handleLike = (updated) =>
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))

  if (loading) return <PageLoader />
  if (!profile) return null

  const totalLikes = posts.reduce((acc, p) => acc + (p.likeCount || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-up">

      {/* Profile header card */}
      <div className="card overflow-hidden mb-8">


        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
                                radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        <div className="px-7 pb-7">
          {/* Avatar */}
          <div className="flex items-end justify-between relative -mt-6 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-card flex items-center justify-center z-10">
              <div className="w-full h-full rounded-xl bg-brand-100 flex items-center justify-center">
                <span className="font-display font-bold text-brand-600 text-3xl">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="font-display font-bold text-brand-600 text-3xl">
                      {profile.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {isOwnProfile && (
              <Link to="/create" className="btn-primary flex items-center gap-2 text-sm mb-2">
                <PenSquare size={14} /> New Post
              </Link>
            )}
          </div>

          {/* Name & email */}
          <div className="mb-5">
            {/* Name */}
            <h1 className="font-display font-bold text-2xl text-gray-900">
              {profile.name}
            </h1>

            {/* Email */}
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
              <User size={13} />
              {profile.email}
            </p>

            {/* Joined date */}
            {profile.createdAt && (
              <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
                <CalendarDays size={12} />
                Joined{" "}
                {formatDistanceToNow(new Date(profile.createdAt), {
                  addSuffix: true,
                })}
              </p>
            )}

            {/* Avatar URL */}
            {profile.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className="w-16 h-16 rounded-full mt-3 object-cover border"
              />
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-gray-600 mt-3">
                {profile.bio}
              </p>
            )}

            {/* Department */}
            {profile.department && (
              <p className="text-sm text-gray-500 mt-2">
                🎓 Department: {profile.department}
              </p>
            )}

            {/* Year */}
            {profile.yearOfStudy && (
              <p className="text-sm text-gray-500">
                📘 Year of Study: {profile.yearOfStudy}
              </p>
            )}

            {/* Skills */}
            {profile.skills && (
              <p className="text-sm text-gray-500 mt-2">
                🛠 Skills: {profile.skills}
              </p>
            )}

            {/* GitHub */}
            {profile.githubUrl && (
              <p className="text-sm text-blue-500 mt-2">
                🔗 <a href={profile.githubUrl} target="_blank">GitHub Profile</a>
              </p>
            )}

            {/* LinkedIn */}
            {profile.linkedinUrl && (
              <p className="text-sm text-blue-500 mt-1">
                🔗 <a href={profile.linkedinUrl} target="_blank">LinkedIn Profile</a>
              </p>
            )}

            {/* Edit button */}
            {isOwnProfile && (
              <button
                onClick={() => navigate("/profile/edit")}
                className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-gray-900">{posts.length}</div>
              <div className="text-xs text-gray-500 font-medium">Posts</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-gray-900">{totalLikes}</div>
              <div className="text-xs text-gray-500 font-medium">Total Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts section */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Grid size={18} className="text-brand-500" />
          <h2 className="font-display font-semibold text-lg text-gray-900">
            {isOwnProfile ? 'Your Posts' : `Posts by ${profile.name}`}
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="font-display font-semibold text-gray-700 text-lg mb-2">No posts yet</h3>
            {isOwnProfile ? (
              <>
                <p className="text-gray-400 text-sm mb-5">Share your first post with the campus!</p>
                <Link to="/create" className="btn-primary inline-flex items-center gap-2 text-sm">
                  <PenSquare size={15} /> Create post
                </Link>
              </>
            ) : (
              <p className="text-gray-400 text-sm">{profile.name} hasn't posted anything yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {posts.map(post => (
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
    </div>
  )
}
