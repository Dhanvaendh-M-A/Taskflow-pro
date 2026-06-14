# 🚀 TaskFlow Pro

> **Premium AI-powered Task Management Application** with real-time collaboration, beautiful analytics, and seamless team workflows — powered by **MongoDB**.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.9-880000?style=flat-square&logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

### 🎯 Core Functionality
- **🔐 Multi-Provider Authentication** — Email/Password, GitHub OAuth, Google OAuth
- **📋 Advanced Task Management** — Create, update, delete with rich metadata
- **📊 Kanban Board & List Views** — Visual columns with smooth animations
- **🏗️ Project Organization** — Color-coded projects with team member management
- **👥 Team Collaboration** — Role-based access (Owner, Admin, Member, Viewer)

### 🎨 Premium Design
- **🌙 Dark/Light Mode** — Seamless theme switching with next-themes
- **✨ Framer Motion Animations** — Smooth transitions, stagger effects, micro-interactions
- **🎭 Glass Morphism Effects** — Modern backdrop-filter UI elements
- **📱 Fully Responsive** — Mobile-first design that works on all devices
- **🎯 Custom Scrollbars** — Premium scrollbar styling

### 📈 Analytics & Insights
- **📊 Real-time Dashboard** — Task completion rates, priority distribution
- **📅 Weekly Progress Charts** — Visual bar charts for productivity tracking
- **🔔 Smart Notifications** — Real-time notification system with unread badges
- **📝 Activity Logs** — Complete audit trail of all actions

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Auth** | NextAuth.js v5 (OAuth + Credentials) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **State** | React Query (TanStack) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier available)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/taskflow-pro.git
cd taskflow-pro
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# MongoDB Atlas (Get from cloud.mongodb.com)
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/taskflow_pro?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# OAuth (Optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a **Free (M0)** cluster
3. Create a database user
4. Add your IP to the allowlist (or `0.0.0.0/0` for development)
5. Copy the connection string

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/taskflow-pro.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click Deploy 🚀

3. **MongoDB Atlas Connection**
   - Whitelist Vercel IPs in MongoDB Atlas (or use `0.0.0.0/0` for dev)
   - Ensure `MONGODB_URI` is set in Vercel environment variables

### MongoDB Atlas Free Tier (M0)

- **512 MB storage** — perfect for development and small apps
- **500 max connections** — use connection pooling
- **No expiration** — free forever
- **Auto-pause** after 30 days of inactivity (can be resumed)

---

## 📁 Project Structure

```
taskflow-pro/
├── app/
│   ├── api/                 # API Routes
│   │   ├── auth/            # NextAuth + Register
│   │   ├── tasks/           # Task CRUD
│   │   ├── projects/        # Project CRUD
│   │   ├── dashboard/       # Stats & Analytics
│   │   └── notifications/   # Notification system
│   ├── auth/                # Auth pages (signin/signup)
│   ├── dashboard/           # Dashboard pages
│   │   ├── page.tsx         # Overview
│   │   ├── tasks/           # Task management
│   │   ├── projects/        # Project management
│   │   ├── team/            # Team members
│   │   └── settings/        # User settings
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard components
│   │   ├── sidebar.tsx      # Collapsible sidebar
│   │   └── header.tsx       # Top navigation
│   └── providers.tsx        # Context providers
├── lib/
│   ├── mongodb.ts           # MongoDB connection
│   ├── models/              # Mongoose schemas
│   │   ├── user.ts          # User model
│   │   ├── project.ts       # Project model
│   │   ├── task.ts          # Task model
│   │   ├── team-member.ts   # TeamMember model
│   │   ├── comment.ts       # Comment model
│   │   ├── attachment.ts    # Attachment model
│   │   ├── notification.ts  # Notification model
│   │   └── activity-log.ts  # ActivityLog model
│   ├── auth.ts              # NextAuth config
│   └── utils.ts             # Utility functions
├── types/                   # TypeScript types
├── public/                  # Static assets
├── middleware.ts             # Route protection
├── README.md                # This file
├── DEPLOYMENT.md            # Deployment guide
├── LINKEDIN_POST.md         # LinkedIn templates
└── vercel.json              # Vercel config
```

---

## 🎯 Key Features Deep Dive

### 🔐 Authentication
- **Credentials Provider** — Email/password with bcrypt hashing
- **GitHub OAuth** — One-click sign in
- **Google OAuth** — Seamless Google account integration
- **Session Management** — JWT strategy with 30-day sessions
- **Protected Routes** — Middleware-based route guarding

### 📋 Task Management
- **Rich Task Creation** — Title, description, priority, due dates, tags
- **Kanban Board** — Visual columns with drag-ready design
- **List View** — Sortable, filterable task list
- **Subtasks** — Hierarchical task structure
- **Assignments** — Assign tasks to team members
- **Comments** — Threaded discussions on tasks
- **Attachments** — File upload support (ready)

### 📊 Analytics Dashboard
- **Task Overview** — Total, completed, in-progress, overdue counts
- **Status Distribution** — Visual progress bars
- **Priority Breakdown** — Color-coded priority badges
- **Weekly Charts** — Animated bar charts showing productivity
- **Activity Feed** — Real-time activity log

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbo |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React Framework
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful UI components
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database service
- [Mongoose](https://mongoosejs.com/) — Elegant MongoDB object modeling
- [Framer Motion](https://www.framer.com/motion/) — Production-ready animations
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

---

<div align="center">
  <p>Built with ❤️ using Next.js 15, MongoDB, and Tailwind CSS</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
