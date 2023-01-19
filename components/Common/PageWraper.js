import { Grid } from "@mui/material";
import UniversalHeader from "./UniversalHeader";

export default function PageWraper({
  children,
  HeaderContent,
  LeftSideBar,
  RightSideBar,
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
          height: "90vh",
        }}
      >
        {children}
      </Grid>
      {RightSideBar && (
        <Grid item xs={2}>
          {RightSideBar}
        </Grid>
      )}
    </Grid>
  );
}
