import text from "../../Content/text.json";
import images from "../../Content/images.json";
import { Grid, IconButton, Typography } from "@mui/material";

export default function JoinMeetingButton() {
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
    </Grid>
  );
}
