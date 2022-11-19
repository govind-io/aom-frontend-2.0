import { globalDevice } from ".";
import { DEBUG_LOGS } from "../configs/SETTINGS";
import { globalSocket } from "../socket";
import { videoParams, audioParams } from "./settings";

let selfProducerTransport;
let selfTracks;
const producers = [];

//handling database
const PeersData = {};

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

    globalDevice.tracks = selfTracks;

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
  selfTracks.audioTrack.getAudioTracks().enabled = val ? true : false;
  selfTracks.audioTrack.enabled = val ? true : false;
};

const videoControl = async (val) => {
  selfTracks.videoTrack.getVideoTracks()[0].enabled = val ? true : false;
  selfTracks.videoTrack.enabled = val ? true : false;
};

export const handleProduceTracks = (data) => {
  const handleProduceTransportConnection = async (resolve, reject) => {
    const socket = globalSocket;

    selfProducerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errorback) => {
        try {
          socket.emit("connect-producer", { dtlsParameters }, (error) => {
            if (!error) return callback()
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

    const audioTrack = data.audioTrack.getAudioTracks()[0];
    const videoTrack = data.videoTrack.getVideoTracks()[0];

    let videoProducer;
    let audioProducer;

    if (audioTrack) {
      try {
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
        if (DEBUG_LOGS) console.log("audio Track closed");
        // close audio track
        audioTrack.close();
      });
    }

    if (videoTrack) {
      try {
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

        if (DEBUG_LOGS) console.log("video Track closed");
        // close video track
        videoTrack.close();
      });
    }

    if (audioProducer && videoProducer)
      return resolve([audioProducer, videoProducer]);

    if (audioProducer) return resolve([audioProducer]);

    if (videoProducer) return resolve([videoProducer]);
  };

  return new Promise((resolve, reject) => {
    if (!data)
      return reject(new Error("Atleast one of the tracks is required"));

    const audioTracks = data.audioTrack;
    const videoTracks = data.videoTrack;

    if (!audioTracks && !videoTracks)
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


export const StartRecievingTheTracks = async (user) => {

  const { producerId, uid, kind } = user

  const socket = globalSocket;
  const device = globalDevice;

  if (PeersData[uid]?.consumers.find(elem => elem.producerId === producerId)) throw new Error("Can no subsribe to already subscribed/subscribing to this tracks")


  const handleConnectRecieverTransport = async () => {

    if (DEBUG_LOGS) console.log("Started connecting with receiver transport")

    PeersData[uid].RecieverTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await socket.emit('connect-consumer', {
          dtlsParameters,
          serverConsumerTransportId: PeersData[uid].remoteReceiverTransport.id,
        }, (error) => {
          if (error) return errback

          callback()
          if (DEBUG_LOGS) console.log("Connected with receiver transport, trying to consumer")
        })
      } catch (error) {
        // Tell the transport that something was wrong
        errback(error)
      }
    })


    await socket.emit('consume-consumer', {
      rtpCapabilities: device.rtpCapabilities,
      producerId,
      serverConsumerTransportId: PeersData[uid].remoteReceiverTransport.id,
    }, async (data, error) => {
      if (error) {
        throw new Error(error)
      }

      if (DEBUG_LOGS) console.log("Receiver transport is ready to consume")

      const consumer = await PeersData[uid].RecieverTransport.consume({
        id: data.id,
        producerId: producerId,
        kind: data.kind,
        rtpParameters: data.rtpParameters
      })



      PeersData[uid].consumers = PeersData[uid].consumers.map((item) => {
        if (item.producerId === producerId) return { ...item, consumer }
        else return item
      })


      console.log(PeersData)

    })
  }


  if (PeersData[uid]?.RecieverTransport) {
    PeersData[uid].consumers.push({ kind, producerId })
    await handleConnectRecieverTransport()
  }

  socket.emit("create-reciever-transport", async (data, error) => {
    if (error) {
      throw new Error(error);
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

    PeersData = { ...PeersData, [uid]: { RecieverTransport, consumers: [{ kind, producerId }], remoteReceiverTransport: { id: data.id } } }

    await handleConnectRecieverTransport()
  });
}