import { Typography } from "@mui/material";
import text from "../../Content/text.json";
import images from "../../Content/images.json";

export default function WelcomeAnimation() {
  return (
    <>
      <img
        src={images.login.joinAnimation}
        style={{
          maxWidth: "100%",
        }}
      />
      <Typography
        sx={{
          font: "normal normal 500 32px/38px sans-serif",
          color: "white",
          zIndex: "2",
          position: "absolute",
          bottom: "0",
          textAlign: "center",
          width: "100%",
        }}
      >
        {text.login.welcome}
      </Typography>
    </>
  );
}
