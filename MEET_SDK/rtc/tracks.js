import { globalDevice, updateglobalDevice } from ".";
import { DEBUG_LOGS } from "../configs/SETTINGS";
import { globalSocket, updateGlobalSocket } from "../socket";
import { videoParams, audioParams } from "./settings";

let selfProducerTransport;
let selfTracks;
const producers = [];

//handling database
export const PeersData = {};

export const handleCreateTracks = async (params) => {
  if (!params) throw new Error("Can not create tracks without params");

  try {
    const stream = await navigator.mediaDevices.getUserMedia(params);

    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    selfTracks = {
      audioTrack: new MediaStream([audioTrack]),
      videoTrack: new MediaStream([videoTrack]),
    };

    //adding custom methods
    selfTracks.audioTrack.setEnabled = audioControl;
    selfTracks.videoTrack.setEnabled = videoControl;

    //adding custom variables
    selfTracks.audioTrack.enabled = true;
    selfTracks.videoTrack.enabled = true;

    return selfTracks;
  } catch (e) {
    return e;
  }
};

//tracks control
const audioControl = async (val) => {
  selfTracks.audioTrack.getAudioTracks()[0].enabled = val ? true : false;
  selfTracks.audioTrack.enabled = val ? true : false;
};

const videoControl = async (val) => {
  selfTracks.videoTrack.getVideoTracks()[0].enabled = val ? true : false;
  selfTracks.videoTrack.enabled = val ? true : false;

  console.log("video tracks ", val ? true : false);
};

export const handleUnproduceTracks = async (data) => {
  const socket = globalSocket;

  if (data.length === 0) {
    throw new Error("You must supply atleast one track");
  }

  data.forEach((item) => {
    try {
      item.getTracks().forEach((track) => {
        producers = producers.filter((elem) => {
          if (elem.track.id === track.id) {
            if (DEBUG_LOGS) console.log("stopped publishing track ", track);
            elem.close();
            socket.emit("closed-producer", { producerId: elem.id });
          }
          return elem.track.id !== track.id;
        });

        if (producers.length === 0) {
          selfProducerTransport.close();
        }
      });

      return true;
    } catch (e) {
      throw new Error(e);
    }
  });
};

