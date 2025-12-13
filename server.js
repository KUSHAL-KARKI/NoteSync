import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    socket.on("join-doc", (docId) => {
      socket.join(docId);
      console.log(`✅ User ${socket.id} joined document: ${docId}`);
    });

    socket.on("content-update", ({ docId, content }) => {
      console.log(`📝 Content update in ${docId}`);
      socket.to(docId).emit("content-update", {content});
    });

    socket.on("typing", ({ docId, username }) => {
      console.log(`⌨️ ${username} is typing in ${docId}`);
      socket.to(docId).emit("typing", username);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});