import { Grid } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";

export default function VideoPlayer({ audioTrack, videoTrack }) {
  const videoRef = useCallback(
    (node) => {
      if (!node || !videoTrack) return;
      node.srcObject = videoTrack;
    },
    [audioTrack, videoTrack]
  );

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid black",
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
    </Grid>
  );
}
