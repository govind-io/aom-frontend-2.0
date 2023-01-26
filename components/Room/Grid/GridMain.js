import { Grid } from "@mui/material";
import { meetClient, setMeetClient } from "../../../Utils/Configs/MeetClient";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { useEffect } from "react";
import { RTCClient } from "../../../MEET_SDK/rtc";
import { useSelector } from "react-redux";

export default function GridMain({ profilename, audio, video }) {
  const user = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);

  useEffect(() => {
    const connectMeet = async () => {
      const client = new RTCClient();

      try {
        await client.connect({
          token: roomData.token,
          uid: `${user.username}-${profilename || user.name || user.username}`,
          role: "host",
        });

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
