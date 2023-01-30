import { Grid } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import ScrollZoom from "../../../Utils/ComponentUtilities/ScrollToZoom";

export default function MeetVideoPlayer({ audioTrack, videoTrack, username }) {
  const userData = useSelector((s) => s.user.data);

  const videoRef = useCallback(
    (node) => {
      if (!node || !videoTrack) return;
      node.srcObject = videoTrack;
      ScrollZoom(node, 2, 0.2);
    },
    [videoTrack]
  );

  const audioRef = useCallback(
    (node) => {
      if (!node || !audioTrack || userData.username === username) return;
      node.srcObject = audioTrack;
    },
    [audioTrack]
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
      />
      <audio ref={audioRef} />
    </Grid>
  );
}
