import { Device } from "mediasoup-client";
import { DEBUG_LOGS, RTCEvents } from "../configs/SETTINGS";
import { globalSocket } from "../socket";
import { handleCreateTracks, handleProduceTracks, StartRecievingTheTracks } from "./tracks";

export let globalDevice;


export const CreateRtcClient = () =>
  new Promise((resolve, reject) => {
    const socket = globalSocket;

    if (!socket?.connected) {
      return reject("You must call ConnectMeet first before CreatingRtcClient");
    }

    const timer = setTimeout(() => {
      reject("Could not create a device");
    }, [10 * 1000]);

    socket.emit("get-rtp-capabilities", async ({ routerRtpCapabilities }) => {
      const device = new Device();
      globalDevice = device;
      await device.load({ routerRtpCapabilities });

      clearTimeout(timer);
      //adding custom methods here
      device.on = EventListenerFunc;
      device.off = EventListenerRemover

      device.createTracks = handleCreateTracks;

      device.produceTracks = handleProduceTracks;

      resolve(device);

      socket.emit("device-connected")
    });
  });

const EventListenerFunc = async (eventName, callback) => {
  switch (eventName) {
    case RTCEvents["user-published"]:
      handleUserPublishedEvent(callback);
      break;

    default:
      break;
  }
};

const EventListenerRemover = async (eventName, callback) => {
  const socket = globalSocket

  switch (eventName) {
    case RTCEvents["user-published"]:
      socket.off("user-published", callback)
      break;

    default:
      break;
  }
};

const handleUserPublishedEvent = async (callback) => {
  const socket = globalSocket;



  socket.on("user-published", (user) => {
    user.subscribe = async () => {
      await StartRecievingTheTracks(user)
    }
    callback(user);
  });
};
