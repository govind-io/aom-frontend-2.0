import { Device } from "mediasoup-client";
import { DEBUG_LOGS, RTCEvents } from "../configs/SETTINGS";
import { globalSocket } from "../socket";
import { handleCreateTracks, handleProduceTracks, handleUnproduceTracks, PeersData, RemovingConsumerToTrack, StartRecievingTheTracks } from "./tracks";

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
      device.unprodueTracks = handleUnproduceTracks;

      resolve(device);

      RemovingConsumerToTrack()

      socket.emit("device-connected")
    });
  });

const EventListenerFunc = async (eventName, callback) => {
  switch (eventName) {
    case RTCEvents["user-published"]:
      handleUserPublishedEvent(callback);
      break;

    case RTCEvents["user-unpublished"]:
      handleUserUnPublishedEvent(callback)
      break
    default:
      break;
  }
};

const EventListenerRemover = async (eventName, callback) => {
  const socket = globalSocket

  switch (eventName) {
    case RTCEvents["user-published"]:
      socket.off("user-published")
      break;
    case RTCEvents["user-unpublished"]:
      socket.off("user-unpublished")
      break
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


const handleUserUnPublishedEvent = async (callback) => {
  const socket = globalSocket

  socket.on("user-unpublished", ({ producerId }) => {
    const allPeersUID = Object.keys(PeersData);

    allPeersUID.forEach((item) => {
      PeersData[item].consumers.forEach((elem) => {
        if (elem.producerId === producerId) {
          callback({ uid: item, kind: elem.kind })
        }
      });
    });

  })
}
