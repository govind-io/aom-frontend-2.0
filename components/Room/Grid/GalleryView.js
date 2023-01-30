import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import MeetVideoPlayer from "./VideoPlayer";

export default function GalleryView({ users }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  console.log({ video, audio });

  return (
    <Grid
      container
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <MeetVideoPlayer
        audioTrack={audio}
        videoTrack={video}
        username={users[0]?.uid || users[0]?.name}
      />
    </Grid>
  );
}
