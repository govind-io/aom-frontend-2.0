import axios from "axios";
import { io } from "socket.io-client";
import { DEBUG_LOGS } from "../configs/SETTINGS";
import { API_BASE_URL } from "../configs/URL";

//Global object
let globalSocket;

//methods for the Socket IO
const getJoinedUsers = async (token) => {
  const config = {
    url: `${API_BASE_URL}/participants`,
    method: "GET",
    headers: {
      Authorization: token,
    },
  };

  let response;

  try {
    response = await axios(config);
  } catch (e) {
    return e.message;
  }

  return response.data.participants;
};

const getAllMessages = async (token) => {
  const config = {
    url: `${API_BASE_URL}/messages`,
    method: "GET",
    headers: {
      Authorization: token,
    },
  };

  let response;

  try {
    response = await axios(config);
  } catch (e) {
    return e.message;
  }

  return response.data.messages;
};

//Main Connect_Meet which does all manipulation related to socket IO server
export const Connect_Meet = async ({ token, uid, role }) => {
  const socket = io(API_BASE_URL, {
    auth: { token },
    query: { uid, role },
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

      //adding custom methods
      socket.getJoinedUsers = getJoinedUsers;
      socket.getAllMessages = getAllMessages

      //seting global socket object
      globalSocket = socket;


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
