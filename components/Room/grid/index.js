import { CollectionsOutlined } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CreateRtcClient } from "../../../MEET_SDK/rtc";
import { socket } from "../../../Utils/Configs/Socket";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
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
  const [pinnedUser, setPinnedUser] = useState({});

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
      const { kind, trackId } = user;

      setUsers((prev) => {
        const temp = prev.map((item) => {
          if (
            (item.uid === user.uid || item.uid.split("@")[0] === user.uid) &&
            item[kind]?.id === trackId
          ) {
            item[kind] = undefined;
            return item;
          } else return item;
        });

        setPinnedUser((prev) => {
          if (prev.uid?.split("@")[0] == user.uid) {
            return {};
          }
          return prev;
        });

        return temp.filter(
          (item) =>
            !(item.uid.split("@")[1] === "screen" && !item.audio && !item.video)
        );
      });
    };

    //Event listeners
    const userPublishedEvents = async (user) => {
      try {
        const { track, kind } = await user.subscribe();

        const { type, uid } = user;

        if (type !== "screen") {
          setUsers((prev) => {
            return prev.map((item) => {
              if (item.uid === uid) {
                return { ...item, [kind]: track };
              } else return item;
            });
          });
        } else {
          const existingUser = users.find((item) => {
            return item.uid === `${uid}@screen`;
          });

          if (existingUser) {
            setUsers((prev) => {
              return prev.map((item) => {
                if (item.uid === `${uid}@screen`) {
                  setPinnedUser({ ...item, [kind]: track });
                  return { ...item, [kind]: track };
                } else {
                  return item;
                }
              });
            });
          } else {
            setUsers((prev) => [
              ...prev,
              { ...user, uid: `${uid}@screen`, [kind]: track },
            ]);
            setPinnedUser({ ...user, uid: `${uid}@screen`, [kind]: track });
          }
        }
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

  //function

  const handleScreenSharing = async () => {
    const options = {
      video: {
        cursor: "always",
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };

    if (!RtcClient) return;
    try {
      const screenTrack = await RtcClient.createScreenTrack(options);
      setTracks((prev) => {
        return {
          ...prev,
          screenVideoTrack: screenTrack[0],
          screenAudioTrack: screenTrack[1],
        };
      });

      await RtcClient.produceTracks(screenTrack, "screen");

      ToastHandler(
        "sus",
        "Your screen now visible to everyone else in the room"
      );

      return true;
    } catch (e) {
      throw new Error(e);
    }
  };

  const stopSharingScreen = async () => {
    if (!tracks.screenAudioTrack && !tracks.screenVideoTrack) {
      return;
    }

    tracks.screenAudioTrack?.closeTrack();
    tracks.screenVideoTrack?.closeTrack();

    const temp = [];

    if (tracks.screenAudioTrack) {
      temp.push(tracks.screenAudioTrack);
    }

    if (tracks.screenVideoTrack) {
      temp.push(tracks.screenVideoTrack);
    }

    try {
      await RtcClient.unprodueTracks(temp);
      setTracks((prev) => ({
        ...prev,
        screenAudioTrack: undefined,
        screenVideoTrack: undefined,
      }));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

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
          backgroundColor: "red",
        }}
        variant="contained"
      >
        Leave Room
      </IconButton>

      {pinnedUser.uid && (
        <Grid item xs={12}>
          <VideoPlayer
            videoTrack={pinnedUser.video}
            audioTrack={pinnedUser.audio}
            user={pinnedUser}
            pinnedUser={pinnedUser}
            setPinnedUser={setPinnedUser}
          />
        </Grid>
      )}

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
            pinnedUser={pinnedUser}
            setPinnedUser={setPinnedUser}
          />
          <SelfControl
            videoTrack={tracks.videoTrack}
            audioTrack={tracks.audioTrack}
            setTracks={setTracks}
            handleScreenSharing={handleScreenSharing}
            stopSharingScreen={stopSharingScreen}
            screenVideoTrack={tracks.screenVideoTrack}
            screenAudioTrack={tracks.screenAudioTrack}
          />
        </Grid>
      )}

      {users
        .filter((item) => item.uid !== pinnedUser.uid)
        .map((item) => {
          return (
            <Grid
              item
              xs={users.length >= 0 && users.length < 2 ? 6 : 3}
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
                pinnedUser={pinnedUser}
                setPinnedUser={setPinnedUser}
              />
            </Grid>
          );
        })}
    </Grid>
  );
}
