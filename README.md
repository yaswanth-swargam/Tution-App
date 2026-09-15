<div align="center">

# 📚 TuitionApp

### Transform Education Through Real-Time Collaboration

A full-stack classroom management and real-time communication platform purpose-built for tuition centers, coaching institutes, and small educational organizations. Replace scattered communication channels with a unified, secure, and feature-rich learning ecosystem.

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Architecture](#-architecture)

</div>

---

## 🎯 Overview

TuitionApp eliminates the inefficiency of managing education through fragmented tools—WhatsApp groups, USB drives, and scattered emails. Built with modern full-stack technologies, it provides a cohesive platform where:

- **Admins** streamline class management, material distribution, and direct communication
- **Students** access organized study resources, collaborate with peers, and get AI-powered learning support
- **Both** enjoy real-time messaging with message read tracking and file sharing

The platform also features an **intelligent AI Study Partner** powered by Google GenAI and Groq, offering contextual learning assistance based on uploaded course materials.

### Why TuitionApp?

| Challenge | Solution |
|-----------|----------|
| Scattered communication channels | Unified platform with group & direct messaging |
| Disorganized study materials | Centralized material repository with metadata |
| Manual administrative tasks | Automated section & member management |
| Limited student engagement | Real-time collaboration + AI-powered learning |
| Security concerns | JWT auth, httpOnly cookies, role-based access control |

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based authentication** stored in httpOnly cookies for XSS protection
- **Password hashing** with bcrypt (salt rounds: 10)
- **Role-based access control (RBAC)** enforced at API level
  - Admin: Full management capabilities
  - Student: Access to enrolled sections only
- **Protected route guards** on both frontend and backend
- **Automatic token refresh** with cookie management

### 🗂️ Section Management (Admin Only)

- ✅ Create, rename, and delete sections (batches/classes)
- ✅ Add/remove students from sections with real-time updates
- ✅ View comprehensive member lists per section
- ✅ Manage section metadata and enrollment status

### 💬 Real-Time Messaging with Socket.IO

#### Group Chat
- **Instant message delivery** to all section members
- **Message history** persisted in MySQL
- **File sharing** support via Cloudinary
- **Read receipts** for messages with timestamp tracking
- **Automatic online/offline status**

#### Direct Messaging
- One-on-one encrypted conversations between any two users
- Full message history with pagination
- Message read tracking per conversation
- File sharing support
- **Self-message prevention** (enforced server-side)

### 📁 Study Materials Management

- Admins upload materials per section (PDF, docs, images, videos, etc.)
- Support for both file uploads and external links
- **Cloudinary integration** for reliable file storage and CDN delivery
- Material metadata tracking:
  - File type, size, and upload timestamp
  - Access permissions by section
  - Search and filter capabilities
- Students view all materials for enrolled sections

### 🔔 Notification System

- **In-app notifications** with unread badge counter
- **Email notifications** via Nodemailer (Gmail SMTP)
  - Password reset confirmations
  - New material uploads
  - Direct message alerts
- **Bulk notification management** (mark all as read)
- Notification preferences per user

### 🤖 AI Study Partner

Advanced AI-powered learning assistant tailored to course content:

- **Context-aware responses** based on uploaded study materials
- **Dual AI backends**: Google GenAI and Groq for flexibility
- **Learning workflows support**:
  - Chapter summarization
  - Quiz/test generation
  - Concept explanation
  - Problem-solving guidance
- **Conversation history** stored per user per section
- **Prompt engineering** for educational accuracy


---

## 🏗️ Tech Stack

### Frontend

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19.2.7 |
| **Build Tool** | Vite | 8.1.1 |
| **State Management** | Redux Toolkit | 2.12.0 |
| **Routing** | React Router v7 | 7.18.1 |
| **Styling** | Tailwind CSS + DaisyUI | 3.4.19 + 5.6.18 |
| **Real-Time** | Socket.IO Client | 4.8.3 |
| **HTTP Client** | Axios | 1.18.1 |
| **UI Components** | Lucide React, React Icons | 1.25.0, 5.7.0 |
| **Utilities** | date-fns, react-markdown | 4.4.0, 10.1.0 |

### Backend

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express | 5.2.1 |
| **Real-Time** | Socket.IO | 4.8.3 |
| **Database** | MySQL2 | 3.22.6 |
| **Authentication** | JWT, bcrypt | 9.0.3, 6.0.0 |
| **File Upload** | Multer | 2.2.0 |
| **File Storage** | Cloudinary | 2.11.0 |
| **Email** | Nodemailer | 10.0.0 |
| **AI APIs** | Google GenAI, Groq SDK | 2.21.0, 1.6.0 |
| **Dev Tools** | Nodemon | 3.1.14 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MySQL** 8.0+ (local or cloud instance)
- **Cloudinary Account** (for file storage)
- **Gmail Account** (for email notifications via SMTP)
- **Google GenAI API Key** (for AI Study Partner)
- **Groq API Key** (optional, for alternative AI backend)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yaswanth-swargam/Tution-App.git
cd Tution-App
```

#### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tution_app
DB_PORT=3306

# JWT & Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password

# AI APIs
GOOGLE_GENAI_API_KEY=your_google_genai_key
GROQ_API_KEY=your_groq_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
EOF

# Run migrations (if applicable)
# npm run migrate

# Start development server
npm run dev
```

The backend will start on `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
EOF

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

#### 4. Database Setup

Create the MySQL database and tables:

```sql
CREATE DATABASE tution_app;
USE tution_app;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') DEFAULT 'student',
  profilePicture VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sections Table
CREATE TABLE sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  adminId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (name, adminId)
);

