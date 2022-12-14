import { Grid, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RTCClient } from "../../../MEET_SDK/rtc";
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
  const [volumes, setVolumes] = useState({})




  //constants
  const router = useRouter();

  //creating RTC client here
  useEffect(() => {
    if (RtcClient || !socket) return;

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

    const device = new RTCClient();

    device.init().then(() => {
      setRtcClient(device);
      device.onUserJoined(userJoinedEvent);
      device.onUserLeft(userLeftEvent);
      device.onRemoteTrackStateChanged = ({ uid }) => {
        console.log("track state changed for ", uid)
        setUsers((prev) => [...prev])
      }
    });
  }, [socket]);

  //for creating tracks
  useEffect(() => {
    if (
      !RtcClient ||
      (userData.role !== "host" && !tracks.audioTrack && !tracks.videoTrack)
    )
      return;

    RtcClient.createTracks()
      .then((tracks) => {
        setTracks({ audioTrack: tracks[0], videoTrack: tracks[1] });
      })
      .catch((e) => {
        console.log(e.message);
      });

    RtcClient.enableAudioVolumeObserver().then((observer) => {
      observer.onVolume((volume) => setVolumes(volume))
    }).catch((e) => {
      console.log("error is ", e)
    })


  }, [RtcClient, userData]);

  console.log({ RtcClient, volumes })

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
        const { track, kind } = await RtcClient.subscribe(user);

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
              { ...user, uid: `${uid}@screen`, [kind]: track, role: "host" },
            ]);
            setPinnedUser({
              ...user,
              uid: `${uid}@screen`,
              [kind]: track,
              role: "host",
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    RtcClient.onUserPublished(userPublishedEvents);
    RtcClient.onUserUnpublished(userUnpublishedEvents);
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
    if (!RtcClient) return;
    try {
      const screenTrack = await RtcClient.createScreenTrack();

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

    tracks.screenAudioTrack?.stop();
    tracks.screenVideoTrack?.stop();

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
        overflowY: "auto",
        width: "100%",
        border: "2px solid violet",
        height:
          !pinnedUser.uid && users.length >= 2 && users.length < 4
            ? "50%"
            : "100%",
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
          bottom: "10px",
          borderRadius: "10px",
          backgroundColor: "red",
        }}
        variant="contained"
      >
        Leave Room
      </IconButton>

      {pinnedUser.uid && (
        <Grid
          item
          xs={12}
          style={{
            aspectRatio: "16/9",
            position: "relative",
            maxHeight: "100%",
          }}
        >
          <VideoPlayer
            videoTrack={pinnedUser.video}
            audioTrack={pinnedUser.audio}
            user={pinnedUser}
            pinnedUser={pinnedUser}
            setPinnedUser={setPinnedUser}
            volume={volumes[pinnedUser.uid]}
          />
        </Grid>
      )}

      {tracks.screenVideoTrack && (
        <Grid
          item
          xs={users.length >= 0 && users.length < 2 ? 6 : 3}
          style={{
            aspectRatio: "16/9",
            position: "relative",
          }}
        >
          <VideoPlayer
            videoTrack={tracks.screenVideoTrack}
            pinnedUser={pinnedUser}
            setPinnedUser={setPinnedUser}
            user={{ uid: userData.uid, role: userData.role }}
            selfScreen={true}
            stopSharingScreen={stopSharingScreen}
            volume={volumes[userData.uid]}
          />
        </Grid>
      )}

      {userData.role === "host" && (
        <Grid
          item
          xs={users.length >= 0 && users.length < 2 ? 6 : 3}
          style={{
            aspectRatio: "16/9",
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
            volume={volumes[userData.uid]}
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
                aspectRatio: "16/9",
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
                volume={volumes[item.uid]}
              />
            </Grid>
          );
        })}
    </Grid>
  );
}
