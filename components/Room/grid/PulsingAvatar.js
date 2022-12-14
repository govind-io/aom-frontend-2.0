import { Avatar, Grid } from "@mui/material";
import { stringAvatar } from "../../../Utils/DesignUtilities/AvatarUtils";

export default function PulsingAvatar({ uid, volume }) {
  return (
    <>
      <Grid
        sx={{
          width: "100%",
          height: "100%",
          animation: volume ? `pulse 1.5s ease-in-out infinite` : "",
          animationDelay: `0.5s`
        }}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Avatar {...stringAvatar(uid)} />
      </Grid>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(${((volume / 10))});
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
}
