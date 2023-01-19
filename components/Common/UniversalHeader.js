import { Avatar, Grid } from "@mui/material";

export default function UniversalHeader({ children }) {
  return (
    <Grid
      container
      alignItems={"center"}
      sx={{
        borderBottom: "1px solid #FFFFFF",
        height: "10vh",
        padding:"10px 5% 10px 5%"
      }}
    >
      <Grid
        item
        sx={{
          height: "80%",
        }}
      >
        <Avatar
          src="/icons/khulke.svg"
          sx={{
            height: "100%",
            width: "fit-content",
          }}
        />
        {children}
      </Grid>
    </Grid>
  );
}
