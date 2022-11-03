import { io } from "socket.io-client";
import { DEBUG_LOGS } from "../configs/SETTINGS";
import { API_BASE_URL } from "../configs/URL";

export const Connect_Meet = async ({ room, uid, role, appID, name }) => {
  const socket = io(API_BASE_URL, {
    query: {
      uid,
      name,
      role,
      room,
    },
    auth: { token: appID },
    "force new connection": true,
    reconnectionAttempts: "5",
    timeout: 10000,
    transports: ["websocket"],
  });

  return new Promise((resolve, reject) => {
    socket.on("connected", ({ id }) => {
      if (DEBUG_LOGS) {
        console.log("socket connected succefully, id ", id);
      }

      resolve(socket);
    });

    socket.on("disconnect", () => {
      if (DEBUG_LOGS) {
        console.log("Disconnected from server");
      }

      reject(new Error("Authentication failed"));
    });
  });
};