export const handleProduceTracks = (data) => {
  const handleProduceTransportConnection = async (resolve, reject) => {
    const socket = globalSocket;

    selfProducerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errorback) => {
        try {
          socket.emit("connect-producer", { dtlsParameters }, (error) => {
            if (!error) return callback();
          });

          if (DEBUG_LOGS)
            console.log("Transmitted connection details to server");
        } catch (e) {
          reject(e.message);
          if (DEBUG_LOGS)
            console.log("Producer can not connect to server " + e.message);
          errorback(e);
        }
      }
    );

    selfProducerTransport.on(
      "produce",
      async (parameters, callback, errorback) => {
        try {
          if (DEBUG_LOGS) console.log("Producer Connected with server");
          socket.emit(
            "produce-producer",
            {
              transportId: selfProducerTransport.id,
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
            },
            ({ id, error }) => {
              if (error) return console.log(error);

              callback({ id });
              if (DEBUG_LOGS) console.log("Producer can start producing now");
            }
          );
        } catch (e) {
          reject(e.message);
          if (DEBUG_LOGS) console.log("Producer can not produce " + e.message);
          errorback(e);
        }
      }
    );

    data.forEach((track) => {
      track.getTracks().forEach(async (item) => {
        if (item.kind === "audio") {
          let audioProducer;
          try {
            const audioTrack = item;
            audioProducer = await selfProducerTransport.produce({
              track: audioTrack,
              ...audioParams,
            });
            producers.push(audioProducer);
          } catch (e) {
            return reject(e);
          }

          if (DEBUG_LOGS) console.log("started audio produce");

          audioProducer.on("trackended", () => {
            if (DEBUG_LOGS) console.log("audio track ended");
            // close audio track
            if (DEBUG_LOGS) console.log("audio Track closed");
            audioTrack.close();
          });

          audioProducer.on("transportclose", () => {
            if (DEBUG_LOGS) console.log("audio transport ended");

            producers = producers.filter(
              (item) => item.id !== audioProducer.id
            );
            if (DEBUG_LOGS) console.log("audio Track closed");
            // close audio track
            audioTrack.close();
          });
        }

        if (item.kind === "video") {
          let videoProducer;
          try {
            const videoTrack = item;
            videoProducer = await selfProducerTransport.produce({
              track: videoTrack,
              ...videoParams,
            });
            producers.push(videoProducer);
          } catch (e) {
            return reject(e);
          }

          if (DEBUG_LOGS) console.log("started video produce");

          videoProducer.on("trackended", () => {
            if (DEBUG_LOGS) console.log("video track ended");

            if (DEBUG_LOGS) console.log("video Track closed");
            // close video track
            videoTrack.close();
          });

          videoProducer.on("transportclose", () => {
            if (DEBUG_LOGS) console.log("video transport ended");

            producers = producers.filter(
              (item) => item.id !== videoProducer.id
            );

            if (DEBUG_LOGS) console.log("video Track closed");
            // close video track
            videoTrack.close();
          });
        }
      });
      return resolve(producers);
    });
  };

  return new Promise((resolve, reject) => {
    if (!data)
      return reject(new Error("Atleast one of the tracks is required"));

    if (data.length === 0)
      return reject(new Error("Atleast one of the tracks is required"));

    const socket = globalSocket;
    const device = globalDevice;

    if (socket.role !== "host")
      return reject(new Error("Only Hosts can Publish"));

    if (!selfProducerTransport) {
      socket.emit("create-producer-transport", async (data, error) => {
        if (error) {
          return reject(error);
        }

        console.log("producer transport data recieved from server ", data);

        const producerTransport = await device.createSendTransport(data);

        producerTransport.on("dtlsstatechange", (dtlsState) => {
          if (dtlsState === "closed") {
            if (DEBUG_LOGS)
              console.log(
                "Producer Transport DTLSState Changed to ",
                dtlsState,
                " Transport closed there fore"
              );
            producerTransport.close();
          }
        });

        if (DEBUG_LOGS) console.log("Created send producer");

        selfProducerTransport = producerTransport;

        handleProduceTransportConnection(resolve, reject);
      });
      return;
    }

    handleProduceTransportConnection(resolve, reject);
  });
};

function MakeQuerablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isFulfilled) return promise;

  // Set initial state
  var isPending = true;
  var isRejected = false;
  var isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) {
      isFulfilled = true;
      isPending = false;
      return v;
    },
    function (e) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isFulfilled = function () {
    return isFulfilled;
  };
  result.isPending = function () {
    return isPending;
  };
  result.isRejected = function () {
    return isRejected;
  };
  return result;
}

const handleCreateReceiveTransport = (user) => {
  const socket = globalSocket;
  const device = globalDevice;

  const { producerId, uid, kind } = user;

  return new Promise((resolve, reject) => {
    socket.emit("create-reciever-transport", async (data, error) => {
      if (error) {
        reject(error);
      }

      const RecieverTransport = await device.createRecvTransport(data);

      RecieverTransport.on("dtlsstatechange", (dtlsState) => {
        if (dtlsState === "closed") {
          if (DEBUG_LOGS)
            console.log(
              "Consumer Transport DTLSState Changed to ",
              dtlsState,
              " Transport closed there fore"
            );
          RecieverTransport.close();
        }
      });

      if (DEBUG_LOGS) console.log("Created Reciever transport");

      PeersData = {
        ...PeersData,
        [uid]: {
          RecieverTransport,
          consumers: [{ kind, producerId }],
          remoteReceiverTransport: { id: data.id },
          ...PeersData[uid],
        },
      };

      resolve();
    });
  });
};

