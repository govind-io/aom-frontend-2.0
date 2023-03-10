import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VIEWSTATUS } from "../../../Utils/Contants/Conditional";
import GalleryView from "./GalleryView";
import SpeakerView from "./SpeakerView";
import { RoomEvent } from "livekit-client";
import { ROOM } from "../../../Utils/MeetingUtils/MeetingConstant";
import { ChangeParticipantCounts } from "../../../Redux/Actions/Comps/DataComps";
import { useRouter } from "next/router";
import { EVENTSTATUS } from "../../../Utils/Contants/Constants";
import ToastHandler from "../../../Utils/Toast/ToastHandler";

export default function GridMain({ profilename }) {
  const userData = useSelector((s) => s.user.data);
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

  const disconnected = (reason) => {
    console.log({ reason });
    router.push("/home");
    switch (reason) {
      case EVENTSTATUS.DISCONNECTED_REASON.DUPLICATE_IDENTITY:
        ToastHandler("dan", "Joined from another device");
        break;
      case EVENTSTATUS.DISCONNECTED_REASON.ROOM_DELETED:
        ToastHandler("dan", "Meeting ended");
        break;
      case EVENTSTATUS.DISCONNECTED_REASON.PARTICIPANT_REMOVED:
        ToastHandler("dan", "You were removed from this meeting");
        break;
      case EVENTSTATUS.DISCONNECTED_REASON.SERVER_SHUTDOWN:
        ToastHandler("dan", "Something went wrong, Please connect with us");
        break;
      default:
        ToastHandler("dan", "Something went wrong, Please try again later");
        break;
    }
  };

  const roomEventHandler = ({ room }) => {
    room.on(RoomEvent.ParticipantConnected, updateParticipantsCount);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipantsCount);
    room.on(RoomEvent.Disconnected, disconnected);
  };

  const roomEventCloser = ({ room }) => {
    room.off(RoomEvent.ParticipantConnected, updateParticipantsCount);
    room.off(RoomEvent.ParticipantDisconnected, updateParticipantsCount);
    room.off(RoomEvent.Disconnected, disconnected);
  };

  useEffect(() => {
    if (!ROOM) return;

    roomRef.current = ROOM;
    updateParticipantsCount();
    roomEventHandler({ room: ROOM });

    return () => {
      roomEventCloser({ room: ROOM });
    };
  }, [ROOM]);

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
