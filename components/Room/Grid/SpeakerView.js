import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function SpeakerView({ users }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  return <Grid container> Speaker View</Grid>;
}
