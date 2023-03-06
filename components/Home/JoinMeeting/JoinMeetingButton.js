import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
import { Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import JoinMeetingModal from "./JoinMeetingModal";

export default function JoinMeetingButton() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Grid item xs={6} sm={3} md={6} lg={6} textAlign="center">
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
        onClick={() => {
          setOpenModal((prev) => !prev);
        }}
      >
        <img
          src={images.login.join}
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
        {text.login.join}
      </Typography>
      <JoinMeetingModal open={openModal} setOpen={setOpenModal} />
    </Grid>
  );
}
