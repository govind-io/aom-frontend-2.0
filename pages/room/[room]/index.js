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

  const { room, profilename, passcode, internalRedirect } = router.query;
  let { video, audio } = router.query;

  const { isReady } = router;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    if (!room) {
      ToastHandler("dan", "Please Join a Room");
      router.push("/home");
      return;
    }

    if (!user.username) {
      router.push({
        pathname: "/",
        query: {
          from: "roompage",
          room,
          passcode,
          profilename,
          video,
          audio,
        },
      });

      return;
    }

    if (!internalRedirect) {
      router.push(
        {
          pathname: `/room/${room}/join`,
          query: { profilename, passcode, audio, video },
        },
        { pathname: `/room/${room}/join` }
      );
      return;
    }

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

    if (!user.name && !profilename) {
      router.push(
        {
          pathname: `/room/${room}/join`,
          query: { profilename, passcode, audio, video },
        },
        { pathname: `/room/${room}/join` }
      );

      ToastHandler("dan", "Name is required for guest users");

      return;
    }

    if (room !== roomData.meetingId || !roomData.token) {
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
              if (!passcode) {
                router.push(
                  {
                    pathname: `/room/${room}/join`,
                    query: { profilename, passcode, audio, video },
                  },
                  { pathname: `/room/${room}/join` }
                );
                return ToastHandler(
                  "dan",
                  "This is a protected meeting, please enter passcode"
                );
              } else {
                ToastHandler("dan", "Invalid Passcode, please try again");
              }
            } else {
              ToastHandler("dan", "Something went wrong");
            }

            router.push("/home");
          },
        })
      );

      return;
    }

    setLoading(false);
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
