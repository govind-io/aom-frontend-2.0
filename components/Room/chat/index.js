import { Button, Grid, Input, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { socket } from "../../../Utils/Configs/Socket";
import Message from "./Message";

export default function Chat() {
  //refs here
  const inputRef = useRef();
  const messagesRef = useRef();
  const messageArea = useRef();

  //selector here
  const userData = useSelector((state) => state.user.data);

  //messages here
  const [Messages, setMessages] = useState([]);

  //setting ref value
  messagesRef.current = Messages;

  //effects here
  useEffect(() => {
    if (!socket || !userData?.token) return;

    const func = async () => {
      const allMessages = await socket.getAllMessages(userData.token);
      setMessages(allMessages);
    };

    func();

    const socketMessageHandler = (data) => {
      setMessages([...messagesRef.current, data]);
    };

    socket.on("message", socketMessageHandler);

    return () => {
      socket?.off("message", socketMessageHandler);
    };
  }, [socket]);

  useEffect(() => {
    if (!messageArea.current) return;
    messageArea.current.scrollTop = messageArea.current.scrollHeight;
  }, [Messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const val = inputRef.current.childNodes[0].value;
    if (val.length < 1) {
      return ToastHandler("warn", "Message cannot be empty");
    }
    socket.emit(
      "send-message",
      {
        content: val,
      },
      (err) => {
        if (err) return;
        inputRef.current.childNodes[0].value = "";
      }
    );
  };

  return (
    <Grid
      container
      style={{
        height: "100%",
        backgroundColor: "#e0ded1",
        borderRadius: "15px",
      }}
      alignItems="space-between"
    >
      <Grid
        item
        xs={12}
        style={{
          height: "fit-content",
        }}
      >
        <Typography
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "center",
            padding: "20px",
            paddingBottom: "10px",
          }}
        >
          Chat
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "calc(100% - 160.5px)",
          overflowY: "auto",
          padding: "0px 20px 20px 20px",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: "10px",
          },
          "&&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
          },
        }}
        ref={messageArea}
      >
        {Messages.map((elem, index, all) => {
          return (
            <Message
              key={elem.date}
              content={elem.content}
              date={elem.date}
              by={elem.by}
              user_id={elem.user_id}
              showBy={index === 0 || elem.by !== all[index - 1].by}
            />
          );
        })}
      </Grid>
      <Grid
        item
        xs={12}
        style={{ backgroundColor: "white", height: "fit-content" }}
      >
        <form onSubmit={handleSendMessage}>
          <Grid
            container
            style={{
              padding: "20px 20px 20px 20px",
            }}
          >
            <Grid item xs={8}>
              <Input placeholder="Send Message Here" ref={inputRef} fullWidth />
            </Grid>
            <Grid item xs={4}>
              <Button type={"submit"} variant="contained" fullWidth>
                Send
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
