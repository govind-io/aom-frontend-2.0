import { Grid } from "@mui/material";

export default function VolumeIndicator({ volume }) {
  const lineHeight = volume ? `${(volume / 10) * 100}%` : "2px";

  console.log({ volume, lineHeight });

  return (
    <Grid
      container
      sx={{
        borderRadius: "50%",
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        padding: "5px",
      }}
      alignItems="center"
      justifyContent={"space-around"}
    >
      <Grid
        sx={{
          width: "5px",
          height: "60%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid
          sx={{
            backgroundColor: "#66B984",
            width: "100%",
            borderRadius: "5px",
            height: lineHeight,
          }}
        />
      </Grid>
      <Grid
        sx={{
          width: "5px",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid
          sx={{
            backgroundColor: "#66B984",
            width: "100%",
            borderRadius: "5px",
            height: lineHeight,
          }}
        />
      </Grid>
      <Grid
        sx={{
          width: "5px",
          height: "60%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid
          sx={{
            backgroundColor: "#66B984",
            width: "100%",
            borderRadius: "5px",
            height: lineHeight,
          }}
        />
      </Grid>
    </Grid>
  );
}
