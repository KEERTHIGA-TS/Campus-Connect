import { Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Trash2, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import useAuthStore from '../context/authStore'
import { postApi } from '../api'
import toast from 'react-hot-toast'
import { FileText, FileSpreadsheet, Presentation, File, Archive, Image } from 'lucide-react'

const CATEGORY_COLORS = {
  Academic: 'bg-blue-50 text-blue-600',
  Events: 'bg-purple-50 text-purple-600',
  Sports: 'bg-green-50 text-green-600',
  Campus: 'bg-yellow-50 text-yellow-700',
  Clubs: 'bg-pink-50 text-pink-600',
  Jobs: 'bg-orange-50 text-orange-600',
  General: 'bg-gray-100 text-gray-600',
}

const getFileIcon = (fileType) => {
  if (fileType === 'application/pdf')
    return <FileText size={40} className="text-red-400" />
  if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return <FileText size={40} className="text-blue-400" />
  if (fileType === 'application/vnd.ms-powerpoint' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    return <FileText size={40} className="text-orange-400" />
  if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return <FileSpreadsheet size={40} className="text-green-400" />
  if (fileType === 'text/plain')
    return <FileText size={40} className="text-gray-400" />
  if (fileType === 'application/zip' || fileType === 'application/x-rar-compressed')
    return <Archive size={40} className="text-yellow-400" />
  return <File size={40} className="text-gray-400" />
}

export default function PostCard({ post, onDelete, onLike }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const isOwner = user?.userId === post.userId
  const isLiked = user && post.likedByUsers?.includes(user.userId)
  const tagColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General

  const handleLike = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    try {
      const res = await postApi.toggleLike(post.id)
      onLike?.(res.data.data)
    } catch {
      toast.error('Failed to update like')
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!window.confirm('Delete this post?')) return
    try {
      await postApi.delete(post.id)
      toast.success('Post deleted')
      onDelete?.(post.id)
    } catch {
      toast.error('Failed to delete post')
    }
  }

  return (
    <Link to={`/post/${post.id}`} className="block group">
      <article className="card overflow-hidden transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">

        {/* Post preview */}
        {post.fileUrl && (
          <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
            {post.fileType?.startsWith('image/') ? (
              <img
                src={`/files/${post.fileUrl}`}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-full w-full bg-gray-50 ring-1 ring-gray-200 ring-inset relative rounded-t-xl">
                {getFileIcon(post.fileType)}
                <span className="text-sm font-semibold text-gray-600 px-4 text-center truncate w-full text-center">
                  {post.fileName}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {post.fileType?.split('/').pop()}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-5">
          {/* Category + Owner actions */}
          <div className="flex items-center justify-between mb-3">
            <span className={`tag ${tagColor}`}>{post.category}</span>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete post"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-gray-900 text-lg leading-snug mb-2 line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {post.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            {/* Author */}
            <div
              onClick={(e) => {
                e.preventDefault();
                navigate(`/profile/${post.userId}`);
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-600 font-semibold text-xs">
                  {post.userName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600 font-medium">{post.userName}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                  }`}
              >
                <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{post.likeCount}</span>
              </button>

              <span className="flex items-center gap-1 text-sm text-gray-400">
                <MessageCircle size={15} />
              </span>

              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={12} />
                {formatDistanceToNow(new Date(post.createdAt + 'Z'), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
