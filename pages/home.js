import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { Grid, IconButton, Typography } from "@mui/material";
import PageWraper from "../components/Common/PageWraper";
import { useEffect } from "react";

export default function Home() {
  //constants here
  const router = useRouter();
  const user = useSelector((s) => s.user.data);

  useEffect(() => {
    if (!user.token) {
      router.push("/");
    }
  }, []);

  return (
    <PageWraper>
      <Grid
        container
        justifyContent={"space-around"}
        sx={{ height: "100%" }}
        alignItems="center"
      >
        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={6} textAlign="center">
              <IconButton
                sx={{
                  backgroundColor: "#66B984",
                  borderRadius: "20%",
                  aspectRatio: "1",
                  padding: "40px",
                }}
                disableRipple={true}
              >
                <img src="/icons/VideoButton.svg" />
              </IconButton>
              <Typography
                textAlign={"center"}
                sx={{
                  color: "#CECECE",
                  font: "24px",
                  paddingTop: "10px",
                }}
              >
                New Meeting
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <IconButton
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "20%",
                  aspectRatio: "1",
                  padding: "40px",
                }}
                disableRipple={true}
              >
                <img src="/icons/JoinMeeting.svg" />
              </IconButton>
              <Typography
                textAlign={"center"}
                sx={{
                  color: "#CECECE",
                  font: "24px",
                  paddingTop: "10px",
                }}
              >
                Join
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container></Grid>
        </Grid>
      </Grid>
    </PageWraper>
  );
}
