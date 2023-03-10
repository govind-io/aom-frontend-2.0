import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MeetAudioPlayer from "./AudioPlayer";
import MeetVideoPlayer from "./VideoPlayer";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeIndicator from "../../Common/VolumeIndicator";
import { useEffect, useRef } from "react";
import { useParticipant } from "@livekit/react-core";
import { SaveRoomMetaData } from "../../../Redux/Actions/Room/RoomDataAction";

export default function IndividualSpeaker({
  username,
  name,
  smallTile,
  participant,
  setPresenters,
  isPresenter,
}) {
  const {
    isLocal,
    isSpeaking,
    connectionQuality,
    cameraPublication: video,
    microphonePublication: audio,
    screenSharePublication: screen,
  } = useParticipant(participant);

  const containerRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    setPresenters((prev) => {
      const existingPresenter = prev.find(
        (item) => item.identity === participant.identity
      );

      if (existingPresenter && !screen) {
        const newPresenter = [
          ...prev.filter((item) => item.identity !== participant.identity),
        ];

        dispatch(
          SaveRoomMetaData({ existingPresenter: newPresenter.length > 0 })
        );

        return newPresenter;
      } else if (!existingPresenter && screen) {
        const newPresenter = [...prev, participant];

        dispatch(
          SaveRoomMetaData({ existingPresenter: newPresenter.length > 0 })
        );
        return newPresenter;
      } else return prev;
    });
  }, [screen]);

  return (
    <Grid
      container
      sx={{
        height: "100%",
        position: "relative",
        border: isSpeaking ? "2px solid #66B984" : "none",
        borderRadius: "12px",
        backgroundColor: "#3c4043",
      }}
      justifyContent={"center"}
      alignItems={"center"}
      ref={containerRef}
    >
      {video?.track && !video?.track.isMuted && !isPresenter && (
        <MeetVideoPlayer videoTrack={video?.track} />
      )}

      {screen?.track && !screen?.track.isMuted && isPresenter && (
        <MeetVideoPlayer videoTrack={screen?.track} />
      )}

      {(!video?.track || video?.track.isMuted) && !isPresenter && (
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

      {(!audio?.track || audio?.track.isMuted) && !isPresenter && (
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

      {audio?.track && !audio?.track.isMuted && !isPresenter && (
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "30px",
            height: "30px",
          }}
        >
          <VolumeIndicator volume={participant.audioLevel} />
        </Box>
      )}

      {!isLocal && !isPresenter && (
        <MeetAudioPlayer audioTrack={audio?.track} />
      )}

      <Typography
        sx={{
          background: isSpeaking
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
        {name} {isLocal && "(You)"}
      </Typography>

      {screen && isLocal && isPresenter && (
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
