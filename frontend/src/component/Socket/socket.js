import { useEffect } from "react";
import { useSocket } from "../context/SocketProvider"; // or your socket context

const MyComponent = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("ride-awaiting-store-owner", (ride) => {
      // Show store owner accept/reject popup
    });

    socket.on("ride-awaiting-captain", (ride) => {
      // Show captain accept/reject popup
    });

    socket.on("ride-confirmed-captain", (ride) => {
      // Notify user that captain accepted
    });

    return () => {
      socket.off("ride-awaiting-store-owner");
      socket.off("ride-awaiting-captain");
      socket.off("ride-confirmed-captain");
    };
  }, [socket]);
};