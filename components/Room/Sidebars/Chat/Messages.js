import { CircularProgress, Grid, Typography } from "@mui/material";
import { RoomEvent } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeUnreadMessageCount } from "../../../../Redux/Actions/Comps/DataComps";
import { GetRoomMessage } from "../../../../Redux/Actions/Room/RoomDataAction";
import { VIEWSTATUS } from "../../../../Utils/Contants/Conditional";
import { EVENTSTATUS } from "../../../../Utils/Contants/Constants";
import convertDateToLocalTime from "../../../../Utils/DesignUtilities/DateManipulation";
import { ROOM } from "../../../../Utils/MeetingUtils/MeetingConstant";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";

export default function Messages({ messages, setMessages }) {
  const dispatch = useDispatch();

  const userData = useSelector((s) => s.user.data);

  const containerRef = useRef();

  const [loading, setLoading] = useState(false);
  const [reachedMessageEnd, setReachedMessageEnd] = useState(false);

  const handleScroll = (e) => {
    if (e.target.scrollTop !== 0 || reachedMessageEnd) return;

    setLoading(true);
    const data = {
      data: {
        meetingId: ROOM.name,
        limit: VIEWSTATUS.MESSAGE_LIMIT,
        skip: messages.length,
      },
      onFailed: () => {
        ToastHandler("warn", "Could not get previous message");
        setLoading(false);
      },
      onSuccess: (data) => {
        console.log({
          condition: data.messages.length < VIEWSTATUS.MESSAGE_LIMIT,
        });
        if (data.messages.length < VIEWSTATUS.MESSAGE_LIMIT)
          setReachedMessageEnd(true);

        setMessages((prev) => {
          return [
            ...data.messages.sort((a, b) => {
              const nextMessageDate = new Date(b.created_at);
              const previousMessageDate = new Date(a.created_at);
              if (previousMessageDate < nextMessageDate) return -1;
              else return 1;
            }),
            ...prev,
          ];
        });
        setLoading(false);
      },
    };

    dispatch(GetRoomMessage(data));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scrollToBottom = () => {
      containerRef.current.scrollBy({
        left: 0,
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });

      dispatch(ChangeUnreadMessageCount(0));
    };

    const ScrollOnNewMessage = (data) => {
      const decoder = new TextDecoder();

      const messagePayload = JSON.parse(decoder.decode(data));

      if (messagePayload.type !== EVENTSTATUS.MESSAGE_EVENT) return;

      scrollToBottom();
    };

    scrollToBottom();
    ROOM.on(RoomEvent.DataReceived, ScrollOnNewMessage);

    return () => {
      ROOM.off(RoomEvent.DataReceived, ScrollOnNewMessage);
    };
  }, []);

  return (
    <Grid
      item
      xs={12}
      sx={{
        height: "calc(100% - 100px)",
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: "20px",
        paddingRight: "20px",
        "::-webkit-scrollbar": {
          width: "0.5em",
          backgroundColor: "#F5F5F5",
        },
        "::-webkit-scrollbar-thumb": {
          borderRadius: "10px",
          backgroundColor: "#000000",
        },
      }}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {loading && (
        <Grid container justifyContent={"center"}>
          <CircularProgress
            sx={{ color: "white", marginTop: "30px" }}
            size={"20px"}
          />
        </Grid>
      )}

      {messages.map((item) => {
        const selfMessage = item.by.username === userData.username;

        return (
          <Grid
            sx={{
              maxWidth: "90%",
              background: selfMessage
                ? "#3D3F41 0% 0% no-repeat padding-box"
                : "#1B1A1D 0% 0% no-repeat padding-box",
              borderRadius: selfMessage ? "8px 8px 0px 8px" : "8px 8px 8px 0px",
              marginLeft: selfMessage ? "auto" : "0px",
              marginTop: "30px",
              padding: "10px",
            }}
            container
            key={item.by}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  font: "normal normal 600 16px/19px Work Sans",
                  color: "#F5F5F5",
                }}
                variant="span"
              >
                {selfMessage ? "You" : item.by.name || item.by.username}
              </Typography>
              <Typography
                sx={{
                  font: "normal normal normal 12px/16px Work Sans",
                  color: "#797979",
                }}
                variant="span"
              >
                {convertDateToLocalTime(item.created_at)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                font: "normal normal normal 14px/16px Work Sans",
                color: "#CECECE",
                marginTop: "10px",
              }}
            >
              <Typography>{item.message}</Typography>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
