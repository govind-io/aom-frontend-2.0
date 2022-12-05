import {
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../../components/Room/chat";
import MainGrid from "../../components/Room/grid";
import Participants from "../../components/Room/Participants";
import { ConnectMeet } from "../../MEET_SDK";
import { SaveUserData } from "../../Redux/Actions/User/DataAction";
import { GetMeetToken } from "../../Utils/ApiUtilities/GetMeetToken";
import { setSocket, socket } from "../../Utils/Configs/Socket";
import ToastHandler from "../../Utils/Toast/ToastHandler";
import Collapse from "@mui/material/Collapse";
import {
  TogglChatList,
  ToggleParticpantsList,
} from "../../Redux/Actions/Comps/CollapsibleComps";

export default function Room() {
  //constants here
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data);

  //comps selectors
  const showParticipantsList = useSelector(
    (state) => state.comps.comp.participants
  );
  const showChat = useSelector((state) => state.comps.comp.chat);

  //room name extraction
  const { room } = router.query;

  //states here
  const [participantWidth, setParticipantsWidth] = useState(0);
  const [chatWidth, setChatWidth] = useState(0);

  const [roomJoined, setRoomJoined] = useState(false);

  //effects here
  useEffect(() => {
    const func = async () => {
      if (!room) return;

      if (!userData || !userData.name || !userData.role) {
        ToastHandler("dan", "Please join a room first");
        router.push("/");
      } else if (userData.room !== room) {
        dispatch(SaveUserData({ room }));

        if (socket) {
          socket.disconnect();
        }

        ToastHandler("info", "Room changed");

        const token = await GetMeetToken(room);

        dispatch(SaveUserData({ token }));
        ConnectMeet({
          role: userData.role,
          uid: userData.name,
          token,
        }).then((socket) => {
          setSocket(socket);
          setRoomJoined(true);
          ToastHandler("sus", "Joined another room succefully");
        });
      } else if (!socket) {
        ConnectMeet({
          role: userData.role,
          token: userData.token,
          uid: userData.name,
        }).then((socket) => {
          setSocket(socket);
          setRoomJoined(true);
          ToastHandler("sus", "Joined room succefully");
        });
      } else {
        setRoomJoined(true);
        ToastHandler("sus", "Joined room succesfully");
      }
    };

    func();
  }, [room]);

  useEffect(() => {
    if (!socket || !roomJoined) return;

    socket?.on("disconnect", () => {
      ToastHandler("sus", "Left Room Succesfully");
      router.push("/");
    });

    return () => {
      socket?.off("disconnect");
    };
  }, [roomJoined, socket]);

  useEffect(() => {
    const fullScreen = document.body.clientWidth;

    setParticipantsWidth(fullScreen / 6);

    setChatWidth(fullScreen / 4);
  }, []);

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      {roomJoined ? (
        <>
          <Grid
            item
            xs={12}
            paddingTop="20px"
            paddingBottom="20px"
            style={{
              height: "72px",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => {
                dispatch(ToggleParticpantsList(!showParticipantsList));
              }}
              sx={{
                position: "absolute",
                left: "5px",
              }}
            >
              {showParticipantsList
                ? "Close Participants"
                : "Open Participants"}
            </IconButton>
            <IconButton
              onClick={() => {
                dispatch(TogglChatList(!showChat));
              }}
              sx={{
                position: "absolute",
                right: "5px",
              }}
            >
              {showChat ? "Close Chat" : "Open Chat"}
            </IconButton>
            <Typography variant="h6" textAlign={"center"}>
              You are in{" "}
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {room}
              </span>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              height: "calc(100% - 72px)",
            }}
          >
            <Grid
              container
              style={{
                height: "100%",
              }}
            >
              <Drawer
                variant="persistent"
                anchor="left"
                open={showParticipantsList}
                sx={{
                  width: showParticipantsList ? participantWidth : 0,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: showParticipantsList ? participantWidth : 0,
                    boxSizing: "border-box",
                    top: "72px",
                  },
                }}
              >
                <Grid
                  item
                  sx={{
                    border: "1px solid red",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Participants />
                </Grid>
              </Drawer>
              <Grid
                item
                sx={{
                  border: "1px solid yellow",
                  height: "100%",
                  width: `calc(100% - ${
                    (showParticipantsList ? participantWidth : 0) +
                    (showChat ? chatWidth : 0)
                  }px)`,
                }}
              >
                <MainGrid />
              </Grid>
              <Drawer
                variant="persistent"
                anchor="right"
                open={showChat}
                sx={{
                  width: showChat ? chatWidth : 0,
                  flexShrink: 0,

                  "& .MuiDrawer-paper": {
                    width: showChat ? chatWidth : 0,
                    boxSizing: "border-box",
                    top: "72px",
                    height: "calc(100% - 72px)",
                  },
                }}
              >
                <Grid
                  item
                  sx={{
                    border: "1px solid blue",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Chat />
                </Grid>
              </Drawer>
            </Grid>
          </Grid>
        </>
      ) : (
        <CircularProgress
          size={64}
          sx={{
            margin: "auto",
          }}
        />
      )}
    </Grid>
  );
}
