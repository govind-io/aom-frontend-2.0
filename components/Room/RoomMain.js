import { Fade, Grid, Paper } from "@mui/material";
import { Room, RoomEvent } from "livekit-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TogglChatList,
  ToggleParticpantsList,
} from "../../Redux/Actions/Comps/CollapsibleComps";
import {
  GetRoomMessage,
  SaveRoomControls,
} from "../../Redux/Actions/Room/RoomDataAction";
import MetaTagsGenerator from "../../Utils/ComponentUtilities/MetaTagsGenerator";
import metaTags from "../../Content/metaTags.json";
import images from "../../Content/images.json";
import { ROOM, updateRoom } from "../../Utils/MeetingUtils/MeetingConstant";
import ToastHandler from "../../Utils/Toast/ToastHandler";
import PageWraper from "../Common/PageWraper";
import FooterMain from "./Footer/FooterMain";
import GridMain from "./Grid/GridMain";
import RoomHeader from "./RoomHeader";
import Chat from "./Sidebars/Chat/Chat";
import Participants from "./Sidebars/Participants/ParticipantsList";
import { useRouter } from "next/router";
import { ChangeUnreadMessageCount } from "../../Redux/Actions/Comps/DataComps";
import { VIEWSTATUS } from "../../Utils/Contants/Conditional";
import { EVENTSTATUS } from "../../Utils/Contants/Constants";

export default function RoomMain({ video, audio, profilename }) {
  const { chat, participants } = useSelector((s) => s.comps.comp);
  const { chat: unreadMessageCount } = useSelector((s) => s.comps.dataComp);

  const roomData = useSelector((s) => s.room.data);

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const MessageHandler = (data, sender) => {
    const decoder = new TextDecoder();

    const messagePayload = JSON.parse(decoder.decode(data));

    if (messagePayload.type !== EVENTSTATUS.MESSAGE_EVENT) return;

    setMessages((prev) => [
      ...prev,
      {
        ...messagePayload,
        by: { username: sender.identity, name: sender.name },
      },
    ]);

    dispatch(ChangeUnreadMessageCount(unreadMessageCount + 1));
  };

  useEffect(() => {
    if (chat) {
      dispatch(TogglChatList());
    }

    if (participants) {
      dispatch(ToggleParticpantsList());
    }
  }, []);

  useEffect(() => {
    async function connectRoom() {
      const room = new Room({ adaptiveStream: true, dynacast: true });

      try {
        await room.connect(process.env.MEET_URL, roomData.token).finally(() => {
          updateRoom(room);
          setLoading(false);
        });
      } catch (e) {
        ToastHandler("dan", "Something went wrong");
        console.log({ e });
        router.push("/");
        return;
      }

      if (audio === "true") {
        await room.localParticipant.setMicrophoneEnabled(true);
        dispatch(SaveRoomControls({ audio: true }));
      }

      if (video === "true") {
        await room.localParticipant.setCameraEnabled(true);
        dispatch(SaveRoomControls({ video: true }));
      }

      //fetching initial messages
      const data = {
        data: {
          meetingId: room.name,
          limit: VIEWSTATUS.MESSAGE_LIMIT,
          skip: 0,
        },
        onFailed: () => {
          ToastHandler("warn", "Could not get previous message");
        },
        onSuccess: (data) => {
          setMessages(
            data.messages.sort((a, b) => {
              const nextMessageDate = new Date(b.created_at);
              const previousMessageDate = new Date(a.created_at);
              if (previousMessageDate < nextMessageDate) return -1;
              else return 1;
            })
          );

          //attaching the data received event
          room.on(RoomEvent.DataReceived, MessageHandler);
        },
      };

      dispatch(GetRoomMessage(data));
    }

    connectRoom();

    return () => {
      ROOM?.off(RoomEvent.DataReceived, MessageHandler);
    };
  }, []);

  if (loading)
    return (
      <PageWraper>
        <MetaTagsGenerator metaTags={metaTags["/"]} />
        <Grid
          container
          height={"100%"}
          justifyContent="center"
          alignItems={"center"}
        >
          <Grid item>
            <Fade in={true} appear={false}>
              <Paper elevation={4}>
                <Image
                  src={images.global.khulke}
                  width="150px"
                  height={"150px"}
                  className="zoom-in-out"
                />
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </PageWraper>
    );

  return (
    <PageWraper
      HeaderContent={<RoomHeader />}
      RightSideBar={
        chat ? (
          <Chat messages={messages} setMessages={setMessages} />
        ) : participants ? (
          <Participants />
        ) : undefined
      }
      Footer={
        <Grid
          container
          sx={{
            width: "95%",
            maxWidth: "1800px",
            margin: "auto",
          }}
        >
          <FooterMain />
        </Grid>
      }
    >
      <Grid
        container
        height="100%"
        sx={{
          width: "100%",
          margin: "auto",
        }}
        alignItems="center"
        justifyContent={"center"}
      >
        <GridMain profilename={profilename} />
      </Grid>
    </PageWraper>
  );
}
