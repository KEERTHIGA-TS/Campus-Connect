import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { postApi, commentApi } from '../api'
import useAuthStore from '../context/authStore'
import { PageLoader } from '../components/Spinner'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import {
  Heart, MessageCircle, Trash2, ArrowLeft, Send,
  Download, Calendar, Tag, User
} from 'lucide-react'
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

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [commenting, setCommenting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        postApi.getById(id),
        commentApi.getByPost(id),
      ])
      setPost(postRes.data.data)
      setComments(commentsRes.data.data)
    } catch {
      toast.error('Post not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => { fetchData() }, [fetchData])

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await postApi.toggleLike(id)
      setPost(res.data.data)
    } catch {
      toast.error('Failed to update like')
    }
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await postApi.delete(id)
      toast.success('Post deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    if (!user) { navigate('/login'); return }
    setCommenting(true)
    try {
      const res = await commentApi.add(id, newComment.trim())
      setComments(prev => [...prev, res.data.data])
      setNewComment('')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setCommenting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.delete(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  if (loading) return <PageLoader />
  if (!post) return null

  const isOwner = user?.userId === post.userId
  const isLiked = user && post.likedByUsers?.includes(user.userId)
  const tagColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 fade-up">

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to feed
      </button>

      {/* Post */}
      <article className="card overflow-hidden mb-6">

        {/* Image */}
        {post.fileUrl && (
          <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
            {post.fileType?.startsWith('image/') ? (
              <>
                <img
                  src={`/files/${post.fileUrl}`}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <a
                  href={`${window.location.origin}/files/${post.fileUrl}`}
                  download
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download size={13} /> Download
                </a>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 h-full w-full bg-gray-50 ring-1 ring-gray-200 ring-inset relative rounded-t-xl">
                {getFileIcon(post.fileType)}

                <span className="text-sm font-semibold text-gray-600 px-4 text-center truncate w-full">
                  {post.fileName}
                </span>

                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {post.fileType?.split('/').pop()}
                </span>

                <a
                  href={`/files/${post.fileUrl}`}
                  download
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download size={13} /> Download
                </a>
              </div>
            )}
          </div>
        )}

        <div className="p-7">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-4">
            <span className={`tag ${tagColor}`}>
              <Tag size={11} className="mr-1" /> {post.category}
            </span>
            {isOwner && (
              <button onClick={handleDeletePost} className="btn-danger flex items-center gap-1.5">
                <Trash2 size={14} /> Delete post
              </button>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-4 leading-snug">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">
              {post.description}
            </p>
          )}

          {/* Author + timestamp */}
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <Link
              to={`/profile/${post.userId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-600 font-semibold">
                  {post.userName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{post.userName}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDistanceToNow(new Date(post.createdAt + 'Z'), { addSuffix: true })}
                </p>
              </div>
            </Link>

            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isLiked
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
            </button>
          </div>
        </div>
      </article>

      {/* Comments section */}
      <section className="card p-7">
        <h2 className="font-display font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle size={20} className="text-brand-500" />
          Comments ({comments.length})
        </h2>

        {/* Add comment */}
        {user ? (
          <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-600 font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment…"
                className="input-field flex-1"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || commenting}
                className="btn-primary px-4 flex items-center gap-1.5"
              >
                {commenting ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <Send size={15} />}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-brand-50 rounded-xl p-4 mb-6 text-sm text-brand-700">
            <Link to="/login" className="font-semibold hover:underline">Sign in</Link> to join the conversation.
          </div>
        )}

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 group">
                <Link to={`/profile/${comment.userId}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold text-xs">
                      {comment.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Link>
                <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <Link
                      to={`/profile/${comment.userId}`}
                      className="font-medium text-sm text-gray-800 hover:text-brand-500 transition-colors"
                    >
                      {comment.userName}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt + 'Z'), { addSuffix: true })}
                      </span>
                      {user?.userId === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}