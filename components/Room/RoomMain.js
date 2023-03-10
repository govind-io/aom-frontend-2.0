import { Fade, Grid, Paper } from "@mui/material";
import { Room } from "livekit-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TogglChatList,
  ToggleParticpantsList,
} from "../../Redux/Actions/Comps/CollapsibleComps";
import { SaveRoomControls } from "../../Redux/Actions/Room/RoomDataAction";
import MetaTagsGenerator from "../../Utils/ComponentUtilities/MetaTagsGenerator";
import metaTags from "../../Content/metaTags.json";
import images from "../../Content/images.json";
import { updateRoom } from "../../Utils/MeetingUtils/MeetingConstant";
import ToastHandler from "../../Utils/Toast/ToastHandler";
import PageWraper from "../Common/PageWraper";
import FooterMain from "./Footer/FooterMain";
import GridMain from "./Grid/GridMain";
import RoomHeader from "./RoomHeader";
import Chat from "./Sidebars/Chat/Chat";
import Participants from "./Sidebars/Participants/ParticipantsList";
import { useRouter } from "next/router";

export default function RoomMain({ video, audio, profilename }) {
  const { chat, participants } = useSelector((s) => s.comps.comp);
  const roomData = useSelector((s) => s.room.data);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

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
    }

    connectRoom();
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
        chat ? <Chat /> : participants ? <Participants /> : undefined
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
