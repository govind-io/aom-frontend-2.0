import axios from "axios";
import { io } from "socket.io-client";
import { DEBUG_LOGS } from "../configs/SETTINGS";
import { API_BASE_URL } from "../configs/URL";

export const Connect_Meet = async (ref, { token, uid, role }) => {
    const socket = io(API_BASE_URL, {
        auth: { token },
        query: { uid, role },
        "force new connection": true,
        reconnectionAttempts: "5",
        timeout: 10000,
        transports: ["websocket"],
    });

    return new Promise((resolve, reject) => {
        socket?.on("connected", ({ id, role }) => {
            if (DEBUG_LOGS) {
                console.log("socket connected succefully, id ", id);
            }

            //adding custom variables
            ref.role = role;

            ref.rtmClient = socket

            resolve(socket);
        });

        socket?.on("disconnect", () => {
            if (DEBUG_LOGS) {
                console.log("Disconnected from server");
            }

            reject(new Error("Authentication failed"));
        });
    });
};


export const getJoinedUsersInRoom = async (token) => {
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

export const getAllMessagesInRoom = async (token) => {
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