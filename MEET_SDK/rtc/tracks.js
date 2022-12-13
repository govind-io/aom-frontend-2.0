import { DEBUG_LOGS } from "../configs/SETTINGS";
import { defaultScreenTrackParams, defaultTracksParams } from "./settings";

export class Tracks {
  constructor(ref, props) {
    this.params = props;
    this.parentClassRef = ref;
  }

  init() {
    const createTracks = async () => {
      try {
        const tracks = await navigator.mediaDevices.getUserMedia(
          this.params || defaultTracksParams
        );

        const clientTracksArray = [];

        tracks.getTracks().forEach((elem) => {
          const newMediaStream = new MediaStream([elem]);

          newMediaStream.enabled = true;

          newMediaStream.setEnabled = (val) => {
            const newState = val ? true : false;

            elem.enabled = newState;
            newMediaStream.enabled = newState;

            const producer = this.parentClassRef.producers.find(
              (item) => item.track.id === elem.id
            );

            if (!newState && producer) {
              producer.pause();
              if (DEBUG_LOGS)
                console.log("producer paused associated with this track");
              this.parentClassRef.rtmClient.emit("producer-paused", {
                producerId: producer.id,
              });
            } else if (newState && producer) {
              producer.resume();
              if (DEBUG_LOGS)
                console.log("producer resumed associated with this track");
              this.parentClassRef.rtmClient.emit("producer-resume", {
                producerId: producer.id,
              });
            } else {
              if (DEBUG_LOGS)
                console.log("No producer associated with this track");
            }
          };

          newMediaStream.stop = () => {
            elem.stop();
            this.parentClassRef.selfTracks =
              this.parentClassRef.selfTracks.filter(
                (item) => item.id !== elem.id
              );
          };

          clientTracksArray.push(newMediaStream);

          this.parentClassRef.selfTracks.push(elem);
        });

        return clientTracksArray;
      } catch (e) {
        throw new Error(e);
      }
    };

    return createTracks();
  }

  //properties
  params;

  parentClassRef;
}

export class ScreenTracks {
  constructor(ref, props) {
    this.params = props;
    this.parentClassRef = ref;
  }

  init() {
    const createTracks = async () => {
      try {
        const tracks = await navigator.mediaDevices.getDisplayMedia(
          this.params || defaultScreenTrackParams
        );

        const clientTracksArray = [];

        tracks.getTracks().forEach((elem) => {
          const newMediaStream = new MediaStream([elem]);

          newMediaStream.onended = (callback) => {
            elem.onended = callback;
          };

          newMediaStream.stop = () => {
            elem.stop();
            this.parentClassRef.selfTracks =
              this.parentClassRef.selfTracks.filter(
                (item) => item.id !== elem.id
              );
          };

          newMediaStream.enabled = true

          clientTracksArray.push(newMediaStream);

          this.parentClassRef.selfTracks.push(elem);
        });

        return clientTracksArray;
      } catch (e) {
        throw new Error(e);
      }
    };

    return createTracks();
  }

  //properties
  params;

  parentClassRef;
}
