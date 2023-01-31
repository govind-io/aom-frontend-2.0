import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import MeetAudioPlayer from "./AudioPlayer";
import MeetVideoPlayer from "./VideoPlayer";
import MicOffIcon from "@mui/icons-material/MicOff";

export default function IndividualSpeaker({
  username,
  volume,
  video,
  audio,
  name,
}) {
  const userData = useSelector((s) => s.user.data);

  return (
    <Grid
      container
      sx={{
        height: "100%",
        position: "relative",
        border: volume && volume > 2 ? "2px solid #66B984" : "none",
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

      {!audio && (
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            borderRadius: "50%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MicOffIcon
            sx={{
              color: "white",
            }}
          />
        </Box>
      )}

      {username !== userData.username && <MeetAudioPlayer audioTrack={audio} />}

      <Typography
        sx={{
          background:
            volume && volume > 2
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
        {name}
      </Typography>
    </Grid>
  );
}
