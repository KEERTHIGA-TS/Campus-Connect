# 🎓 Campus Connect

A full-stack social media platform built for college students — share posts, like content, comment on discussions, and connect with your campus community.

---

## 📁 Project Structure

```
campus-connect/
├── backend/                         # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/campusconnect/
│       ├── CampusConnectApplication.java
│       ├── config/
│       │   ├── FileStorageConfig.java     # Serves /files/**
│       │   ├── GlobalExceptionHandler.java
│       │   └── SecurityConfig.java        # JWT + CORS
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── CommentController.java
│       │   ├── PostController.java
│       │   └── UserController.java
│       ├── dto/
│       │   ├── ApiResponse.java
│       │   ├── AuthDto.java
│       │   ├── CommentDto.java
│       │   ├── PostDto.java
│       │   └── UserDto.java
│       ├── entity/
│       │   ├── Comment.java
│       │   ├── Post.java
│       │   └── User.java
│       ├── repository/
│       │   ├── CommentRepository.java
│       │   ├── PostRepository.java
│       │   └── UserRepository.java
│       ├── security/
│       │   ├── CustomUserDetailsService.java
│       │   ├── JwtAuthFilter.java
│       │   └── JwtUtil.java
│       └── service/
│           ├── AuthService.java
│           ├── CommentService.java
│           ├── FileStorageService.java
│           ├── PostService.java
│           └── UserService.java
│
└── frontend/                        # React + Vite application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                  # Routes
        ├── main.jsx                 # Entry point
        ├── index.css                # Tailwind + custom styles
        ├── api/
        │   └── index.js             # Axios instance + all API calls
        ├── context/
        │   └── authStore.js         # Zustand auth store
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PostCard.jsx
        │   └── Spinner.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── HomePage.jsx
            ├── CreatePostPage.jsx
            ├── PostDetailPage.jsx
            └── ProfilePage.jsx
```

---

## 🌐 API Endpoints

### Auth  (`/api/auth`)
| Method | Endpoint             | Auth Required | Description        |
|--------|----------------------|---------------|--------------------|
| POST   | `/api/auth/register` | No            | Register new user  |
| POST   | `/api/auth/login`    | No            | Login, returns JWT |

### Users  (`/api/users`)
| Method | Endpoint               | Auth Required | Description           |
|--------|------------------------|---------------|-----------------------|
| GET    | `/api/users/{id}`      | No            | Get user by ID        |
| GET    | `/api/users/{id}/posts`| No            | Get all posts by user |

### Posts  (`/api/posts`)
| Method | Endpoint              | Auth Required | Description                  |
|--------|-----------------------|---------------|------------------------------|
| GET    | `/api/posts`          | No            | Get all posts (feed)         |
| GET    | `/api/posts/{id}`     | No            | Get post by ID               |
| POST   | `/api/posts`          | Yes           | Create post (multipart/form) |
| DELETE | `/api/posts/{id}`     | Yes (owner)   | Delete post                  |
| POST   | `/api/posts/{id}/like`| Yes           | Toggle like on post          |

### Comments  (`/api/comments`)
| Method | Endpoint                      | Auth Required | Description               |
|--------|-------------------------------|---------------|---------------------------|
| GET    | `/api/comments/post/{postId}` | No            | Get comments for a post   |
| POST   | `/api/comments/post/{postId}` | Yes           | Add comment to a post     |
| DELETE | `/api/comments/{commentId}`   | Yes (owner)   | Delete own comment        |

### Files
| Method | Endpoint             | Auth Required | Description        |
|--------|----------------------|---------------|--------------------|
| GET    | `/files/{filename}`  | No            | Serve uploaded file|

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+
- PostgreSQL 14+

---

## 🚀 Setup & Run

### 1. PostgreSQL Setup

```sql
CREATE DATABASE campus_connect;
-- Default user: postgres / password: postgres
-- Or update application.properties accordingly
```

### 2. Backend Setup

```bash
cd campus-connect/backend

# (Optional) Edit DB credentials
nano src/main/resources/application.properties

# Build and run
./mvnw spring-boot:run
# OR on Windows:
mvnw.cmd spring-boot:run
```

The backend starts on **http://localhost:8080**  
Uploaded files are stored in `backend/uploads/` and served at `/files/{filename}`

### 3. Frontend Setup

```bash
cd campus-connect/frontend

npm install
npm run dev
```

The frontend starts on **http://localhost:5173**  
API requests are proxied to `localhost:8080` via Vite config — no CORS issues.

---

## 🔐 Auth Flow

1. User registers → JWT returned → stored in `localStorage`
2. Every API call sends `Authorization: Bearer <token>` header
3. Spring's `JwtAuthFilter` validates and sets `SecurityContext`
4. Protected routes return `403` if token missing/expired
5. Frontend Axios interceptor catches `401` → auto-redirects to `/login`

---

## 🧩 Key Design Decisions

| Decision | Reason |
|---|---|
| JWT in localStorage | Simple for SPA; acceptable for campus MVP |
| Zustand for state | Lightweight vs Redux; simpler than Context |
| Multipart POST for posts | Single request for text + image |
| ElementCollection for likes | Avoids a separate Like entity/table |
| `@PrePersist` for timestamps | No manual date management |
| Vite proxy | Avoids CORS complexity in dev |

---

## 🌟 Features

- ✅ JWT Authentication (register + login)
- ✅ Create posts with image upload
- ✅ Like system (no duplicate likes per user)
- ✅ Comment system with delete
- ✅ Category filtering on feed
- ✅ Profile page with post grid + stats
- ✅ File download from posts
- ✅ Responsive design (mobile-friendly)
- ✅ Global error handling
- ✅ Toast notifications
- ✅ Owner-only delete (post + comment)
