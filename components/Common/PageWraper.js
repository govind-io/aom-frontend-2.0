import { Grid } from "@mui/material";
import UniversalHeader from "./UniversalHeader";

export default function PageWraper({
  children,
  HeaderContent,
  LeftSideBar,
  RightSideBar,
  Footer,
}) {
  const centerContentWidth =
    LeftSideBar && RightSideBar ? 6 : LeftSideBar || RightSideBar ? 9 : 12;

  return (
    <Grid
      container
      sx={{
        maxHeight: "100vh",
      }}
    >
      <Grid item xs={12}>
        <UniversalHeader children={HeaderContent} />
      </Grid>
      {LeftSideBar && (
        <Grid
          item
          xs={3}
          sx={{
            height: Footer ? "80vh" : "90vh",
          }}
        >
          {LeftSideBar}
        </Grid>
      )}

      <Grid
        item
        xs={centerContentWidth}
        style={{
          height: Footer ? "80vh" : "90vh",
        }}
      >
        {children}
      </Grid>
      {RightSideBar && (
        <Grid
          item
          xs={3}
          sx={{
            height: Footer ? "80vh" : "90vh",
          }}
        >
          {RightSideBar}
        </Grid>
      )}
      {Footer && (
        <Grid item xs={12}>
          {Footer}
        </Grid>
      )}
    </Grid>
  );
}
