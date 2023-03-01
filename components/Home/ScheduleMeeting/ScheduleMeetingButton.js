import { Grid, IconButton, Typography } from "@mui/material";
import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
import { useState } from "react";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
export default function ScheduleMeetingButton({ setOpenModal }) {
  return (
    <Grid
      item
      sm={3}
      md={6}
      lg={6}
      textAlign="center"
      sx={{
        marginTop: "50px",
        "@media (max-width: 900px)": {
          marginTop: "0px",
        },
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "#F5F5F5",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "30px",
          "@media (max-width: 900px)": {
            padding: "10px",
          },
        }}
        disableRipple={true}
        onClick={() => setOpenModal(true)}
      >
        <img
          src={images.login.schedule}
          style={{
            maxWidth: "80%",
          }}
        />
      </IconButton>
      <Typography
        textAlign={"center"}
        sx={{
          color: "#CECECE",
          fontSize: "24px",
          paddingTop: "10px",
          "@media (max-width: 900px)": {
            fontSize: "12px",
          },
        }}
      >
        {text.login.scheduleMeeting}
      </Typography>
    </Grid>
  );
}
