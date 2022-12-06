import { DEBUG_LOGS } from "../configs/SETTINGS";

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

const handleCreateReceiveTransport = function (ref, user) {
  const socket = ref.rtmClient;
  const device = ref.device;

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

      ref.PeersData = {
        ...ref.PeersData,
        [uid]: {
          RecieverTransport,
          consumers: [{ kind, producerId }],
          remoteReceiverTransport: { id: data.id },
          ...ref.PeersData[uid],
        },
      };

      resolve();
    });
  });
};

export const StartRecievingTheTracks = function (ref, user) {
  const { producerId, uid, kind } = user;

  const socket = ref.rtmClient;
  const device = ref.device;

  return new Promise(async (resolve, reject) => {
    if (
      ref.PeersData[uid]?.consumers?.find(
        (elem) => elem.producerId === producerId
      )
    )
      return reject(
        new Error(
          "Can not subsribe to already subscribed/subscribing to this tracks"
        )
      );

    const handleConnectRecieverTransport = async () => {
      if (DEBUG_LOGS) console.log("Started connecting with receiver transport");

      ref.PeersData[uid].RecieverTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await socket.emit(
              "connect-consumer",
              {
                dtlsParameters,
                serverConsumerTransportId:
                  ref.PeersData[uid].remoteReceiverTransport.id,
              },
              (error) => {
                if (error) return errback;

                callback();
                if (DEBUG_LOGS)
                  console.log(
                    "Connected with receiver transport, trying to consume"
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
          serverConsumerTransportId:
            ref.PeersData[uid].remoteReceiverTransport.id,
          producerUid: uid
        },
        async (data, error) => {
          if (error) {
            return reject(new Error(error));
          }

          if (DEBUG_LOGS) console.log("Receiver transport is ready to consume");

          const consumer = await ref.PeersData[uid].RecieverTransport.consume({
            id: data.id,
            producerId: producerId,
            kind: data.kind,
            rtpParameters: data.rtpParameters,
          });

          const { track: tempTrack } = consumer;

          const track = new MediaStream([tempTrack]);

          track.enabled = tempTrack.enabled



          ref.PeersData[uid].consumers = ref.PeersData[uid].consumers.map(
            (item) => {
              if (item.producerId === producerId) {
                if (item.consumer) {
                  item.consumer.close();
                }

                socket.emit("resume-consumer", {
                  consumer_id: data.serverConsumerId,
                }, ({ keepPaused }) => {
                  if (keepPaused) {
                    consumer.pause()
                    track.enabled = false
                    if (typeof ref.onRemoteTrackStateChanged === "function") {
                      ref.onRemoteTrackStateChanged({ uid })
                    }

                  }
                });

                return { ...item, consumer, [kind]: track };
              } else return item;
            }
          );

          resolve({ kind, track: track });
        }
      );
    };

    if (!ref.PeersData[uid]?.promise) {
      const newRecieverTransport = MakeQuerablePromise(
        handleCreateReceiveTransport(ref, user)
      );

      newRecieverTransport
        .then(() => {
          handleConnectRecieverTransport();
        })
        .catch((e) => {
          return reject(e);
        });

      ref.PeersData = {
        ...ref.PeersData,
        [uid]: { promise: newRecieverTransport },
      };
      return;
    }

    if (ref.PeersData[uid]?.promise) {
      const promise = ref.PeersData[uid].promise;
      if (promise.isPending) {
        promise
          .then(async () => {
            ref.PeersData[uid].consumers.push({ kind, producerId });
            return await handleConnectRecieverTransport();
          })
          .catch((e) => {
            return reject(e);
          });
      } else if (promise.isFulfilled) {
        ref.PeersData[uid].consumers.push({ kind, producerId });
        return await handleConnectRecieverTransport();
      } else {
        return reject(new Error("You need to initialise a transport first"));
      }
    }
  });
};

export const RemovingConsumerToTrack = (ref) => {
  const socket = ref.rtmClient;

  socket?.on("producer-closed", ({ producerId }) => {
    const allPeersUID = Object.keys(ref.PeersData);

    allPeersUID.forEach((item) => {
      let found;

      ref.PeersData[item].consumers.forEach((item) => {
        if (item.producerId === producerId) {
          found = true;
          item.consumer.close();
        }
      });

      if (found) {
        ref.PeersData[item].consumers = ref.PeersData[item].consumers.filter(
          (item) => item.producerId !== producerId
        );

        if (ref.PeersData[item].consumers.length === 0) {
          ref.PeersData[item].RecieverTransport?.close();
          ref.PeersData[item].promise = undefined;
          ref.PeersData[item].RecieverTransport = undefined;
        }
      }
    });
  });
};

export const StopReceivingTracks = (ref, tracks, user) => {
  const socket = ref.rtmClient;

  if (!socket) return;

  return new Promise((resolve) => {
    if (tracks.length === 0) {
      ref.PeersData[user.uid].consumers.forEach((item) => {
        item.consumer.close();
        socket.emit("consumer-closed");
      });

      ref.PeersData[user.uid].RecieverTransport.close();

      ref.PeersData[user.uid].consumers = [];
      ref.PeersData[user.uid].RecieverTransport = undefined;
      delete ref.PeersData[user.uid];
      if (DEBUG_LOGS) console.log("All Consumers closed for " + user.uid);
      return resolve("Unsubscribed to all tracks for " + user.uid);
    }

    tracks.forEach((item) => {
      item.getTracks().forEach((track) => {
        ref.PeersData[user.uid].consumers = ref.PeersData[
          user.uid
        ].consumers.filter((elem) => {
          if (elem.consumer.track.id === track.id) {
            elem.consumer.close();
            if (DEBUG_LOGS)
              console.log("Unsubscribed to track ", track, "for " + user.uid);
            return false;
          }
          return true;
        });

        if (ref.PeersData[user.uid].consumers.length === 0) {
          ref.PeersData[user.uid].RecieverTransport?.close();
          if (DEBUG_LOGS)
            console.log("Unsubscribed to all tracks for " + user.uid);
        }
      });
    });

    resolve("Unsubscribed to provided track");
  });
};


export const HandleProducerToConsumerPaused = (ref) => {
  const socket = ref.rtmClient
  socket.off("consumer-resume")
  socket.on("consumer-resume", async ({ consumerId, uid }) => {
    const changedConsumer = ref.PeersData[uid]?.consumers.find((item) => item.consumer?.id === consumerId)
    if (!changedConsumer) return

    if (changedConsumer.consumer.paused) {
      await changedConsumer.consumer.resume()
      ref.PeersData[uid].consumers = ref.PeersData[uid].consumers.map((item) => {
        if (item.consumer?.id === consumerId) {
          item[item.kind].enabled = changedConsumer.consumer.track.enabled
        }
        return item
      })
    }

    if (typeof ref.onRemoteTrackStateChanged === "function")
      ref.onRemoteTrackStateChanged({ uid })

  })


  socket.off("consumer-paused")
  socket.on("consumer-paused", async ({ consumerId, uid }) => {
    const changedConsumer = ref.PeersData[uid]?.consumers.find((item) => item.consumer?.id === consumerId)
    if (!changedConsumer) return

    if (!changedConsumer.consumer.paused) {
      await changedConsumer.consumer.pause()
      ref.PeersData[uid].consumers = ref.PeersData[uid].consumers.map((item) => {
        if (item.consumer?.id === consumerId) {
          item[item.kind].enabled = changedConsumer.consumer.track.enabled
        }
        return item
      })
    }

    if (typeof ref.onRemoteTrackStateChanged === "function")
      ref.onRemoteTrackStateChanged({ uid })
  })
}