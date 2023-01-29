import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { meetClient } from "../../../../Utils/Configs/MeetClient";

export default function Messages() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (!meetClient) return;

    const setIntialMessage = async () => {
      setMessage(await meetClient.getAllMessages(userData.token));
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
