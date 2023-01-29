import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import text from "../../../../Content/text.json";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { meetClient } from "../../../../Utils/Configs/MeetClient";

export default function SendMessage() {
  const handleSendMessage = (e) => {
    e.preventDefault();

    const val = e.target.message.value;

    if (!val) return;

    meetClient.emit(
      "send-message",
      {
        content: val,
      },
      (err) => {
        if (err) return ToastHandler("dan", "Error Sending Your Message");

        e.target.message.value = "";
      }
    );
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        p: "10% 5%",
        backgroundColor: "#1B1A1D",
        borderRadius: "8px",
      }}
      elevation={0}
      onSubmit={handleSendMessage}
    >
      <InputBase
        sx={{
          flex: 1,
          backgroundColor: "#1B1A1D",
          font: "normal normal normal 14px/14px Work Sans",
          color: "#CECECE",
          mr: "10px",
        }}
        name="message"
        placeholder={text.room.chat.sendMessage}
      />
      <IconButton
        sx={{
          p: "10px",
          backgroundColor: "#66B984",
          border: "2px solid #FFFFFF",
          height: "50px",
          width: "50px",
          borderRadius: "8px",
        }}
        disableRipple={true}
        type="submit"
      >
        <SendOutlinedIcon
          sx={{
            color: "white",
            transform: "rotate(-45deg)",
          }}
        />
      </IconButton>
    </Paper>
  );
}
