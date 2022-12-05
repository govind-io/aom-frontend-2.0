import { Device } from "mediasoup-client";
import { globalSocket } from "../socket";
import { ScreenTracks, Tracks } from "./Tracks";
import {
  handleUserPublishedEvent,
  handleUserUnPublishedEvent,
} from "./TracksEvents";
import { RemovingConsumerToTrack } from "./TransportReceiverHandler";
import {
  handleProduceTracks,
  handleUnproduceTracks,
} from "./TransportsProduceHandler";
import { handleUserJoined, handleUserLeft } from "./UserEvents";

export class RTCClient {
  constructor() {
    const device = new Device();
    this.device = device;
  }

  init() {
    return new Promise((resolve, reject) => {
      const socket = globalSocket;

      if (!socket?.connected) {
        return reject(
          "You must call ConnectMeet first before CreatingRtcClient"
        );
      }

      const timer = setTimeout(() => {
        reject("Could not create a device");
      }, [10 * 1000]);

      socket.emit("get-rtp-capabilities", async ({ routerRtpCapabilities }) => {
        await this.device.load({ routerRtpCapabilities });
        this.connected = true;
        clearTimeout(timer);
        resolve();
        RemovingConsumerToTrack(this);
        console.log("device-connected");
        socket.emit("device-connected");
      });
    });
  }

  //events here
  onUserPublished(callback) {
    handleUserPublishedEvent(this, callback);
  }

  onUserUnpublished(callback) {
    handleUserUnPublishedEvent(this, callback);
  }

  onUserJoined(callback) {
    handleUserJoined(this, callback);
  }

  onUserLeft(callback) {
    handleUserLeft(this, callback);
  }

  createTracks() {
    const track = new Tracks(this, ...arguments);
    return track.init();
  }

  createScreenTrack() {
    const screenTrack = new ScreenTracks(this, ...arguments);
    return screenTrack.init();
  }

  produceTracks() {
    return handleProduceTracks(this, ...arguments);
  }
  unprodueTracks() {
    return handleUnproduceTracks(this, ...arguments);
  }

  //all RTC connection closing
  close() {
    handleCloseConnection(this, ...arguments);
  }

  //properties
  rtmClient = globalSocket;

  connected = false;

  PeersData = {};

  selfProducerTransport;

  selfTracks = [];

  producers = [];
}

export const handleCloseConnection = function (ref) {
  const socket = ref.rtmClient;
  ref.producers.forEach((item) => {
    item.close();
  });

  ref.selfProducerTransport?.close();

  const allPeers = Object.keys(ref.PeersData);

  allPeers.forEach((item) => {
    ref.PeersData[item].consumers?.forEach((elem) => {
      elem?.consumer?.close();
    });
    ref.PeersData[item].RecieverTransport?.close();
  });

  ref.producers = [];
  ref.selfProducerTransport = undefined;
  ref.PeersData = {};

  socket.disconnect();

  ref.socket = undefined;
};
