import { Device } from "mediasoup-client";
import { NotHost, NotJoined } from "../configs/SETTINGS";
import { AudioVolumeObserver } from "./AudioVolumeObserver";
import {
  Connect_Meet,
  getAllMessagesInRoom,
  getJoinedUsersInRoom,
} from "./Signaling";
import { ScreenTracks, Tracks } from "./Tracks";
import {
  handleUserPublishedEvent,
  handleUserUnPublishedEvent,
} from "./TracksEvents";
import {
  HandleProducerToConsumerPaused,
  RemovingConsumerToTrack,
  StartRecievingTheTracks,
  StopReceivingTracks,
} from "./TransportReceiverHandler";
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

  connect() {
    return Connect_Meet(this, ...arguments);
  }

  init() {
    return new Promise((resolve, reject) => {
      const socket = this.rtmClient;

      if (NotJoined(this)) {
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
        HandleProducerToConsumerPaused(this);
        console.log("device-connected");
        socket.emit("device-connected");
      });

      socket.on("disconnect", () => {
        this.selfTracks.forEach((item) => item.stop());
      });
    });
  }

  enableAudioVolumeObserver() {
    const volumeObserver = new AudioVolumeObserver(this);
    return new Promise((resolve, reject) => {
      if (NotJoined(this)) reject("Not Joined yet");
      volumeObserver
        .init()
        .then((data) => {
          if (data) {
            return resolve(volumeObserver);
          }
          reject(false);
        })
        .catch((e) => {
          reject(volumeObserver);
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

  // Get all available microphones
  async getAllMics() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === 'audioinput');
      return mics
    } catch (error) {
      console.error('Error getting microphones:', error);
      throw new Error(error)
    }
  }

  // Get all available cameras
  async getAllCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      return cameras
    } catch (error) {
      console.error('Error getting cameras:', error);
      throw new Error(error)
    }
  }

  // Get all available speakers
  async getAllSpeakers() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const speakers = devices.filter(device => device.kind === 'audiooutput');
      return speakers
    } catch (error) {
      console.error('Error getting speakers:', error);
      throw new Error(error)
    }
  }

  produceTracks() {
    if (NotJoined(this) || NotHost(this))
      throw new Error(
        "Can not perform publish because user not joined/user not a host"
      );
    return handleProduceTracks(this, ...arguments);
  }

  unprodueTracks() {
    if (NotJoined(this) || NotHost(this))
      throw new Error(
        "Can not perform unpublish because user not joined/user not a host"
      );
    return handleUnproduceTracks(this, ...arguments);
  }

  subscribe() {
    if (NotJoined(this)) throw Error("user not joined yet");
    try {
      return StartRecievingTheTracks(this, ...arguments);
    } catch (e) {
      throw new Error(e);
    }
  }

  unsubscribe() {
    return StopReceivingTracks(this, ...arguments);
  }

  //all RTC connection closing
  close() {
    handleCloseConnection(this, ...arguments);
  }

  //signaling related
  getJoinedUsers() {
    if (NotJoined(this)) throw Error("user not joined yet");
    return getJoinedUsersInRoom(...arguments);
  }

  getAllMessages() {
    if (NotJoined(this)) throw Error("user not joined yet");
    return getAllMessagesInRoom(...arguments);
  }

  //redirecting all socket handlers to socket
  on() {
    this.rtmClient.on(...arguments);
  }

  off() {
    if (!this.rtmClient) return;
    this.rtmClient.off(...arguments);
  }

  emit() {
    if (!this.rtmClient) throw new Error("Can not emit");
    this.rtmClient.emit(...arguments);
  }

  //properties
  rtmClient;

  connected = false;

  PeersData = {};

  selfProducerTransport;

  selfTracks = [];

  producers = [];

  onRemoteTrackStateChanged;

  role;
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

  ref.selfTracks.forEach((item) => item.stop());
  ref.producers = [];
  ref.selfProducerTransport = undefined;
  ref.PeersData = {};
  ref.connected = false;
  ref.selfTracks = [];
  ref.rtmClient = undefined;
  ref.onRemoteTrackStateChanged = undefined;

  socket?.disconnect();
};
