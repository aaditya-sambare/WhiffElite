const socketIo = require("socket.io");
const userModel = require("./models/user");
const captainModel = require("./models/captain");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      console.log(`User ${userId} joined as ${userType}`);
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          type: "Point",
          coordinates: [location.lat, location.lng],
        },
      });
    });

    socket.on("location-update", async (data) => {
      const { role, id, lat, lng } = data;
      if (role === "captain") {
        await Captain.findByIdAndUpdate(id, {
          $set: { "location.coordinates": [lng, lat] },
        });
      } else if (role === "user") {
        await User.findByIdAndUpdate(id, {
          $set: { "location.coordinates": [lng, lat] },
        });
      } else if (role === "storeowner") {
        await StoreOwner.findByIdAndUpdate(id, {
          $set: { "location.coordinates": [lng, lat] },
        });
      } else if (role === "admin") {
        await Admin.findByIdAndUpdate(id, {
          $set: { "location.coordinates": [lng, lat] },
        });
      }
      // Optionally, broadcast to others
      io.emit("live-location", { role, id, lat, lng });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io && socketId) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
