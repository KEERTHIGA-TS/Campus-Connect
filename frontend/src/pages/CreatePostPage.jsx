import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { postApi } from '../api'
import toast from 'react-hot-toast'
import { Image, X, Upload, PenSquare } from 'lucide-react'

const CATEGORIES = ['Academic', 'Events', 'Sports', 'Campus', 'Clubs', 'Jobs', 'General']

export default function CreatePostPage() {
  const [form, setForm] = useState({ title: '', description: '', category: 'General' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB')
      return
    }

    setFile(selectedFile)

    if (selectedFile.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selectedFile))
    } else {
      setPreview(null)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category', form.category)
      if (file) fd.append('file', file)

      const res = await postApi.create(fd)
      toast.success('Post published!')
      navigate(`/post/${res.data.data.id}`)
    } catch (err) {
      if (err.response?.status === 413) {
        toast.error('File is too large. Maximum size is 10 MB')
      } else {
        toast.error(err.response?.data?.message || 'Failed to create post')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 fade-up">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <PenSquare size={20} className="text-brand-500" />
          <h1 className="font-display font-bold text-2xl text-gray-900">New Post</h1>
        </div>
        <p className="text-gray-500 text-sm">Share something with your campus community</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What's the headline?"
              className="input-field text-lg font-medium"
              maxLength={120}
              required
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/120</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${form.category === cat
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell your campus what this is about…"
              rows={5}
              className="input-field resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment (optional)
            </label>

            {preview ? (
              <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover"
                />

                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : file ? (
              <div className="border rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm truncate">
                  📎 {file.name}
                </span>

                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-10 flex flex-col items-center gap-2 text-gray-400 hover:border-brand-300 hover:text-brand-400"
              >
                <Upload size={24} />
                <span className="text-sm font-medium">
                  Click to upload file
                </span>

                <span className="text-xs">
                  Images, PDF, DOCX, PPTX, ZIP (Max 10MB)
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <Upload size={16} />}
              {loading ? 'Publishing…' : 'Publish post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
