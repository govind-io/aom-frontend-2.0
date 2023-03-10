import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VIEWSTATUS } from "../../../Utils/Contants/Conditional";
import GalleryView from "./GalleryView";
import SpeakerView from "./SpeakerView";
import { RoomEvent } from "livekit-client";
import { ROOM } from "../../../Utils/MeetingUtils/MeetingConstant";
import { ChangeParticipantCounts } from "../../../Redux/Actions/Comps/DataComps";

export default function GridMain({ profilename }) {
  const userData = useSelector((s) => s.user.data);
  const roomLayout = useSelector((s) => s.room.layout);

  const dispatch = useDispatch();

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
    if (!ROOM) return;

    roomRef.current = ROOM;
    updateParticipantsCount();
    roomEventHandler({ room: ROOM });
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
