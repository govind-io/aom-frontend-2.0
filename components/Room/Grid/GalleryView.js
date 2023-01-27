import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function GalleryView({ users }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  console.log({ audio, video, screen });

  return <Grid container> Gallery View</Grid>;
}
