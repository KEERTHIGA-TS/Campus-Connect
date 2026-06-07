import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────
// Attach JWT token to every request automatically
// ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─────────────────────────────────────────────
// Global response handler (401 logout)
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cc_token");
      localStorage.removeItem("cc_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// ─────────────────────────────────────────────
// USER API
// ─────────────────────────────────────────────
export const userApi = {
  getById: (id) => {
    if (!id) throw new Error("userId is required for getById");
    return api.get(`/users/${id}`);
  },

  getPosts: (id) => {
    if (!id) throw new Error("userId is required for getPosts");
    return api.get(`/users/${id}/posts`);
  },

  updateProfile: (id, data) => {
    if (!id) throw new Error("userId is required for updateProfile");
    return api.put(`/users/${id}`, data);
  },
};

// ─────────────────────────────────────────────
// POSTS API
// ─────────────────────────────────────────────
export const postApi = {
  getAll: () => api.get("/posts"),

  getById: (id) => {
    if (!id) throw new Error("postId is required");
    return api.get(`/posts/${id}`);
  },

  create: (formData) =>
    api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => {
    if (!id) throw new Error("postId is required");
    return api.delete(`/posts/${id}`);
  },

  toggleLike: (id) => {
    if (!id) throw new Error("postId is required");
    return api.post(`/posts/${id}/like`);
  },
};

// ─────────────────────────────────────────────
// COMMENTS API
// ─────────────────────────────────────────────
export const commentApi = {
  getByPost: (postId) => {
    if (!postId) throw new Error("postId is required");
    return api.get(`/comments/post/${postId}`);
  },

  add: (postId, text) => {
    if (!postId) throw new Error("postId is required");
    return api.post(`/comments/post/${postId}`, { text });
  },

  delete: (commentId) => {
    if (!commentId) throw new Error("commentId is required");
    return api.delete(`/comments/${commentId}`);
  },
};

export default api;