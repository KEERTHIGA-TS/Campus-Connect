# 🎓 Campus Connect

A full-stack social media platform built for college communities — enabling students to share posts, upload files, interact through likes and comments, and connect with peers on campus.

---

# ✨ Features

## 📝 Posts & Content
- Create posts with title, description, and category
- Upload attachments — Images, PDFs, DOCX, PPTX, ZIP (up to 10MB)
- Category filter — Academic, Events, Sports, Campus, Clubs, Jobs, General
- Like and comment on posts
- Delete your own posts and comments

## 👤 User Features
- JWT-based authentication (Register / Login)
- Personal profile page with post history
- Total likes received tracker
- Protected routes for authenticated users

## 🐳 DevOps & Deployment
- Fully containerized with Docker & Docker Compose
- Nginx reverse proxy for frontend + API routing
- Persistent PostgreSQL volume for data safety
- Public URL via ngrok tunnel

---

# 🛠 Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, JavaScript, React Router  
**Backend:** Spring Boot, Java  
**Database:** PostgreSQL  
**Authentication:** JWT  
**State Management:** Zustand  
**HTTP Client:** Axios  
**Icons:** Lucide React  
**Build Tool:** Vite  
**Containerization:** Docker, Docker Compose  
**Web Server:** Nginx  

---

# 🌐 Live Demo

> ⚠️ This app is self-hosted and tunneled via **ngrok**. The public URL may change on restart.  
> To run it yourself, follow the steps below.

🔗 **Current Live URL (may change):**  
👉 https://unify-catsup-figure.ngrok-free.dev

---

# 📸 Screenshots

## Home / Feed Page
![Home Page](screenshots/home.png)

## Register Page
![Register](screenshots/register.png)

## Login Page
![Login](screenshots/login.png)

## Create Post Page
![Create Post](screenshots/create-post.png)

## Post Detail Page
![Post Detail](screenshots/post-detail.png)

## Profile Page
![Profile](screenshots/profile.png)

---

# 🚀 Running Locally

### Prerequisites
- Docker Desktop installed

### Steps
```bash
git clone https://github.com/KEERTHIGA-TS/campus-connect.git
cd campus-connect
docker compose up -d
```

Visit `http://localhost:3000`

### Public URL via ngrok (optional)
To expose the app to the internet, install [ngrok](https://ngrok.com) and run:
```bash
ngrok http 3000
```
This generates a public HTTPS URL that tunnels to your local Docker container.

---

# 📁 Project Structure

```
campus-connect/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── context/
│   ├── nginx.conf
│   └── Dockerfile
├── backend/           # Spring Boot
│   ├── src/
│   │   └── main/java/com/campusconnect/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── entity/
│   │       └── security/
│   └── Dockerfile
└── docker-compose.yml
```
