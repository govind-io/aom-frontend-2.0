import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeUnreadMessageCount } from "../../../../Redux/Actions/Comps/DataComps";
import { meetClient } from "../../../../Utils/Configs/MeetClient";
import { MESSAGE_EVENT } from "../../../../Utils/Contants/Constants";
import convertDateToLocalTime from "../../../../Utils/DesignUtilities/DateManipulation";

export default function Messages() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState([]);

  const roomData = useSelector((s) => s.room.data);
  const userData = useSelector((s) => s.user.data);

  const containerRef = useRef();

  useEffect(() => {
    if (!meetClient) return;

    const setIntialMessage = async () => {
      setMessage(await meetClient.getAllMessages(roomData.token));
    };

    const MessageListener = (data) => {
      setMessage((prev) => [...prev, data]);
    };

    meetClient.on(MESSAGE_EVENT, MessageListener);

    setIntialMessage();

    return () => {
      meetClient.off(MESSAGE_EVENT, MessageListener);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: 0,
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });

    dispatch(ChangeUnreadMessageCount(0));
  }, [message]);

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
    >
      {message.map((item) => {
        const selfMessage = item.by.split("-")[0] === userData.username;

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
                {selfMessage ? "You" : item.by.split("-")[1]}
              </Typography>
              <Typography
                sx={{
                  font: "normal normal normal 12px/16px Work Sans",
                  color: "#797979",
                }}
                variant="span"
              >
                {convertDateToLocalTime(item.date)}
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
              <Typography
                sx={{
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                }}
              >
                {item.content}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
