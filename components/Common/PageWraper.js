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
    LeftSideBar && RightSideBar ? 8 : LeftSideBar || RightSideBar ? 10 : 12;

  return (
    <Grid container>
      <Grid item xs={12}>
        <UniversalHeader children={HeaderContent} />
      </Grid>
      {LeftSideBar && (
        <Grid item xs={2}>
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
        <Grid item xs={2}>
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
