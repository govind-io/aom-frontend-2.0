import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import text from "../../../../Content/text.json";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { ROOM } from "../../../../Utils/MeetingUtils/MeetingConstant";
import { DataPacket_Kind } from "livekit-client";
import { EVENTSTATUS } from "../../../../Utils/Contants/Constants";
import { useState } from "react";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SendRoomMessage } from "../../../../Redux/Actions/Room/RoomDataAction";

export default function SendMessage({ setMessages }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const val = e.target.message.value;

    if (!val) return;

    setLoading(true);

    const messagePayload = {
      type: EVENTSTATUS.MESSAGE_EVENT,
      message: val,
      created_at: new Date().getTime(),
    };

    const data = {
      data: {
        message: messagePayload.message,
      },
      meetingId: ROOM.name,
      onFailed: () => {
        ToastHandler("warn", "Message sent but could not store message");
      },
    };

    dispatch(SendRoomMessage(data));

    const encoder = new TextEncoder();

    const encodedMessage = encoder.encode(JSON.stringify(messagePayload));

    try {
      await ROOM.localParticipant.publishData(
        encodedMessage,
        DataPacket_Kind.RELIABLE
      );
      setLoading(false);
      e.target.message.value = "";
      setMessages((prev) => [
        ...prev,
        {
          message: messagePayload.message,
          by: {
            username: ROOM.localParticipant.identity,
            name: ROOM.localParticipant.name,
          },
          created_at: messagePayload.created_at,
        },
      ]);
    } catch (e) {
      ToastHandler("dan", "Could not send message");
    }
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
        disabled={loading}
      >
        {loading ? (
          <CircularProgress
            sx={{
              color: "white",
            }}
          />
        ) : (
          <SendOutlinedIcon
            sx={{
              color: "white",
              transform: "rotate(-45deg)",
            }}
          />
        )}
      </IconButton>
    </Paper>
  );
}
