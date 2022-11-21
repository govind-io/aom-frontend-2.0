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
  const [users, setUsers] = useState([]);

  //Event listeners

  const userPublishedEvents = async (user) => {
    try {
      await user.subscribe();
    } catch (e) {
      console.log(e);
    }
  };

  //creating RTC client here
  useEffect(() => {
    if (RtcClient || !socket) return;

    CreateRtcClient()
      .then((device) => {
        setRtcClient(device);

        device.on("user-joined", (user) => {
          setUsers((perv) => [...prev, user])
        })

        device.on("user-left", (user) => {
          setUsers((prev) => prev.filter((elem) => elem.uid !== user.uid))
        })

      })
      .catch((e) => console.log(e.message));
  }, [socket]);

  //for creating tracks
  useEffect(() => {
    if (!RtcClient || userData.role !== "host" && (!tracks.audioTrack && !tracks.videoTrack)) return;

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

    RtcClient.produceTracks([tracks.audioTrack, tracks.videoTrack])
      .then((producers) => {
        console.log({ producers });
      })
      .catch((e) => {
        console.log({ e });
      });
  }, [RtcClient, tracks]);

  useEffect(() => {
    if (!RtcClient) return;

    RtcClient.on("user-published", userPublishedEvents);


    RtcClient.on("user-unpublished", (user) => {
      console.log("this user unpublished it;s track", user)
    })

    return () => {
      RtcClient.off("user-published", userPublishedEvents);
      RtcClient.off("user-unpublished")
    };
  }, [RtcClient]);

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

      {users.map((item) => {
        return (
          <Grid
            item
            xs={3}
            style={{
              border: "1px solid yello",
              aspectRatio: "1",
              position: "relative",
            }}
            key={item.uid}
          >
            <VideoPlayer
              videoTrack={item.video}
              audioTrack={item.audio}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
