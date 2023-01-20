import { Avatar, Grid } from "@mui/material";
import images from "../../Content/images.json";
export default function UniversalHeader({ children }) {
  return (
    <Grid
      container
      alignItems={"center"}
      sx={{
        borderBottom: "1px solid #474749",
        height: "10vh",
        padding: "10px 5% 10px 5%",
      }}
    >
      <Grid
        item
        sx={{
          height: "80%",
        }}
        xs={2}
      >
        <Avatar
          src={images.global.khulke}
          sx={{
            height: "100%",
            width: "fit-content",
          }}
        />
      </Grid>
      <Grid item xs={10}>
        {children}
      </Grid>
    </Grid>
  );
}
