import { CircularProgress, Grid, Typography } from "@mui/material";
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

export default function Room() {
  //constants here
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data);

  //room name extraction
  const { room } = router.query;

  //states here

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
          <Grid item xs={12} paddingTop="20px" paddingBottom="20px">
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
              <Grid
                item
                xs={2}
                sx={{
                  border: "1px solid red",
                  height: "100%",
                }}
              >
                <Participants />
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  border: "1px solid yellow",
                  maxHeight: "100%",
                }}
              >
                <MainGrid />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  border: "1px solid blue",
                  height: "100%",
                }}
              >
                <Chat />
              </Grid>
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
