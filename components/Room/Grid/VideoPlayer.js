import { Grid } from "@mui/material";
import { useCallback } from "react";

import ScrollZoom from "../../../Utils/ComponentUtilities/ScrollToZoom";

export default function MeetVideoPlayer({ videoTrack }) {
  const videoRef = useCallback(
    (node) => {
      if (!node || !videoTrack || !videoTrack?.enabled) return;

      try {
        node.srcObject = videoTrack;
        ScrollZoom(node, 2, 0.2);
        node.play();
      } catch (e) {
        console.log("something went wrong, warning: ", { e });
      }
    },
    [videoTrack, videoTrack?.enabled]
  );

  return (
    <Grid
      container
      sx={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <video
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        ref={videoRef}
        autoPlay={true}
        muted={true}
      />
    </Grid>
  );
}
