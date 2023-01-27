import { CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoomMain from "../../../components/Room/RoomMain";
import {
  GetRoomDetails,
  SaveRoomControls,
  SaveRoomData,
} from "../../../Redux/Actions/Room/RoomDataAction";
import ToastHandler from "../../../Utils/Toast/ToastHandler";

export default function Room() {
  const user = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);
  const dispatch = useDispatch();
  const router = useRouter();

  const { room, profilename } = router.query;
  let { video, audio } = router.query;

  const { isReady } = router;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    dispatch(
      SaveRoomControls({
        screen: false,
        audio: false,
        video: false,
      })
    );

    if (!room) {
      ToastHandler("dan", "Please Join a Room");
      router.push("/home");
      return;
    }

    if (!user.username) {
      router.push({
        pathname: "/",
        query: { from: "roompage", name: room },
      });

      return;
    }

    if (room !== roomData.meetingId) {
      setLoading(true);

      //resetting video and audio for user directly trying to join a room
      video = "false";
      audio = "false";

      dispatch(
        GetRoomDetails({
          data: {
            meetingId: room,
          },
          onSuccess: (data) => {
            setLoading(false);
          },
          onFailed: (data) => {
            if (data.message.includes(404)) {
              ToastHandler("dan", "Invalid Meeting Id");
            } else {
              ToastHandler("dan", "Something went wrong");
            }

            router.push("/home");
          },
        })
      );

      return;
    }
  }, [room, isReady]);

  return (
    <Grid
      container
      sx={{
        width: "100%",
        height: "100vh",
      }}
      justifyContent={"center"}
      alignItems="center"
    >
      {loading ? (
        <CircularProgress sx={{ color: "white" }} />
      ) : (
        <RoomMain video={video} audio={audio} profilename={profilename} />
      )}
    </Grid>
  );
}
