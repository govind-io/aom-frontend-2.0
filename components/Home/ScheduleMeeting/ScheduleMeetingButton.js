import { Grid, IconButton, Typography } from "@mui/material";
import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
import { useState } from "react";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
export default function ScheduleMeetingButton({ setOpenModal }) {
  return (
    <Grid
      item
      xs={6}
      textAlign="center"
      sx={{
        marginTop: "50px",
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "#F5F5F5",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "40px",
        }}
        disableRipple={true}
        onClick={() => setOpenModal(true)}
      >
        <img src={images.login.schedule} />
      </IconButton>
      <Typography
        textAlign={"center"}
        sx={{
          color: "#CECECE",
          font: "24px",
          paddingTop: "10px",
        }}
      >
        {text.login.scheduleMeeting}
      </Typography>
    </Grid>
  );
}