-- Section Members Table
CREATE TABLE sectionMembers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sectionId INT NOT NULL,
  userId INT NOT NULL,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sectionId) REFERENCES sections(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (sectionId, userId)
);

-- Messages Table
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sectionId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT,
  fileUrl VARCHAR(255),
  fileName VARCHAR(255),
  fileSize INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sectionId) REFERENCES sections(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Message Reads Table
CREATE TABLE messageReads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  messageId INT NOT NULL,
  userId INT NOT NULL,
  readAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (messageId, userId)
);

-- Direct Messages Table
CREATE TABLE directMessages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  senderId INT NOT NULL,
  recipientId INT NOT NULL,
  content TEXT,
  fileUrl VARCHAR(255),
  fileName VARCHAR(255),
  fileSize INT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipientId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation (senderId, recipientId)
);

-- Study Materials Table
CREATE TABLE studyMaterials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sectionId INT NOT NULL,
  adminId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fileUrl VARCHAR(255),
  fileType VARCHAR(50),
  fileSize INT,
  isLink BOOLEAN DEFAULT FALSE,
  externalUrl VARCHAR(500),
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sectionId) REFERENCES sections(id) ON DELETE CASCADE,
  FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_section (sectionId)
);

-- Notifications Table
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  type ENUM('message', 'material', 'system') DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  relatedId INT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (userId, isRead)
);

-- AI Conversations Table
CREATE TABLE aiConversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  sectionId INT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sectionId) REFERENCES sections(id) ON DELETE CASCADE,
  INDEX idx_user_section (userId, sectionId)
);
```

### 5. Access the Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`

**Test Credentials** (after creating users):
- Admin: email: `admin@tution.com` | password: `admin123`
- Student: email: `student@tution.com` | password: `student123`

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response**: `{ userId, token, user }`

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: `{ userId, token, user }`

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

---

### Section Management (Admin)

#### Create Section
```http
POST /api/sections
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Class 10-A"
}
```

#### Get All Sections
```http
GET /api/sections
Authorization: Bearer {token}
```

#### Add Student to Section
```http
POST /api/sections/:sectionId/add-student
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 5
}
```

#### Remove Student from Section
```http
DELETE /api/sections/:sectionId/students/:userId
Authorization: Bearer {token}
```

---

### Messaging

#### Get Section Messages
```http
GET /api/messages/:sectionId?limit=20&offset=0
Authorization: Bearer {token}
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "sectionId": 1,
  "content": "Hello everyone!",
  "fileUrl": "https://cloudinary.com/..." // optional
}
```

#### Mark Message as Read
```http
POST /api/messages/:messageId/read
Authorization: Bearer {token}
```

#### Get Direct Messages
```http
GET /api/direct-messages/:userId?limit=20&offset=0
Authorization: Bearer {token}
```

#### Send Direct Message
```http
POST /api/direct-messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientId": 5,
  "content": "Hello!",
  "fileUrl": "https://cloudinary.com/..." // optional
}
```

---

### Study Materials

#### Upload Material
```http
POST /api/study-materials
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "sectionId": 1,
  "title": "Chapter 5 Notes",
  "description": "Notes on photosynthesis",
  "file": <binary>
}
```

#### Get Section Materials
```http
GET /api/study-materials/section/:sectionId
Authorization: Bearer {token}
```

#### Delete Material
```http
DELETE /api/study-materials/:materialId
Authorization: Bearer {token}
```

---

### AI Study Partner

#### Start AI Conversation
```http
POST /api/ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "sectionId": 1,
  "prompt": "Explain photosynthesis",
  "model": "gemini" // or "groq"
}
```

