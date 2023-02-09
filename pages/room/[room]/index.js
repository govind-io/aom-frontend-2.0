import { CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoomMain from "../../../components/Room/RoomMain";
import {
  ChangeParticipantCounts,
  ChangeUnreadMessageCount,
} from "../../../Redux/Actions/Comps/DataComps";
import {
  GetRoomDetails,
  SaveRoomControls,
  SaveRoomMetaData,
} from "../../../Redux/Actions/Room/RoomDataAction";
import MetaTagsGenerator from "../../../Utils/ComponentUtilities/MetaTagsGenerator";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import metaTags from "../../../Content/metaTags.json";

export default function Room() {
  const user = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);
  const dispatch = useDispatch();
  const router = useRouter();

  const { room, profilename, passcode } = router.query;
  let { video, audio } = router.query;

  const { isReady } = router;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(ChangeUnreadMessageCount(0));
    dispatch(ChangeParticipantCounts(1));

    dispatch(
      SaveRoomControls({
        screen: false,
        audio: false,
        video: false,
      })
    );

    dispatch(
      SaveRoomMetaData({
        existingPresenter: false,
        volumes: {},
      })
    );

    if (!isReady) return;

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

    if (room !== roomData.meetingId || !roomData.token) {
      setLoading(true);

      //resetting video and audio for user directly trying to join a room
      video = "false";
      audio = "false";

      dispatch(
        GetRoomDetails({
          data: {
            meetingId: room,
            pin: passcode,
          },
          onSuccess: (data) => {
            setLoading(false);
          },
          onFailed: (data) => {
            if (data.message.includes(404)) {
              ToastHandler("dan", "Invalid Meeting Id");
            } else if (data.message.includes(400)) {
              if (!passcode)
                return ToastHandler(
                  "dan",
                  "This is a protected meeting, please enter passcode"
                );
              ToastHandler("dan", "Invalid Passcode, please try again");
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
      <MetaTagsGenerator metaTags={metaTags["/"]} />
      {loading ? (
        <CircularProgress sx={{ color: "white" }} />
      ) : (
        <RoomMain video={video} audio={audio} profilename={profilename} />
      )}
    </Grid>
  );
}
