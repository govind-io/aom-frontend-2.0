import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VIEWSTATUS } from "../../../Utils/Contants/Conditional";
import GalleryView from "./GalleryView";
import SpeakerView from "./SpeakerView";
import { useRouter } from "next/router";
import { useRoom } from "@livekit/react-core";

export default function GridMain({ profilename, audio, video }) {
  const userData = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);
  const roomLayout = useSelector((s) => s.room.layout);
  const { audio: audioTrack } = useSelector((s) => s.room.controls);

  const dispatch = useDispatch();
  const router = useRouter();

  //global states for all grid
  const [users, setUsers] = useState([]);
  const [presenters, setPresenters] = useState([]);

  //refs for event handling
  const audioRef = useRef();
  audioRef.current = audioTrack;

  const RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
  };
  const {
    connect,
    isConnecting,
    room,
    error,
    participants,
    audioTracks,
    videoTracks,
  } = useRoom(RoomOptions);

  useEffect(() => {
    async function init() {
      await connect(process.env.MEET_URL, roomData.token);
    }

    init().catch((e) => console.error("Could Not connect to server", e));
  }, []);

  useEffect(() => {
    if (!room) return;

    async function connectRoom() {
      await room.connect(process.env.MEET_URL, roomData.token);

      console.log({ audio, video });

      if (audio === "true") {
        room.localParticipant.setMicrophoneEnabled(true);
      }

      if (video === "true") {
        room.localParticipant.setCameraEnabled(true);
      }
    }

    connectRoom();
  }, [room]);

  return (
    <Grid
      container
      sx={{
        height: "90%",
        width: "95%",
      }}
      id="main-grid"
    >
      {roomLayout.view === VIEWSTATUS.GALLERY && presenters.length === 0 ? (
        <GalleryView
          users={users}
          selfUID={`${userData.username}-${
            profilename || userData.name || userData.username
          }`}
        />
      ) : roomLayout.view === VIEWSTATUS.SPEAKER || presenters.length > 0 ? (
        <SpeakerView
          users={users}
          selfUID={`${userData.username}-${
            profilename || userData.name || userData.username
          }`}
          presenters={presenters}
        />
      ) : (
        <Typography>Soemthing went wrong</Typography>
      )}
    </Grid>
  );
}
