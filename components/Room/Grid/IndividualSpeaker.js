import { Avatar, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import MeetAudioPlayer from "./AudioPlayer";
import MeetVideoPlayer from "./VideoPlayer";

export default function IndividualSpeaker({ username, volume, video, audio }) {
  const userData = useSelector((s) => s.user.data);

  return (
    <Grid
      container
      sx={{
        height: "100%",
        position: "relative",
        border: volume ? "2px solid #66B984" : "none",
        borderRadius: "12px",
      }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {video && video?.enabled && <MeetVideoPlayer videoTrack={video} />}

      {!video && (
        <Avatar
          src={`${process.env.KHULKE_USER_PROFILE_PIC_URL}/${username}/pp`}
          sx={{ width: "100px", height: "100px" }}
        />
      )}

      {username !== userData.username && <MeetAudioPlayer audioTrack={audio} />}

      <Typography
        sx={{
          background: volume
            ? "#66B984 0% 0% no-repeat padding-box"
            : "#000000e6 0% 0% no-repeat padding-box",
          borderRadius: "16px",
          font: "normal normal medium 14px/16px Work Sans",
          color: "#F5F5F5",
          position: "absolute",
          left: "10px",
          bottom: "10px",
          padding: "10px 15px",
        }}
      >
        @{username}
      </Typography>
    </Grid>
  );
}
