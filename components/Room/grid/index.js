import { Grid, IconButton } from "@mui/material";
import { useRouter } from "next/router";
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
  const [sharingTracks, setSharingTracks] = useState(false);

  //constants
  const router = useRouter();

  //creating RTC client here
  useEffect(() => {
    if (RtcClient || !socket) return;

    let localDevice;

    const userJoinedEvent = (user) => {
      if (user.role !== "host") return;
      setUsers((prev) => {
        return [...prev, user];
      });
    };

    const userLeftEvent = (user) => {
      if (user.role !== "host") return;
      setUsers((prev) => prev.filter((item) => item.uid !== user.uid));
    };

    CreateRtcClient()
      .then((device) => {
        localDevice = device;
        localDevice.on("user-joined", userJoinedEvent);
        localDevice.on("user-left", userLeftEvent);
        setRtcClient(device);
      })
      .catch((e) => console.log(e.message));

    return () => {
      if (localDevice) {
        localDevice?.off("user-joined", userJoinedEvent);

        localDevice?.off("user-left", userLeftEvent);
      }
    };
  }, [socket]);

  //for creating tracks
  useEffect(() => {
    if (
      !RtcClient ||
      (userData.role !== "host" && !tracks.audioTrack && !tracks.videoTrack)
    )
      return;

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
      (!tracks.audioTrack && !tracks.videoTrack) ||
      sharingTracks
    )
      return;

    RtcClient.produceTracks([tracks.audioTrack, tracks.videoTrack])
      .then()
      .catch((e) => {
        console.log({ e });
      });

    setSharingTracks(true);
  }, [RtcClient, tracks]);

  useEffect(() => {
    if (!RtcClient) return;

    const userUnpublishedEvents = (user) => {
      setUsers((prev) =>
        prev.map((item) => {
          if (item.uid === user.uid) {
            item[kind] = undefined;
            return item;
          } else return item;
        })
      );
    };

    //Event listeners
    const userPublishedEvents = async (user) => {
      try {
        const { track, kind } = await user.subscribe();

        setUsers((prev) => {
          return prev.map((item) => {
            if (item.uid === user.uid) {
              return { ...item, [kind]: track };
            } else return item;
          });
        });
      } catch (e) {
        console.log(e);
      }
    };

    RtcClient.on("user-published", userPublishedEvents);
    RtcClient.on("user-unpublished", userUnpublishedEvents);

    return () => {
      RtcClient?.off("user-published", userPublishedEvents);
      RtcClient?.off("user-unpublished");
      RtcClient?.off("user-joined");
      RtcClient?.off("user-left");
    };
  }, [RtcClient]);

  useEffect(() => {
    return () => {
      if (RtcClient) {
        RtcClient.close();
      }
    };
  }, []);

  return (
    <Grid
      container
      sx={{
        maxHeight: "100%",
        overflowY: "auto",
      }}
      justifyContent="center"
    >
      <IconButton
        onClick={() => {
          if (RtcClient) {
            RtcClient.close();
          }
          router.push("/");
        }}
        style={{
          position: "fixed",
          right: "10px",
          top: "10px",
          borderRadius: "10px",
          backgroundColor: "red"
        }}
        variant="contained"
      >
        Leave Room
      </IconButton>
      {userData.role === "host" && (
        <Grid
          item
          xs={users.length >= 0 && users.length < 2 ? 6 : 3}
          style={{
            border: "1px solid yello",
            aspectRatio: "1",
            position: "relative",
          }}
        >
          <VideoPlayer
            videoTrack={tracks.videoTrack}
            audioTrack={tracks.audioTrack}
            user={{ uid: userData.uid, role: userData.role }}
            self={true}
          />
          <SelfControl
            videoTrack={tracks.videoTrack}
            audioTrack={tracks.audioTrack}
            setTracks={setTracks}
          />
        </Grid>
      )
      }

      {
        users.map((item) => {
          return (
            <Grid
              item
              xs={users.length >= 0 && users.length < 2 ? 6 : 3
              }
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
                user={item}
              />
            </Grid >
          );
        })}
    </Grid >
  );
}
