import { Grid, IconButton } from "@mui/material";

export default function SelfControl({ disabled }) {
  return (
    <Grid
      container
      sx={{
        position: "absolute",
        bottom: "0px",
      }}
      justifyContent="center"
    >
      <Grid item>
        <IconButton
          disabled={disabled}
          variant="contained"
          sx={{
            backgroundColor: "blue",
            width: "fit-content",
            height: "fit-content",
            borderRadius: "0px",
          }}
        >
          vid
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          disabled={disabled}
          variant={"contained"}
          sx={{
            backgroundColor: "blue",
            ml: "10px",
            width: "fit-content",
            height: "fit-content",
            borderRadius: "0px",
          }}
        >
          audio
        </IconButton>
      </Grid>
    </Grid>
  );
}
