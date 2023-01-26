import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import ChatParticipantsButton from "./ChatParticipantsButton";
import Controls from "./Controls";
import CopyLink from "./CopyLink";

export default function FooterMain() {
  return (
    <Grid
      container
      sx={{
        height: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CopyLink />
      <Controls />
      <ChatParticipantsButton />
    </Grid>
  );
}
