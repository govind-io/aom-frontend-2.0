import { VideoRenderer } from "@livekit/react-core";
import { Grid } from "@mui/material";
import { useCallback } from "react";

import ScrollZoom from "../../../Utils/ComponentUtilities/ScrollToZoom";

export default function MeetVideoPlayer({ videoTrack, sx = {}, ...rest }) {
  const videoRef = useCallback(
    (node) => {
      if (!node || !videoTrack) return;

      try {
        ScrollZoom(node, 2, 0.2);
      } catch (e) {
        console.log("something went wrong, warning: ", { e });
      }
    },
    [videoTrack]
  );

  return (
    <Grid
      container
      sx={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Grid item xs={12} sx={{ height: "100%" }} ref={videoRef}>
        {videoTrack && (
          <VideoRenderer
            width={"100%"}
            height={"100%"}
            objectFit={"contain"}
            track={videoTrack}
          />
        )}
      </Grid>
    </Grid>
  );
}
