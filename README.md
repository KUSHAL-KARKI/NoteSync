# NoteSync

NoteSync is a collaborative note-taking and document editor built with Next.js, MongoDB, TipTap, and Socket.IO. The app supports user authentication, document creation, sharing, and real-time editing so multiple users can work on the same note at the same time.

## Overview

The project is structured as a full-stack Next.js application with API routes for authentication and document management, client-side editor components for rich text editing, and a custom Node server that hosts both Next.js and Socket.IO together.

The main user flow is:

1. Register or log in.
2. Create a document from the dashboard.
3. Open a document in the editor.
4. Share it with another user by email.
5. Edit collaboratively with live updates and typing indicators.

## Core Features

### Authentication

- User registration with hashed passwords.
- Login with JWT stored in an HTTP-only cookie.
- Session lookup through the me endpoint.
- Logout by clearing the auth cookie.

### Document Management

- Create documents with a title, content, owner, and collaborators.
- Fetch a combined list of owned documents and shared documents.
- Keep document metadata such as creation time and last edited time.

### Sharing and Permissions

- Share documents with other users by email.
- Store share relationships in a separate collection.
- Support permission levels for read and write access.
- Prevent duplicate shares for the same user and document.

### Real-Time Collaboration

- Sync editor content through Socket.IO.
- Join a document room when a user opens a note.
- Broadcast content updates to other connected clients.
- Show typing indicators while someone is actively editing.

### Rich Text Editing

- TipTap editor with StarterKit and extra extensions.
- Support for links, images, underline, highlight, text alignment, subscript, superscript, tables, and text styling.
- Separate view mode and edit mode behavior.

### UI and State Management

- Next.js App Router pages for login, register, dashboard, document creation, and sharing.
- Zustand store for editor content state.
- React hooks for auth and socket handling.
- CSS modules for page-specific styling.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens for auth
- bcrypt for password hashing
- Socket.IO for real-time communication
- TipTap for rich text editing
- Zustand for local editor state
- Axios for client requests

## Project Structure

```text
app/
  api/
    auth/
    documents/
  create/
  documents/
  login/
  logout/
  register/
  share/
components/
  editor/
hooks/
lib/
models/
public/
stores/
styles/
```

## Data Model

### User

The user model stores account information such as username, email, password, and verification-related fields.

### Document

The document model stores the title, HTML content, owner reference, collaborators, and editing timestamps.

### Share

The share model maps a document to a user and stores the permission granted to that user.

## API Routes

- `POST /api/auth/register` creates a new user account.
- `POST /api/auth/login` validates credentials and sets the auth cookie.
- `GET /api/auth/me` returns the current authenticated user.
- `POST /api/auth/logout` clears the auth cookie.
- `GET /api/documents` returns owned and shared documents.
- `POST /api/documents` creates a new document.
- `POST /api/documents/[id]/share` shares a document with another user.
- `GET /api/documents/[id]/versions` exists as a route scaffold for version-related work.

## Concepts Learned From This Project

This project was built as a practical learning exercise for several full-stack concepts:

- App Router architecture in Next.js, including nested pages and route handlers.
- Server and client component boundaries, especially in the editor and auth flows.
- JWT-based authentication using HTTP-only cookies.
- Password hashing with bcrypt before storing credentials.
- MongoDB relations using references, populated queries, and separate share documents.
- Designing a document permission system with owner, collaborator, read, and write access.
- Real-time collaboration with Socket.IO rooms and broadcast events.
- Rich text editing with TipTap extensions and controlled editor state.
- Using Zustand to keep shared editor content in sync.
- Handling protected navigation and redirects on the client side.
- Structuring a custom Node server so Next.js and WebSockets run together.

## Environment Variables

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
```

If you deploy the socket server separately, you may also want a client-side socket URL, but the current development setup connects to `http://localhost:3000` directly.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm run dev
```

The development script runs `server.js`, which starts Next.js and Socket.IO on `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

### Start in Production Mode

```bash
npm run start
```

## Notes

- The editor works best with MongoDB running and the environment variables configured.
- Shared documents are resolved through both ownership and share records, so a user can see notes they created and notes shared with them.
- Real-time sync depends on all clients connecting through the same Socket.IO server instance.

## Future Improvements

- Document version history UI and restore actions.
- Comments and mentions inside documents.
- Offline editing and sync recovery.
- Activity logs for collaboration history.
- Better mobile editor behavior.

## Author

Built by Kushal Karki as a full-stack learning project.
