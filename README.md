# NoteSync

> A real-time collaborative note-taking and document editor built with **Next.js**, **MongoDB**, **TipTap**, and **Socket.IO**.

NoteSync is a full-stack collaborative document editor inspired by modern productivity tools such as Google Docs. It allows users to create, edit, and share rich-text documents while collaborating with others in real time. The project was built to explore modern full-stack development concepts including authentication, authorization, WebSockets, and rich-text editing.

---

## ✨ Features

### 🔐 Authentication

* User registration with securely hashed passwords
* JWT-based authentication
* HTTP-only authentication cookies
* Persistent user sessions
* Secure logout

### 📄 Document Management

* Create rich-text documents
* Edit document titles and content
* View owned and shared documents
* Track creation and last edited timestamps

### 🤝 Document Sharing

* Share documents using email addresses
* Read and write permission levels
* Prevent duplicate sharing
* Separate sharing model for scalability

### ⚡ Real-Time Collaboration

* Live document synchronization using Socket.IO
* Automatic room management for each document
* Typing indicators
* Instant updates across connected clients

### ✍️ Rich Text Editing

Powered by TipTap with support for:

* Bold
* Italic
* Underline
* Highlight
* Links
* Images
* Tables
* Text alignment
* Subscript
* Superscript
* Text styling
* StarterKit extensions

### 🎨 User Experience

* Responsive dashboard
* Modern editor interface
* Protected routes
* Loading and authentication states
* Client-side state management with Zustand

---

# 🚀 Tech Stack

| Category         | Technologies                     |
| ---------------- | -------------------------------- |
| Frontend         | Next.js 16, React 19, TypeScript |
| Backend          | Next.js Route Handlers, Node.js  |
| Database         | MongoDB, Mongoose                |
| Authentication   | JWT, HTTP-only Cookies, bcrypt   |
| Realtime         | Socket.IO                        |
| Editor           | TipTap                           |
| State Management | Zustand                          |
| HTTP Client      | Axios                            |
| Styling          | CSS Modules                      |

---

# 🏗️ Project Architecture

```text
Client
   │
   ▼
Next.js App Router
   │
   ├────────────── API Routes
   │
   ├────────────── Socket.IO Server
   │
   ▼
MongoDB Database
```

---

# 📁 Project Structure

```text
app/
│
├── api/
│   ├── auth/
│   └── documents/
│
├── create/
├── documents/
├── login/
├── logout/
├── register/
├── share/
│
components/
│   └── editor/
│
hooks/
lib/
models/
public/
stores/
styles/
```

---

# 📚 Data Models

## User

Stores user account information.

Fields include:

* username
* email
* password (hashed)
* verification fields

---

## Document

Represents an editable note.

Stores:

* title
* HTML content
* owner
* collaborators
* timestamps

---

## Share

Represents document permissions.

Stores:

* document reference
* user reference
* permission level
* timestamps

---

# 🔄 Application Flow

```text
User Registers/Login
          │
          ▼
     Dashboard
          │
          ▼
Create Document
          │
          ▼
Open Editor
          │
          ▼
Share Document
          │
          ▼
Multiple Users Join
          │
          ▼
Real-Time Editing
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Login and create session |
| GET    | `/api/auth/me`       | Get authenticated user   |
| POST   | `/api/auth/logout`   | Logout user              |

---

## Documents

| Method | Endpoint                       | Description                      |
| ------ | ------------------------------ | -------------------------------- |
| GET    | `/api/documents`               | Fetch owned and shared documents |
| POST   | `/api/documents`               | Create document                  |
| POST   | `/api/documents/[id]/share`    | Share document                   |
| GET    | `/api/documents/[id]/versions` | Version history scaffold         |

---

# 🔒 Security

* Passwords hashed using bcrypt
* JWT authentication
* HTTP-only cookies
* Protected API routes
* Ownership verification
* Duplicate share prevention
* Permission-based access control

---

# 💡 What I Learned

Building NoteSync helped me gain practical experience with:

* Next.js App Router
* Server and Client Components
* JWT Authentication
* HTTP-only Cookies
* MongoDB relationships
* Mongoose population
* Permission systems
* Socket.IO rooms
* Real-time synchronization
* Rich-text editors with TipTap
* Zustand state management
* Protected routing
* Building a custom Node.js server alongside Next.js

---

# ⚙️ Environment Variables

Create a `.env.local` file.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone <repository-url>
```

```bash
cd notesync
```

---

## Install dependencies

```bash
npm install
```

---

## Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Build for production

```bash
npm run build
```

---

## Start production server

```bash
npm start
```

---

# 🧠 Design Decisions

* JWT stored in HTTP-only cookies for improved security.
* Separate `Share` collection to simplify permission management.
* Socket.IO rooms isolate real-time updates per document.
* TipTap provides an extensible rich-text editing experience.
* Zustand keeps editor state lightweight and predictable.

---

# 🚧 Future Improvements

* Document version history
* Restore previous versions
* Inline comments
* User mentions
* Collaborative cursors
* Presence indicators
* Offline editing
* Search functionality
* Folder organization
* Export to PDF and Markdown
* Activity logs
* Mobile editor improvements
* Unit and integration tests

---

# 👨‍💻 Author

**Kushal Karki**

Built as a full-stack learning project to explore authentication, authorization, real-time collaboration, and scalable application architecture using the modern JavaScript ecosystem.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
