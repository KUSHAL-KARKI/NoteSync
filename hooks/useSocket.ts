"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!socket) {
      console.log("🔌 Connecting to socket server...");
      socket = io("http://localhost:3000");
      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("🔴 Connection error:", error.message);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
      }
    };
  }, []);

  return socket;
}