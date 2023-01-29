import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { meetClient } from "../../../../Utils/Configs/MeetClient";

export default function Messages() {
  const [message, setMessage] = useState([]);

  const roomData = useSelector((s) => s.room.data);

  useEffect(() => {
    if (!meetClient) return;

    const setIntialMessage = async () => {
      setMessage(await meetClient.getAllMessages(roomData.token));
    };

    const MessageListener = (data) => {
      setMessage((prev) => [...prev, data]);
    };

    meetClient.on("message", MessageListener);

    setIntialMessage();

    return () => {
      meetClient.off("message", MessageListener);
    };
  }, []);

  console.log({ message });

  return (
    <Grid
      container
      sx={{
        overflowY: "auto",
        alignItems: "start",
        height: "100%",
      }}
    ></Grid>
  );
}
