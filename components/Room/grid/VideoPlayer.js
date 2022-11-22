import { Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";

export default function VideoPlayer({ audioTrack, videoTrack, user, self }) {
  const videoRef = useCallback(
    (node) => {
      if (!node || !videoTrack) return;
      node.srcObject = videoTrack;
    },
    [videoTrack]
  );

  const audioRef = useCallback((node) => {
    if (!node || !audioTrack || self) return
    node.srcObject = audioTrack
  }, [audioTrack])

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid black",
        position: "relative",
      }}
    >
      <video
        style={{
          width: "100%",
          height: "100%",
        }}
        ref={videoRef}
        autoPlay={true}
      />
      <audio
        style={{
          display: "none",
        }}
        autoPlay={true}
        ref={audioRef}
      />

      <Grid>
        <Typography
          style={{
            top: "5px",
            left: "5px",
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "0px 5px",
            color: "white",
            zIndex: "2",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {self ? "You" : `${user.uid}`}
          </span>{" "}
          [{user.role}]{" "}
        </Typography>
      </Grid>
    </Grid>
  );
}
