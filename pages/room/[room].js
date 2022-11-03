import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Participants from "../../components/Room/Participants";
import { ConnectMeet } from "../../MEET_SDK";
import { SaveUserData } from "../../Redux/Actions/User/DataAction";
import { setSocket, socket } from "../../Utils/Configs/Socket";
import ToastHandler from "../../Utils/Toast/ToastHandler";

export default function Room() {
  //constants here
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data);

  //room name extraction
  const { room } = router.query;

  //effects here
  useEffect(() => {
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

      ConnectMeet({
        room: userData.room,
        name: userData.name,
        role: userData.role,
        appID: process.env.TOKEN || "govind",
        uid: userData.name,
      }).then((socket) => {
        setSocket(socket);
        ToastHandler("sus", "Joined another room succefully");
      });
    } else if (!socket) {
      ConnectMeet({
        room: userData.room,
        name: userData.name,
        role: userData.role,
        appID: process.env.TOKEN || "govind",
        uid: userData.name,
      }).then((socket) => {
        setSocket(socket);
        ToastHandler("sus", "Joined room succefully");
      });
    } else {
      ToastHandler("sus", "Joined room succesfully");
    }
  }, [room]);

  return (
    <Grid container>
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
      <Grid item xs={12}>
        <Grid container>
          <Grid
            item
            xs={2}
            sx={{
              border: "1px solid red",
            }}
          >
            <Participants />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              border: "1px solid yellow",
            }}
          ></Grid>
          <Grid
            item
            xs={4}
            sx={{
              border: "1px solid blue",
            }}
          ></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
