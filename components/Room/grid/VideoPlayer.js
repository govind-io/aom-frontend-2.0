import { Grid } from "@mui/material";

export default function VideoPlayer() {
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
      />
    </Grid>
  );
}
