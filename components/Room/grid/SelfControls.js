import { Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

export default function SelfControl({ videoTrack, audioTrack }) {
  const [audioState, setAudioState] = useState(false);
  const [videoState, setVideoState] = useState(false);

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
            backgroundColor: "blue",
            width: "fit-content",
            height: "fit-content",
            borderRadius: "0px",
          }}
          onClick={() => {
            setVideoState(!videoTrack.enabled);
            videoTrack.setEnabled(!videoTrack.enabled);
          }}
        >
          {videoState ? "vid" : "no vid"}
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          variant={"contained"}
          sx={{
            backgroundColor: "blue",
            ml: "10px",
            width: "fit-content",
            height: "fit-content",
            borderRadius: "0px",
          }}
          onClick={() => {
            setAudioState(!audioTrack.enabled);
            audioTrack.setEnabled(!audioTrack.enabled);
          }}
        >
          {audioState ? "aud" : "no aud"}
        </IconButton>
      </Grid>
    </Grid>
  );
}
