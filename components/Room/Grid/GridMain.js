import { Grid, Typography } from "@mui/material";
import { meetClient, setMeetClient } from "../../../Utils/Configs/MeetClient";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { useEffect, useRef, useState } from "react";
import { RTCClient } from "../../../MEET_SDK/rtc";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteRoomData,
  SaveRoomControls,
  SaveRoomMetaData,
} from "../../../Redux/Actions/Room/RoomDataAction";
import {
  handleCreateAndPublishAudioTrack,
  handleCreateAndPublishVideoTrack,
  handleUnPublishTrack,
} from "../../../Utils/MeetingUtils/Tracks";
import { VIEWSTATUS } from "../../../Utils/Contants/Conditional";
import GalleryView from "./GalleryView";
import SpeakerView from "./SpeakerView";
import { useRouter } from "next/router";
import {
  ChangeParticipantCounts,
  ChangeUnreadMessageCount,
} from "../../../Redux/Actions/Comps/DataComps";
import { EVENTSTATUS } from "../../../Utils/Contants/Constants";

export default function GridMain({ profilename, audio, video }) {
  const userData = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);
  const roomLayout = useSelector((s) => s.room.layout);
  const { audio: audioTrack } = useSelector((s) => s.room.controls);

  const dispatch = useDispatch();
  const router = useRouter();

  //global states for all grid
  const [users, setUsers] = useState([]);
  const [presenters, setPresenters] = useState([]);

  //refs for event handling
  const audioRef = useRef();
  audioRef.current = audioTrack;

  const handleNotificationEvents = async ({ content }, client) => {
    switch (content) {
      case EVENTSTATUS.MUTE_ALL_EVENT:
        if (audioRef.current) {
          await handleUnPublishTrack(audioRef.current);
          dispatch(SaveRoomControls({ audio: false }));
          ToastHandler("warn", "You have been muted by owner");
        }

        break;
      case EVENTSTATUS.END_MEETING_EVENT:
        client.close();

        setMeetClient("");

        ToastHandler("info", "Meeting Ended by Moderator");

        dispatch(DeleteRoomData());

        return router.push(`/home`);

      default:
        break;
    }
  };

  const attachEventListener = (client) => {
    const userJoinedEvent = (user) => {
      if (user.role !== "host") return;
      setUsers((prev) => {
        return [...prev, user];
      });
    };

    const userLeftEvent = (user) => {
      if (user.role !== "host") return;
      setUsers((prev) => prev.filter((item) => item.uid !== user.uid));
      setPresenters((prev) => prev.filter((item) => item.uid !== user.uid));
    };

    const userUnpublishedEvents = (user) => {
      const { kind, trackId, uid } = user;

      setUsers((prev) => {
        return prev.map((item) => {
          if (item.uid === uid && item[kind]?.id === trackId) {
            item[kind] = undefined;
            return item;
          } else return item;
        });
      });

      setPresenters((prev) => {
        return prev
          .map((item) => {
            if (item.uid === uid && item[kind]?.id === trackId) {
              item[kind] = undefined;
              return item;
            } else return item;
          })
          .filter((item) => item.video || item.audio);
      });
    };

    //Event listeners
    const userPublishedEvents = async (user) => {
      try {
        const { track, kind } = await client.subscribe(user);

        const { type, uid } = user;

        if (type === "screen") {
          return setPresenters((prev) => {
            const existingPresenter = prev.find((item) => item.uid === uid);

            if (existingPresenter) {
              return prev.map((item) => {
                if (item.uid === uid) {
                  return { ...item, [kind]: track };
                } else return item;
              });
            }

            return [...prev, { uid, [kind]: track, role: "host" }];
          });
        }

        setUsers((prev) => {
          return prev.map((item) => {
            if (item.uid === uid) {
              return { ...item, [kind]: track };
            } else return item;
          });
        });
      } catch (e) {
        console.log(e);
      }
    };

    const handleRemoteTrackStateChanged = ({ uid }) => {
      setUsers((prev) => [...prev]);
    };

    client.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        router.push("/home");
        return ToastHandler("dan", "You joined using another device");
      }
    });

    client.on(EVENTSTATUS.MESSAGE_EVENT, () => dispatch(ChangeUnreadMessageCount(1)));
    client.on(EVENTSTATUS.NOTIFICATION_EVENT, ({ content }) => {
      handleNotificationEvents({ content }, client);
    });

    client.onUserJoined(userJoinedEvent);
    client.onUserLeft(userLeftEvent);
    client.onUserPublished(userPublishedEvents);
    client.onUserUnpublished(userUnpublishedEvents);
    client.onRemoteTrackStateChanged = handleRemoteTrackStateChanged;
  };

  useEffect(() => {
    const connectMeet = async () => {
      const client = new RTCClient();

      try {
        await client.connect({
          token: roomData.token,
          uid: `${userData.username}-${
            profilename || userData.name || userData.username
          }`,
          role: "host",
        });

        attachEventListener(client);

        await client.init();

        try {
          const observer = await client.enableAudioVolumeObserver();
          observer.onVolume((allVolumes) =>
            dispatch(SaveRoomMetaData({ volumes: allVolumes }))
          );
        } catch (e) {
          console.log("could not enable volume observer");
        }

        setMeetClient(client);

        if (video?.toLowerCase() === "true") {
          dispatch(
            SaveRoomControls({
              video: await handleCreateAndPublishVideoTrack(),
            })
          );
        }

        if (audio?.toLowerCase() === "true") {
          dispatch(
            SaveRoomControls({
              audio: await handleCreateAndPublishAudioTrack(),
            })
          );
        }

        ToastHandler("sus", "Connected to meeting succefully");
      } catch (e) {
        ToastHandler("dan", "Something went wrong");
        console.log("error occured ", e);
      }
    };

    if (roomData.token) {
      connectMeet();
    }

    return () => {
      if (meetClient) {
        meetClient.close();
        ToastHandler("warn", "Meeting Left Succefully");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  //updating presenter and volumes
  useEffect(() => {
    dispatch(SaveRoomMetaData({ existingPresenter: presenters.length > 0 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenters]);

  useEffect(() => {
    dispatch(ChangeParticipantCounts(users.length + 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <Grid
      container
      sx={{
        height: "90%",
        width: "95%",
      }}
      id="main-grid"
    >
      {roomLayout.view === VIEWSTATUS.GALLERY && presenters.length === 0 ? (
        <GalleryView
          users={users}
          selfUID={`${userData.username}-${
            profilename || userData.name || userData.username
          }`}
        />
      ) : roomLayout.view === VIEWSTATUS.SPEAKER || presenters.length > 0 ? (
        <SpeakerView
          users={users}
          selfUID={`${userData.username}-${
            profilename || userData.name || userData.username
          }`}
          presenters={presenters}
        />
      ) : (
        <Typography>Soemthing went wrong</Typography>
      )}
    </Grid>
  );
}
