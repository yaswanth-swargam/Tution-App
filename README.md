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

The platform also integrates an **LLM-powered AI Study Partner** to provide students with AI-assisted learning support based on their study materials.

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

### 🤖 AI Study Partner
- Integrated **LLM API** for AI-powered study assistance
- Students can interact with the AI through a prompt-based interface
- Provides contextual responses based on uploaded course materials
- Supports learning workflows such as chapter summaries, quiz generation, and note explanation

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
| AI Integration | LLM API |
| State Management | Redux Toolkit (4 slices: auth, chat, studyMaterial, notifications) |

---

## Architecture Overview

```text
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
