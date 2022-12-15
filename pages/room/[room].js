import {
  Badge,
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
import { SaveUserData } from "../../Redux/Actions/User/DataAction";
import { GetMeetToken } from "../../Utils/ApiUtilities/GetMeetToken";
import { meetClient, setMeetClient } from "../../Utils/Configs/MeetClient";
import ToastHandler from "../../Utils/Toast/ToastHandler";
import {
  TogglChatList,
  ToggleParticpantsList,
} from "../../Redux/Actions/Comps/CollapsibleComps";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { RTCClient } from "../../MEET_SDK/rtc";
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

  const participantsCount = useSelector(
    (state) => state.comps.dataComp.participants
  );

  const unreadMessageCount = useSelector((state) => state.comps.dataComp.chat);

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

      if (!userData || !userData.uid || !userData.role) {
        ToastHandler("dan", "Please join a room first");
        router.push("/");
      } else if (userData.room !== room) {
        dispatch(SaveUserData({ room }));

        if (meetClient) {
          meetClient.close();
        }

        ToastHandler("info", "Room changed");

        const token = await GetMeetToken(room);

        dispatch(SaveUserData({ token }));
        meetClient.connect({
          role: userData.role,
          uid: userData.uid,
          token,
        }).then(() => {
          setMeetClient(meetClient)
          setRoomJoined(true);
          ToastHandler("sus", "Joined another room succefully");
        });
      } else if (!meetClient) {

        const client = new RTCClient()

        client.connect({
          role: userData.role,
          uid: userData.uid,
          token: userData.token,
        }).then(() => {
          setMeetClient(client)
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
    if (!meetClient || !roomJoined) return;


    meetClient?.on("disconnect", (reason) => {
      console.log({ reason })
      if (reason === "io server disconnect") {
        router.push("/");
        console.log("You joined using another device")
        return ToastHandler("dan", "You joined using another device")
      }

      console.log("Left Room Succesfully")
      ToastHandler("sus", "Left Room Succesfully");
      router.push("/");
    });

    return () => {
      meetClient?.off("disconnect");
    };
  }, [roomJoined, meetClient]);

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
              <Badge badgeContent={participantsCount} color="primary">
                <PeopleAltIcon />
              </Badge>
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
              <Badge color="primary" badgeContent={unreadMessageCount}>
                <ChatBubbleIcon />
              </Badge>
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
                  width: `calc(100% - ${(showParticipantsList ? participantWidth : 0) +
                    (showChat ? chatWidth : 0)
                    }px)`,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#202124"
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
