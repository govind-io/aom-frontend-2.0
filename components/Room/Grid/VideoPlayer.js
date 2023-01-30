import { Grid } from "@mui/material";
import { useCallback } from "react";

import ScrollZoom from "../../../Utils/ComponentUtilities/ScrollToZoom";

export default function MeetVideoPlayer({ videoTrack }) {
  const videoRef = useCallback(
    (node) => {
      console.log({ videoTrack });
      if (!node || !videoTrack) return;
      node.srcObject = videoTrack;
      ScrollZoom(node, 2, 0.2);
    },
    [videoTrack]
  );

  return (
    <Grid
      container
      sx={{
        height: "100%",
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
