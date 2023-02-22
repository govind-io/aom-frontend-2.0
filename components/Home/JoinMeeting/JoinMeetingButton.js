import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
import { Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import JoinMeetingModal from "./JoinMeetingModal";

export default function JoinMeetingButton() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Grid item xs={6} textAlign="center">
      <IconButton
        sx={{
          backgroundColor: "#F5F5F5",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "40px",
        }}
        disableRipple={true}
        onClick={() => {
          setOpenModal((prev) => !prev);
        }}
      >
        <img src={images.login.join} />
      </IconButton>
      <Typography
        textAlign={"center"}
        sx={{
          color: "#CECECE",
          font: "24px",
          paddingTop: "10px",
        }}
      >
        {text.login.join}
      </Typography>
      <JoinMeetingModal open={openModal} setOpen={setOpenModal} />
    </Grid>
  );
}
