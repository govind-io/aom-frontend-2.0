import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CreateRtcClient } from "../../../MEET_SDK/rtc";
import { socket } from "../../../Utils/Configs/Socket";
import SelfControl from "./SelfControls";
import VideoPlayer from "./VideoPlayer";
export default function MainGrid() {
  //store selector
  const userData = useSelector((state) => state.user.data);

  //localStates
  const [RtcClient, setRtcClient] = useState();
  const [tracks, setTracks] = useState({});

  //creating RTC client here
  useEffect(() => {
    if (RtcClient || !socket) return;

    CreateRtcClient()
      .then((device) => {
        setRtcClient(device);

        //temporary
        device.on("user-published", ({ user }) => {
          console.log({ user });
        });
      })
      .catch((e) => console.log(e.message));
  }, [socket]);

  //for creating tracks
  useEffect(() => {
    if (!RtcClient || userData.role !== "host") return;

    RtcClient.createTracks({
      audio: true,
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
      },
    })
      .then((tracks) => {
        setTracks(tracks);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [RtcClient, userData]);

  //for producing tracks
  useEffect(() => {
    if (
      !RtcClient ||
      userData.role !== "host" ||
      (!tracks.audioTrack && !tracks.videoTrack)
    )
      return;

    RtcClient.produceTracks({
      audioTrack: tracks.audioTrack,
      videoTrack: tracks.videoTrack,
    })
      .then((producers) => {
        console.log({ producers });
      })
      .catch((e) => {
        console.log({ e });
      });
  }, [RtcClient, tracks]);

  return (
    <Grid
      container
      sx={{
        maxHeight: "100%",
        overflowY: "auto",
      }}
      justifyContent="center"
    >
      {userData.role === "host" && (
        <Grid
          item
          xs={3}
          style={{
            border: "1px solid yello",
            aspectRatio: "1",
            position: "relative",
          }}
        >
          <VideoPlayer
            videoTrack={tracks.videoTrack}
            audioTrack={tracks.audioTrack}
          />
          <SelfControl
            videoTrack={tracks.videoTrack}
            audioTrack={tracks.audioTrack}
          />
        </Grid>
      )}
    </Grid>
  );
}
