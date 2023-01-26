import { Grid } from "@mui/material";
import { meetClient, setMeetClient } from "../../../Utils/Configs/MeetClient";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { useEffect, useState } from "react";
import { RTCClient } from "../../../MEET_SDK/rtc";
import { useSelector } from "react-redux";

export default function GridMain({ profilename, audio, video }) {
  const userData = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);

  //global states for all grid

  const [users, setUsers] = useState([]);

  const [selfTracks, setSelfTracks] = useState({
    audio: "",
    video: "",
    screen: "",
  });

  console.log({ users });

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
      const { kind, trackId, uid } = user;

      setUsers((prev) => {
        return prev.map((item) => {
          if (item.uid === uid && item[kind]?.id === trackId) {
            item[kind] = undefined;
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

        ToastHandler("sus", "Connected to meeting succefully");
      } catch (e) {
        ToastHandler("dan", "Something went wrong");
        console.log("error occured ", e);
      }
    };

    connectMeet();
  }, []);

  return <Grid container>main grid content</Grid>;
}
