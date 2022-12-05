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
            elem.enabled = val ? true : false;
            newMediaStream.enabled = val ? true : false;
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
