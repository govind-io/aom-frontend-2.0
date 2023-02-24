import { meetClient } from "../Configs/MeetClient";
import ToastHandler from "../Toast/ToastHandler";

export const handleCreateAndPublishVideoTrack = async () => {
  if (!meetClient) return ToastHandler("dan", "Something went wrong");

  try {
    const tracks = await meetClient.createTracks({
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
        facingMode: "user",
      },
    });

    await meetClient.produceTracks(tracks);

    return tracks[0];
  } catch (e) {
    if (e.message === "NotAllowedError: Permission denied") {
      return ToastHandler("dan", "Permission denied");
    }

    ToastHandler("dan", "Something went wrong");
    return false;
  }
};

export const handleCreateAndPublishAudioTrack = async () => {
  if (!meetClient) return ToastHandler("dan", "Something went wrong");

  try {
    const tracks = await meetClient.createTracks({ audio: true });

    await meetClient.produceTracks(tracks);

    return tracks[0];
  } catch (e) {
    if (e.message === "NotAllowedError: Permission denied") {
      return ToastHandler("dan", "Permission denied");
    }

    ToastHandler("dan", "Something went wrong");
    return false;
  }
};

export const handleCreateAndPublishScreenTrack = async () => {
  if (!meetClient) return ToastHandler("dan", "Something went wrong");

  try {
    const tracks = await meetClient.createScreenTrack();

    await meetClient.produceTracks(tracks, "screen");

    return tracks;
  } catch (e) {
    if (e.message === "NotAllowedError: Permission denied") {
      return false;
    }

    ToastHandler("dan", "Something went wrong");
    return false;
  }
};

export const handleUnPublishTrack = async (track) => {
  track.stop();
  await meetClient.unprodueTracks([track]);
  return true;
};
