import { Device } from "mediasoup-client";
import { DEBUG_LOGS, RTCEvents } from "../configs/SETTINGS";
import { globalSocket } from "../socket";
import { handleCloseConnection, handleCreateTracks, handleProduceTracks, handleUnproduceTracks, PeersData, RemovingConsumerToTrack, StartRecievingTheTracks } from "./tracks";

export let globalDevice;

export const updateglobalDevice = (val) => {
  globalDevice = val
}


export const CreateRtcClient = () =>
  new Promise((resolve, reject) => {
    const socket = globalSocket;

    if (globalDevice) {
      return reject("Device already created")
    }

    if (!socket?.connected) {
      return reject("You must call ConnectMeet first before CreatingRtcClient");
    }

    const timer = setTimeout(() => {
      reject("Could not create a device");
    }, [10 * 1000]);

    const device = new Device();
    globalDevice = device;

    socket.emit("get-rtp-capabilities", async ({ routerRtpCapabilities }) => {
      await device.load({ routerRtpCapabilities });

      clearTimeout(timer);
      //adding custom methods here
      device.on = EventListenerFunc;
      device.off = EventListenerRemover

      device.createTracks = handleCreateTracks;

      device.produceTracks = handleProduceTracks;
      device.unprodueTracks = handleUnproduceTracks;


      //all RTC connection closing
      device.close = handleCloseConnection

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
    case RTCEvents["user-joined"]:
      handleUserJoined(callback)
      break
    case RTCEvents["user-left"]:
      handleUserLeft(callback)
      break
    default:
      break;
  }
};

const EventListenerRemover = async (eventName, callback) => {
  const socket = globalSocket

  switch (eventName) {
    case RTCEvents["user-published"]:
      socket?.off("user-published")
      break;
    case RTCEvents["user-unpublished"]:
      socket?.off("user-unpublished")
    case RTCEvents["user-joined"]:
      socket?.off("rtc-user-joined")
      break
    case RTCEvents["user-left"]:
      socket?.off("user-left")
      break
    default:
      break;
  }
};

const handleUserPublishedEvent = async (callback) => {
  const socket = globalSocket;


  socket.on("user-published", (user) => {
    user.subscribe = async () => {
      try {
        const track = await StartRecievingTheTracks(user)
        return { ...track, track: new MediaStream([track.track]) }
      } catch (e) {
        return e
      }

    }

    user.unsubscribe = () => { }
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

const handleUserJoined = (callback) => {
  const socket = globalSocket
  console.log("user-joined event got attached real")
  socket.on("rtc-user-joined", (user) => {
    callback(user)
  })
}

const handleUserLeft = (callback) => {
  const socket = globalSocket

  socket.on("user-left", (user) => {
    callback(user)
  })
}
