import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import PageWraper from "../Common/PageWraper";
import FooterMain from "./Footer/FooterMain";
import GridMain from "./Grid/GridMain";
import RoomHeader from "./RoomHeader";
import Chat from "./Sidebars/Chat/Chat";
import Participants from "./Sidebars/ParticipantsList";

export default function RoomMain({ video, audio, profilename }) {
  const { chat, participants } = useSelector((s) => s.comps.comp);

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
              width: "100%",
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
