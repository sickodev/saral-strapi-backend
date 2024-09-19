import { Server } from "socket.io";

export default async ({ strapi }) => {
  const io = new Server(strapi.server.httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Listen for connection events
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle incoming messages from clients
    socket.on("send_message", async (data) => {
      try {
        // Store message in Strapi
        const message = await strapi.entityService.create("api::message.message", {
          data,
        });

        // Emit the message to all connected clients
        io.emit("receive_message", message);
      } catch (error) {
        console.error("Error storing message:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  strapi.io = io; // Attach the io instance to the Strapi instance
};
