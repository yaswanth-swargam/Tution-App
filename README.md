<div align="center">

# 📚 TuitionApp

### A real-time classroom management and communication platform built for tuition centers and small educational institutes.

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-2-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat&logo=redux&logoColor=white)](https://redux-toolkit.js.org)

</div>

---

## What is TuitionApp?

TuitionApp replaces the scattered WhatsApp groups, USB drives, and paper-based workflows that most small institutes still rely on. Admins manage sections, upload study materials, and communicate with students — all in one place. Students get a clean, focused interface to access their materials and chat with their batch in real time.

---

## Features

### 🔐 Authentication & Security
- JWT authentication stored in **httpOnly cookies** — XSS-safe by design
- Password hashing with **bcrypt**
- **Role-based access control** (Admin vs Student) enforced at the API level — not just the frontend
- Protected and admin-only route guards in both frontend and backend

### 🗂️ Section Management (Admin)
- Create, rename, and delete sections (classes/batches)
- Add and remove students from sections
- View all members and available students per section

### 💬 Real-Time Messaging (Socket.IO)
- **Group chat** per section — messages broadcast to all section members instantly
- **Direct messaging** — one-on-one chat between any two members
- File sharing in chat (via Cloudinary)
- Message read tracking across group and direct conversations
- Self-message prevention enforced server-side

### 📁 Study Materials
- Admins upload materials per section (file or external link)
- Files stored on **Cloudinary** with metadata (name, type, size) persisted in MySQL
- Students can view and access all materials for their enrolled sections

### 🔔 Notifications
- In-app notifications with unread badge count
- Email notifications via **Nodemailer** (Gmail SMTP)
- Mark individual or all notifications as read

### 🤖 AI Study Partner *(UI ready, integration upcoming)*
- Prompt-based interface for chapter summaries, quiz generation, and note explanation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Redux Toolkit, React Router v7 |
| UI | DaisyUI, Tailwind CSS, Lucide React |
| Real-Time | Socket.IO (client + server) |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MySQL2 with connection pooling |
| Auth | JWT + bcrypt + httpOnly cookies |
| File Storage | Cloudinary + Multer |
| Email | Nodemailer (Gmail SMTP) |
| State Management | Redux Toolkit (4 slices: auth, chat, studyMaterial, notifications) |

---

## Architecture Overview

```
TuitionApp/
├── Backend/
│   └── src/
│       ├── controllers/        # Auth, Sections, Messages, Direct Messages,
│       │                       # Study Materials, Uploads, Notifications
│       ├── lib/                # MySQL pool, Socket.IO init, Cloudinary,
│       │                       # Nodemailer, JWT token generator
│       ├── middleware/         # Auth guard (protectRoute), Multer upload
│       ├── routes/             # Express route definitions (8 route files)
│       └── utils/              # userMapper (sanitizes DB user objects)
│
└── frontend/
    └── src/
        ├── components/         # Navbar, Sidebar, Chat UI, Materials,
        │                       # Notifications, Member Popover
        ├── constants/          # Roles, routes, navigation config
        ├── layouts/            # DashboardLayout (wraps all protected pages)
        ├── lib/                # Axios instance, Socket.IO client, upload helper
        ├── pages/              # Community, Materials, AI, Profile,
        │                       # Settings, Notifications, Login, 404
        ├── routes/             # ProtectedRoute, AdminRoute, PublicRoute guards
        └── store/              # Redux slices + async thunks
                                # (auth, chat, studyMaterial, notifications)
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8+
- Cloudinary account (free tier works)
- Gmail account with App Password enabled

### 1. Clone the repository

```bash
git clone https://github.com/yaswanth-swargam/Tution-App.git
cd Tution-App
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
PORT=5001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tuitionapp

# Auth
JWT_SECRET=your_jwt_secret_key

# Client
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

```bash
npm run dev     # starts with nodemon on port 5001
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev     # starts on http://localhost:5173
```

---

## API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/signin` | Public |
| POST | `/api/auth/logout` | Protected |
| GET | `/api/auth/checkAuth` | Protected |

### Sections
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/sections` | Protected |
| POST | `/api/sections` | Admin |
| PUT | `/api/sections/:id` | Admin |
| DELETE | `/api/sections/:id` | Admin |
| GET | `/api/sections/:id/members` | Protected |
| POST | `/api/sections/:id/members` | Admin |
| DELETE | `/api/sections/:id/members/:userId` | Admin |

### Messaging
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/messages/:sectionId` | Protected |
| POST | `/api/messages/:sectionId` | Protected |
| GET | `/api/direct-messages/:userId` | Protected |
| POST | `/api/direct-messages/:userId` | Protected |

### Study Materials
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/study-materials/:sectionId` | Protected |
| POST | `/api/study-materials/:sectionId` | Admin |
| DELETE | `/api/study-materials/:id` | Admin |

### Notifications
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/notifications` | Protected |
| PATCH | `/api/notifications/:id/read` | Protected |
| PATCH | `/api/notifications/read-all` | Protected |

---

## Design Decisions Worth Noting

**Why httpOnly cookies for JWT?**
localStorage is accessible via JavaScript and vulnerable to XSS. httpOnly cookies are invisible to client-side scripts — even if malicious JS runs on the page, it cannot read the token.

**Why MySQL over MongoDB?**
The data relationships in this app (users → sections → members → messages → materials) are inherently relational. MySQL with proper foreign keys and JOIN queries gives stronger consistency guarantees than document-based storage for this use case.

**Why Redux Toolkit with 4 separate slices?**
Keeping auth, chat, study materials, and notifications in isolated slices prevents the state from becoming a monolith. Each slice owns its own loading/error states, making debugging and testing significantly easier.

---

## Author

**Yaswanth Swargam** — Full Stack Developer & B.Tech CSE Student, RGUKT Ongole

[![GitHub](https://img.shields.io/badge/GitHub-yaswanth--swargam-181717?style=flat&logo=github)](https://github.com/yaswanth-swargam)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-yaswanth--swargam-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/yaswanth-swargam)
