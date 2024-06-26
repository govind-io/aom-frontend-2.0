import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import MeetAudioPlayer from "./AudioPlayer";
import MeetVideoPlayer from "./VideoPlayer";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeIndicator from "../../Common/VolumeIndicator";
import { useRef } from "react";

export default function IndividualSpeaker({
  username,
  volume,
  video,
  audio,
  name,
  selfScreen,
  smallTile,
}) {
  const userData = useSelector((s) => s.user.data);

  const containerRef = useRef();

  return (
    <Grid
      container
      sx={{
        height: "100%",
        position: "relative",
        border: volume ? "2px solid #66B984" : "none",
        borderRadius: "12px",
        backgroundColor: "#3c4043",
      }}
      justifyContent={"center"}
      alignItems={"center"}
      ref={containerRef}
    >
      {video && video?.enabled && <MeetVideoPlayer videoTrack={video} />}

      {(!video || !video.enabled) && (
        <Avatar
          src={`${process.env.KHULKE_USER_PROFILE_PIC_URL}/${username}/pp`}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            height: "100px",
            width: "100px",
          }}
        />
      )}

      {(!audio || !audio.enabled) && (
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

      {audio && audio.enabled && (
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "30px",
            height: "30px",
          }}
        >
          <VolumeIndicator volume={volume} />
        </Box>
      )}

      {username !== userData.username && <MeetAudioPlayer audioTrack={audio} />}

      <Typography
        sx={{
          background: volume
            ? "#66B984 0% 0% no-repeat padding-box"
            : "#000000e6 0% 0% no-repeat padding-box",
          borderRadius: "16px",
          font: "normal normal medium 10px/16px Work Sans",
          fontSize: smallTile ? "10px" : "14px",
          color: "#F5F5F5",
          position: "absolute",
          left: "10px",
          bottom: "10px",
          padding: "5px 10px",
        }}
      >
        {name} {username === userData.username && "(You)"}
      </Typography>

      {selfScreen && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0px",
            left: "0px",
            opacity: "0.7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            Your Screen is Now Visible to everyone
          </Typography>
        </Box>
      )}
    </Grid>
  );
}
