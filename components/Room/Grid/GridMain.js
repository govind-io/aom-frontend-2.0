import { Grid, Typography } from "@mui/material";
import { meetClient, setMeetClient } from "../../../Utils/Configs/MeetClient";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { useEffect, useState } from "react";
import { RTCClient } from "../../../MEET_SDK/rtc";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../Redux/Actions/Room/RoomDataAction";
import {
  handleCreateAndPublishAudioTrack,
  handleCreateAndPublishVideoTrack,
} from "../../../Utils/MeetingUtils/Tracks";
import { GALLERY, SPEAKER } from "../../../Utils/Contants/Conditional";
import GalleryView from "./GalleryView";
import SpeakerView from "./SpeakerView";

export default function GridMain({ profilename, audio, video }) {
  const userData = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);
  const roomLayout = useSelector((s) => s.room.layout);

  const dispatch = useDispatch();

  //global states for all grid

  const [users, setUsers] = useState([]);

  const attachEventListener = (client) => {
    const userJoinedEvent = (user) => {
      if (user.role !== "host") return;
      setUsers((prev) => {
        return [...prev, user];
      });
    };

    const userLeftEvent = (user) => {
      if (user.role !== "host") return;
      setUsers((prev) => prev.filter((item) => item.uid !== user.uid));
    };

    const userUnpublishedEvents = (user) => {
      const { kind, trackId, uid, type } = user;

      setUsers((prev) => {
        return prev.map((item) => {
          if (item.uid === uid && item[type || kind]?.id === trackId) {
            item[type || kind] = undefined;
            return item;
          } else return item;
        });
      });
    };

    //Event listeners
    const userPublishedEvents = async (user) => {
      try {
        const { track, kind } = await client.subscribe(user);

        const { type, uid } = user;

        setUsers((prev) => {
          return prev.map((item) => {
            if (item.uid === uid) {
              return { ...item, [type || kind]: track };
            } else return item;
          });
        });
      } catch (e) {
        console.log(e);
      }
    };

    const handleRemoteTrackStateChanged = ({ uid }) => {
      setUsers((prev) => [...prev]);
    };

    client.onUserJoined(userJoinedEvent);
    client.onUserLeft(userLeftEvent);
    client.onUserPublished(userPublishedEvents);
    client.onUserUnpublished(userUnpublishedEvents);
    client.onRemoteTrackStateChanged = handleRemoteTrackStateChanged;
  };

  useEffect(() => {
    const connectMeet = async () => {
      const client = new RTCClient();

      try {
        await client.connect({
          token: roomData.token,
          uid: `${userData.username}-${
            profilename || userData.name || userData.username
          }`,
          role: "host",
        });

        attachEventListener(client);

        await client.init();

        setMeetClient(client);

        if (video?.toLowerCase() === "true") {
          dispatch(
            SaveRoomControls({
              video: await handleCreateAndPublishVideoTrack(),
            })
          );
        }

        if (audio?.toLowerCase() === "true") {
          dispatch(
            SaveRoomControls({
              audio: await handleCreateAndPublishAudioTrack(),
            })
          );
        }

        ToastHandler("sus", "Connected to meeting succefully");
      } catch (e) {
        ToastHandler("dan", "Something went wrong");
        console.log("error occured ", e);
      }
    };

    connectMeet();

    return () => {
      if (meetClient) {
        meetClient.close();
        ToastHandler("warn", "Meeting Left Succefully");
      }
    };
  }, []);

  return (
    <Grid
      container
      sx={{
        border: "1px solid white",
        height: "90%",
        width: "95%",
      }}
    >
      {roomLayout.view === GALLERY ? (
        <GalleryView users={users} />
      ) : roomLayout.view === SPEAKER ? (
        <SpeakerView users={users} />
      ) : (
        <Typography>Soemthing went wrong</Typography>
      )}
    </Grid>
  );
}
