import {
  StartRecievingTheTracks,
  StopReceivingTracks,
} from "./TransportReceiverHandler";

export const handleUserPublishedEvent = async function (ref, callback) {
  const socket = ref.rtmClient;
  socket?.off("user-published");

  socket?.on("user-published", (user) => {
    callback(user);
  });
};

export const handleUserUnPublishedEvent = async function (ref, callback) {
  const socket = ref.rtmClient;
  socket?.off("user-unpublished");

  socket?.on("user-unpublished", ({ producerId }) => {
    const allPeersUID = Object.keys(ref.PeersData);
    allPeersUID.forEach((item) => {
      ref.PeersData[item].consumers.forEach((elem) => {
        if (elem.producerId === producerId) {
          callback({ uid: item, kind: elem.kind, trackId: elem[elem.kind].id });
        }
      });
    });
  });
};


