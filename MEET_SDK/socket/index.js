import axios from "axios";
import { io } from "socket.io-client";
import { DEBUG_LOGS } from "../configs/SETTINGS";
import { API_BASE_URL } from "../configs/URL";

//methods for the Socket IO
const getJoinedUsers = async () => {
  console.log("hello");
};

//Main Connect_Meet which does all manipulation related to socket IO server
export const Connect_Meet = async ({ token, uid, role }) => {
  const socket = io(API_BASE_URL, {
    auth: { token },
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

      socket.getJoinedUsers = getJoinedUsers;

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
