import { DEBUG_LOGS } from "../configs/SETTINGS";
import { audioParams, videoParams } from "./settings";

export const handleUnproduceTracks = async (ref, data) => {
  const socket = ref.rtmClient;

  if (data.length === 0) {
    throw new Error("You must supply atleast one track");
  }

  data.forEach((item) => {
    try {
      item.getTracks().forEach((track) => {
        ref.producers = ref.producers.filter((elem) => {
          if (elem.track.id === track.id) {
            if (DEBUG_LOGS) console.log("stopped publishing track ", track);
            elem.close();
            socket.emit("closed-producer", { producerId: elem.id });
          }
          return elem.track.id !== track.id;
        });

        // if (ref.producers.length === 0) {
        //   ref.selfProducerTransport.close();
        //   ref.selfProducerTransport = undefined;
        // }

        ref.selfTracks = ref.selfTracks.filter((item) => item.id !== track.id);
      });

      return true;
    } catch (e) {
      throw new Error(e);
    }
  });
};

//used for updating tracktype value inside on produce event
let trackType;

export const handleProduceTracks = function (ref, data, type) {
  trackType = type;
  const device = ref.device;
  const handleProduceTransportConnection = async function (resolve, reject) {
    data.forEach((track) => {
      track.getTracks().forEach(async (item) => {
        if (item.kind === "audio") {
          let audioProducer;
          try {
            const audioTrack = item;
            audioProducer = await ref.selfProducerTransport.produce({
              track: audioTrack,
              ...audioParams,
            });
            ref.producers.push(audioProducer);
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

            ref.producers = ref.producers.filter(
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

            videoProducer = await ref.selfProducerTransport.produce({
              track: videoTrack,
              ...videoParams,
              codec: videoTrack.label.includes("screen")
                ? device.rtpCapabilities.codecs.find(
                    (codec) => codec.mimeType.toLowerCase() === "video/vp8"
                  )
                : device.rtpCapabilities.codecs.find(
                    (codec) => codec.mimeType.toLowerCase() === "video/h264"
                  ),
            });

            console.log(videoProducer, "producer");
            ref.producers.push(videoProducer);
          } catch (e) {
            console.log(e);
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

            ref.producers = ref.producers.filter(
              (item) => item.id !== videoProducer.id
            );

            if (DEBUG_LOGS) console.log("video Track closed");
            // close video track
            videoTrack.close();
          });
        }
      });
      return resolve(ref.producers);
    });
  };

  return new Promise((resolve, reject) => {
    if (!data)
      return reject(new Error("Atleast one of the tracks is required"));

    if (data.length === 0)
      return reject(new Error("Atleast one of the tracks is required"));

    const socket = ref.rtmClient;

    if (ref.role !== "host") return reject(new Error("Only Hosts can Publish"));

    if (!ref.selfProducerTransport) {
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

        ref.selfProducerTransport = producerTransport;

        ref.selfProducerTransport.on(
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

        ref.selfProducerTransport.on(
          "produce",
          async (parameters, callback, errorback) => {
            try {
              if (DEBUG_LOGS) console.log("Producer Connected with server");
              console.log("track type inside on event ", trackType);
              socket.emit(
                "produce-producer",
                {
                  transportId: ref.selfProducerTransport.id,
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                  type: trackType || parameters.kind,
                },
                ({ id, error }) => {
                  if (error) return console.log(error);

                  callback({ id });
                  if (DEBUG_LOGS)
                    console.log("Producer can start producing now");
                }
              );
            } catch (e) {
              reject(e);
              if (DEBUG_LOGS)
                console.log("Producer can not produce " + e.message);
              errorback(e);
            }
          }
        );

        handleProduceTransportConnection(resolve, reject);
      });
      return;
    }
    console.log("directly called connect ref.producers");
    handleProduceTransportConnection(resolve, reject);
  });
};
