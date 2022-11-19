import { Device } from "mediasoup-client";
import { DEBUG_LOGS, RTCEvents } from "../configs/SETTINGS";
import { globalSocket } from "../socket";
import { handleCreateTracks, handleProduceTracks } from "./tracks";

export let globalDevice;

//handling database
const PeersData = {};

export const CreateRtcClient = () =>
  new Promise((resolve, reject) => {
    const socket = globalSocket;

    if (!socket?.connected) {
      reject("You must call ConnectMeet first before CreatingRtcClient");
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

      device.createTracks = handleCreateTracks;

      device.produceTracks = handleProduceTracks;

      resolve(device);
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

const handleUserPublishedEvent = async (callback) => {
  const socket = globalSocket;

  socket.on("user-published", (user) => {
    callback(user);
  });
};