**Response**:
```json
{
  "conversationId": 123,
  "prompt": "Explain photosynthesis",
  "response": "Photosynthesis is...",
  "model": "gemini",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Get Conversation History
```http
GET /api/ai/conversations/:sectionId?limit=10&offset=0
Authorization: Bearer {token}
```

---

### Notifications

#### Get User Notifications
```http
GET /api/notifications?limit=10&offset=0
Authorization: Bearer {token}
```

#### Mark Notification as Read
```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer {token}
```

#### Mark All Notifications as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

---

## 🏛️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
└────────────────┬────────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼────┐      ┌────▼─────┐
    │ REST API│      │Socket.IO  │
    │ (Axios) │      │ (Real-time)
    └────┬────┘      └────┬─────┘
         │                │
    ┌────▼────────────────▼─────┐
    │   Express.js Backend      │
    │                            │
    │ ┌────────────────────────┐ │
    │ │ Routes & Controllers   │ │
    │ │ (Auth, Messages, etc)  │ │
    │ └────────────────────────┘ │
    │ ┌────────────────────────┐ │
    │ │ Middleware             │ │
    │ │ (Auth, Error, CORS)    │ │
    │ └────────────────────────┘ │
    │ ┌────────────────────────┐ │
    │ │ Services               │ │
    │ │ (AI, Mail, etc)        │ │
    │ └────────────────────────┘ │
    └────┬────────────────────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    │          │         │          │
┌───▼──┐  ┌───▼───┐ ┌──▼────┐ ┌──▼────────┐
│MySQL │  │Redis  │ │Google │ │Cloudinary │
│DB    │  │Cache  │ │GenAI  │ │Storage    │
└──────┘  └───────┘ └───────┘ └───────────┘
```

### Project Structure

```
TuitionApp/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── section.controller.js
│   │   │   ├── message.controller.js
│   │   │   ├── directMessage.controller.js
│   │   │   ├── studyMaterial.controller.js
│   │   │   ├── ai.controller.js
│   │   │   ├── aiConversation.controller.js
│   │   │   └── notification.controller.js
│   │   │
│   │   ├── services/
│   │   │   └── ai/
│   │   │       ├── ai.service.js
│   │   │       ├── context.service.js
│   │   │       └── prompts.js
│   │   │
│   │   ├── lib/
│   │   │   ├── db.js                    # MySQL connection pool
│   │   │   ├── socket.js                # Socket.IO initialization
│   │   │   ├── cloudinary.js            # File upload config
│   │   │   ├── mail.js                  # Email service
│   │   │   └── jwt.js                   # Token generation
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js       # JWT verification
│   │   │   ├── admin.middleware.js      # Admin role check
│   │   │   └── upload.js                # Multer configuration
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── sections.routes.js
│   │   │   ├── messages.routes.js
│   │   │   ├── directMessages.routes.js
│   │   │   ├── studyMaterials.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── notifications.routes.js
│   │   │   └── uploads.routes.js
│   │   │
│   │   ├── utils/
│   │   │   └── userMapper.js            # User object sanitization
│   │   │
│   │   ├── app.js                       # Express app setup
│   │   └── server.js                    # Entry point
│   │
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── navbar/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── UserMenu.jsx
    │   │   │   └── NotificationBell.jsx
    │   │   │
    │   │   ├── sidebar/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── SidebarItem.jsx
    │   │   │
    │   │   ├── ai/
    │   │   │   ├── AIChat.jsx
    │   │   │   ├── AISidebar.jsx
    │   │   │   ├── AIInput.jsx
    │   │   │   └── AIMessage.jsx
    │   │   │
    │   │   ├── materials/
    │   │   │   ├── MaterialCard.jsx
    │   │   │   ├── AddMaterialModal.jsx
    │   │   │   └── EditMaterialModal.jsx
    │   │   │
    │   │   └── common/
    │   │       ├── ProtectedRoute.jsx
    │   │       └── Loader.jsx
    │   │
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── CommunityPage.jsx
    │   │   ├── MaterialsPage.jsx
    │   │   ├── AIPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── NotificationsPage.jsx
    │   │   ├── SettingsPage.jsx
    │   │   └── NotFoundPage.jsx
    │   │
    │   ├── lib/
    │   │   ├── axios.js                 # Axios instance with interceptors
    │   │   ├── socket.js                # Socket.IO client setup
    │   │   └── upload.js                # File upload helper
    │   │
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── chatSlice.js
    │   │   │   ├── studyMaterialSlice.js
    │   │   │   └── notificationSlice.js
    │   │   └── index.js                 # Redux store config
    │   │
    │   ├── constants/
    │   │   ├── roles.js
    │   │   ├── routes.js
    │   │   └── navigation.js
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

### Data Flow

#### Authentication Flow
```
User Input → Login Form
    ↓
