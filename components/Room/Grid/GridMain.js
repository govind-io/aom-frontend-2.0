import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VIEWSTATUS } from "../../../Utils/Contants/Conditional";
import GalleryView from "./GalleryView";
import SpeakerView from "./SpeakerView";
import { useRouter } from "next/router";
import { Room, RoomEvent } from "livekit-client";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { SaveRoomControls } from "../../../Redux/Actions/Room/RoomDataAction";
import { updateRoom } from "../../../Utils/MeetingUtils/MeetingConstant";
import { ChangeParticipantCounts } from "../../../Redux/Actions/Comps/DataComps";

export default function GridMain({ profilename, audio, video }) {
  const userData = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);
  const roomLayout = useSelector((s) => s.room.layout);

  const dispatch = useDispatch();
  const router = useRouter();

  //global states for all grid
  const [users, setUsers] = useState([]);
  const [presenters, setPresenters] = useState([]);

  const roomRef = useRef();

  //functions here

  const updateParticipantsCount = (e) => {
    dispatch(ChangeParticipantCounts(roomRef.current.participants.size + 1));
    setUsers(() => {
      return new Map(roomRef.current.participants);
    });
  };

  const roomEventHandler = ({ room }) => {
    room.on(RoomEvent.ParticipantConnected, updateParticipantsCount);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipantsCount);
  };

  useEffect(() => {
    async function connectRoom() {
      const room = new Room({ adaptiveStream: true, dynacast: true });

      try {
        await room.connect(process.env.MEET_URL, roomData.token);
        roomEventHandler({ room });
        updateRoom(room);
        roomRef.current = room;
        updateParticipantsCount();
      } catch (e) {
        ToastHandler("dan", "Something went wrong");
        console.log({ e });
        router.push("/");
        return;
      }

      if (audio === "true") {
        await room.localParticipant.setMicrophoneEnabled(true);
        dispatch(SaveRoomControls({ audio: true }));
      }

      if (video === "true") {
        await room.localParticipant.setCameraEnabled(true);
        dispatch(SaveRoomControls({ video: true }));
      }
    }

    connectRoom();
  }, []);

  return (
    <Grid
      container
      sx={{
        height: "90%",
        width: "95%",
      }}
      id="main-grid"
    >
      {roomRef.current &&
        (roomLayout.view === VIEWSTATUS.GALLERY && presenters.length === 0 ? (
          <GalleryView
            users={users}
            selfUID={`${userData.username}-${
              profilename || userData.name || userData.username
            }`}
            setPresenters={setPresenters}
          />
        ) : roomLayout.view === VIEWSTATUS.SPEAKER || presenters.length > 0 ? (
          <SpeakerView
            users={users}
            selfUID={`${userData.username}-${
              profilename || userData.name || userData.username
            }`}
            presenters={presenters}
            setPresenters={setPresenters}
          />
        ) : (
          <Typography>Soemthing went wrong</Typography>
        ))}
    </Grid>
  );
}
