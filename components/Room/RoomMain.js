import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TogglChatList,
  ToggleParticpantsList,
} from "../../Redux/Actions/Comps/CollapsibleComps";
import PageWraper from "../Common/PageWraper";
import FooterMain from "./Footer/FooterMain";
import GridMain from "./Grid/GridMain";
import RoomHeader from "./RoomHeader";
import Chat from "./Sidebars/Chat/Chat";
import Participants from "./Sidebars/Participants/ParticipantsList";

export default function RoomMain({ video, audio, profilename }) {
  const { chat, participants } = useSelector((s) => s.comps.comp);

  const dispatch = useDispatch();

  useEffect(() => {
    if (chat) {
      dispatch(TogglChatList());
    }

    if (participants) {
      dispatch(ToggleParticpantsList());
    }
  }, []);

  return (
    <>
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
          <GridMain profilename={profilename} audio={audio} video={video} />
        </Grid>
      </PageWraper>
    </>
  );
}
