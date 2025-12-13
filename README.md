# 📝 NoteSync

**NoteSync** is a real-time collaborative notes web application (Google Docs lite) built with **Next.js** and **MongoDB**. It allows users to create, edit, and share notes with others in real time, with role-based permissions and version history.

---

## 🚀 Features

* 🔐 **Authentication & Authorization**

  * Secure login & registration
  * JWT-based authentication
  * Role-based access (Owner / Editor / Viewer)

* 📝 **Notes & Documents**

  * Create, edit, delete notes
  * Auto-save support
  * Organize notes in a dashboard

* 🤝 **Real-Time Collaboration**

  * Live editing with multiple users
  * Real-time syncing using WebSockets (Socket.IO)
  * Presence & typing indicators

* 🔄 **Sharing & Permissions**

  * Share notes via email
  * Viewer / Editor permissions
  * Owner-only delete access

* 🕒 **Version History**

  * Track document changes
  * Restore previous versions

* 🔍 **Search & Performance**

  * Full-text search using MongoDB indexing
  * Optimized queries

* ☁️ **Deployment Ready**

  * Built for Vercel
  * MongoDB Atlas integration

---

## 🛠 Tech Stack

### Frontend

* **Next.js (App Router)**
* React
* Tailwind CSS
* Zustand (state management)

### Backend

* Next.js API Routes
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO (WebSockets)

### DevOps

* Vercel
* MongoDB Atlas

---

## 📁 Project Structure (Simplified)

```
app/
 ├─ api/
 │   ├─ auth/
 │   ├─ documents/
 │   └─ realtime/
 ├─ documents/
 │   └─ [id]/
 ├─ login/
 └─ register/

components/
models/
lib/
hooks/
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## ▶️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧠 Learning Outcomes

This project demonstrates:

* Clean backend architecture
* Real-time system design
* Secure authentication & authorization
* MongoDB schema design & indexing
* Production-ready Next.js application

---

## 📌 Future Improvements

* Comments on documents
* Offline mode
* Email notifications
* Activity logs
* Mobile-friendly editor

---

## 👨‍💻 Author

Built by **Kushal Karki** as an advanced full-stack learning project.

---

⭐ If you like this project, give it a star on GitHub!