export const StartRecievingTheTracks = (user) => {
  const { producerId, uid, kind } = user;

  const socket = globalSocket;
  const device = globalDevice;

  return new Promise(async (resolve, reject) => {
    if (
      PeersData[uid]?.consumers?.find((elem) => elem.producerId === producerId)
    )
      return reject(
        new Error(
          "Can not subsribe to already subscribed/subscribing to this tracks"
        )
      );

    const handleConnectRecieverTransport = async () => {
      if (DEBUG_LOGS) console.log("Started connecting with receiver transport");

      PeersData[uid].RecieverTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await socket.emit(
              "connect-consumer",
              {
                dtlsParameters,
                serverConsumerTransportId:
                  PeersData[uid].remoteReceiverTransport.id,
              },
              (error) => {
                if (error) return errback;

                callback();
                if (DEBUG_LOGS)
                  console.log(
                    "Connected with receiver transport, trying to consumer"
                  );
              }
            );
          } catch (error) {
            // Tell the transport that something was wrong
            errback(error);
          }
        }
      );

      await socket.emit(
        "consume-consumer",
        {
          rtpCapabilities: device.rtpCapabilities,
          producerId,
          serverConsumerTransportId: PeersData[uid].remoteReceiverTransport.id,
        },
        async (data, error) => {
          if (error) {
            return reject(new Error(error));
          }

          if (DEBUG_LOGS) console.log("Receiver transport is ready to consume");

          const consumer = await PeersData[uid].RecieverTransport.consume({
            id: data.id,
            producerId: producerId,
            kind: data.kind,
            rtpParameters: data.rtpParameters,
          });

          const { track } = consumer;

          PeersData[uid].consumers = PeersData[uid].consumers.map((item) => {
            if (item.producerId === producerId) {
              if (item.consumer) {
                item.consumer.close();
              }

              socket.emit("resume-consumer", {
                consumer_id: data.serverConsumerId,
              });

              return { ...item, consumer, [kind]: track };
            } else return item;
          });

          resolve({ kind, track: track });
        }
      );
    };

    if (!PeersData[uid]?.promise) {
      const newRecieverTransport = MakeQuerablePromise(
        handleCreateReceiveTransport(user)
      );

      newRecieverTransport
        .then(() => {
          handleConnectRecieverTransport();
        })
        .catch((e) => {
          return reject(e);
        });

      PeersData = { ...PeersData, [uid]: { promise: newRecieverTransport } };
      return;
    }

    if (PeersData[uid]?.promise) {
      const promise = PeersData[uid].promise;
      if (promise.isPending) {
        promise
          .then(async () => {
            PeersData[uid].consumers.push({ kind, producerId });
            return await handleConnectRecieverTransport();
          })
          .catch((e) => {
            return reject(e);
          });
      } else if (promise.isFulfilled) {
        PeersData[uid].consumers.push({ kind, producerId });
        return await handleConnectRecieverTransport();
      } else {
        return reject(new Error("You need to initialise a transport first"));
      }
    }
  });
};

export const RemovingConsumerToTrack = () => {
  const socket = globalSocket;

  socket.on("producer-closed", ({ producerId }) => {
    const allPeersUID = Object.keys(PeersData);

    allPeersUID.forEach((item) => {
      let found;

      PeersData[item].consumers.forEach((item) => {
        if (item.producerId === producerId) {
          found = true;
          item.consumer.close();
        }
      });

      if (found) {
        PeersData[item].consumers = PeersData[item].consumers.filter(
          (item) => item.producerId !== producerId
        );

        if (PeersData[item].consumers.length === 0) {
          PeersData[item].RecieverTransport?.close();
          PeersData[item].promise = undefined;
          PeersData[item].RecieverTransport = undefined;
        }
      }
    });
  });
};

export const handleCloseConnection = () => {
  const socket = globalSocket;
  const device = globalDevice;

  producers.forEach((item) => {
    item.close();
  });

  selfProducerTransport.close();

  const allPeers = Object.keys(PeersData);

  allPeers.forEach((item) => {
    PeersData[item].consumers?.forEach((elem) => {
      elem?.consumer?.close();
    });
    PeersData[item].RecieverTransport?.close();
  });

  producers = [];
  selfProducerTransport = undefined;
  PeersData = {};

  socket.disconnect();

  updateGlobalSocket(undefined);
  updateglobalDevice(undefined);
};