POST /api/auth/login
    ↓
Backend: Verify Email → Hash Compare → Generate JWT
    ↓
Response: { token, user }
    ↓
Frontend: Store in httpOnly Cookie → Redux State
    ↓
Redirect to Dashboard
```

#### Real-Time Messaging Flow
```
User Types Message → Message Input
    ↓
emit('new_message', { sectionId, content, ... })
    ↓
Backend: Validate → Save to DB → Broadcast to Section
    ↓
io.to(sectionId).emit('message_received', message)
    ↓
All Users in Section: Update Redux → Render UI
```

#### AI Interaction Flow
```
User Query → AI Input
    ↓
POST /api/ai/chat { prompt, sectionId, ... }
    ↓
Backend: Extract Context → Call GenAI/Groq → Save to DB
    ↓
Response: { response, conversationId, ... }
    ↓
Frontend: Update Chat History → Display Response
```

---

## 🔧 Development Guide

### Running Tests

```bash
# Backend
cd Backend
npm test

# Frontend
cd frontend
npm run lint
```

### Building for Production

#### Backend
```bash
# No build required for Node.js
# Just ensure all dependencies are installed
npm install --production
```

#### Frontend
```bash
cd frontend

# Build static assets
npm run build

# Preview production build
npm run preview
```

### Environment Variables Checklist

**Backend (.env)**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database credentials
- `JWT_SECRET` - Secret key for JWT signing
- `CLOUDINARY_*` - File storage credentials
- `GMAIL_USER`, `GMAIL_PASSWORD` - Email service credentials
- `GOOGLE_GENAI_API_KEY` - AI API key
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend (.env)**
- `VITE_API_URL` - Backend API URL
- `VITE_SOCKET_URL` - WebSocket server URL

---

## 🚀 Deployment

### Deploying Backend

#### On Vercel (with Node.js)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy: `vercel deploy`

#### On Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy automatically on push

#### On Railway/Heroku
1. Connect GitHub repository
2. Add environment variables
3. Deploy and monitor

### Deploying Frontend

#### On Vercel
```bash
npm install -g vercel
vercel
```

#### On Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Implement rate limiting
- [ ] Use environment variables for all secrets
- [ ] Test all features end-to-end
- [ ] Set up CI/CD pipeline

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Verify MySQL is running: `mysql -u root -p`
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in .env
- Ensure database exists: `CREATE DATABASE tution_app;`

#### 2. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `FRONTEND_URL` in backend .env
- Verify Socket.IO CORS config in `socket.js`
- Clear browser cache and cookies

#### 3. Socket.IO Connection Failed
```
WebSocket is closed before the connection is established
```
**Solution:**
- Verify backend is running on correct port
- Check `VITE_SOCKET_URL` in frontend .env
- Ensure firewall allows WebSocket connections

#### 4. File Upload Fails
```
Error uploading to Cloudinary
```
**Solution:**
- Verify Cloudinary credentials in .env
- Check file size limits (25MB default)
- Ensure CLOUDINARY_API_SECRET is correct

#### 5. AI Responses Not Working
```
Error: Invalid API key or quota exceeded
```
**Solution:**
- Verify API keys: `GOOGLE_GENAI_API_KEY`, `GROQ_API_KEY`
- Check API quota in respective dashboards
- Ensure API is enabled in Google/Groq console

### Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// In .env
DEBUG=tution:*
```

**Frontend:**
```javascript
// In main.jsx
window.DEBUG = true;
```

---

## 📝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request with description

### Coding Standards

- Use consistent naming conventions (camelCase for JS)
- Write meaningful commit messages
- Add comments for complex logic
- Test features before submitting PR
- Follow existing code structure

### Issues & Bugs

Found a bug? Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yaswanth Swargam**
- GitHub: [@yaswanth-swargam](https://github.com/yaswanth-swargam)
- LinkedIn: [yaswanth-swargam](https://www.linkedin.com/in/yaswanth-swargam/)
- Email: yaswanthswargam@gmail.com

---

## 🤝 Support

Need help? 
- 📖 Check existing [documentation](#-architecture)
- 🐛 Search [issues](https://github.com/yaswanth-swargam/Tution-App/issues)
- 💬 Open a new [discussion](https://github.com/yaswanth-swargam/Tution-App/discussions)
- ✉️ Email: yaswanthswargam@gmail.com

---

<div align="center">

### Show your support by giving this project a ⭐

Made with ❤️ for educators and learners

</div>
