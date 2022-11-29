import { Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
export default function SelfControl({
  videoTrack,
  audioTrack,
  setTracks,
  handleScreenSharing,
  stopSharingScreen,
}) {
  const [audioState, setAudioState] = useState(false);
  const [videoState, setVideoState] = useState(false);
  const [screenState, setSreenState] = useState(false);

  useEffect(() => {
    if (!audioTrack && !videoTrack) return;

    setAudioState(audioTrack.enabled);
    setVideoState(videoTrack.enabled);
  }, [videoTrack, audioTrack]);

  return (
    <Grid
      container
      sx={{
        position: "absolute",
        bottom: "0px",
      }}
      justifyContent="center"
    >
      <Grid item>
        <IconButton
          variant="contained"
          sx={{
            backgroundColor: "black",
            width: "fit-content",
            height: "fit-content",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
          onClick={() => {
            setVideoState(!videoTrack.enabled);
            videoTrack.setEnabled(!videoTrack.enabled);
            setTracks((prev) => ({ ...prev, videoTrack }));
          }}
        >
          {videoState ? (
            <VideocamIcon
              sx={{
                color: "white",
              }}
            />
          ) : (
            <VideocamOffIcon
              sx={{
                color: "white",
              }}
            />
          )}
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          variant={"contained"}
          sx={{
            backgroundColor: "black",
            ml: "10px",
            width: "fit-content",
            height: "fit-content",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
          onClick={() => {
            setAudioState(!audioTrack.enabled);
            audioTrack.setEnabled(!audioTrack.enabled);
            setTracks((prev) => ({ ...prev, audioTrack }));
          }}
        >
          {audioState ? (
            <MicIcon
              sx={{
                color: "white",
              }}
            />
          ) : (
            <MicOffIcon
              sx={{
                color: "white",
              }}
            />
          )}
        </IconButton>
      </Grid>
      <Grid item>
        {screenState ? (
          <IconButton
            variant={"contained"}
            sx={{
              backgroundColor: "black",
              ml: "10px",
              width: "fit-content",
              height: "fit-content",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
            onClick={stopSharingScreen}
          >
            <CancelPresentationIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        ) : (
          <IconButton
            variant={"contained"}
            sx={{
              backgroundColor: "black",
              ml: "10px",
              width: "fit-content",
              height: "fit-content",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
            onClick={async () => {
              try {
                await handleScreenSharing();
                setSreenState(true);
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <PresentToAllIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}
