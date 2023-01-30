import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import images from "../Content/images.json";
import text from "../Content/text.json";
import { Grid, IconButton, Typography } from "@mui/material";
import PageWraper from "../components/Common/PageWraper";
import { useEffect } from "react";
import Image from "next/image";
import HomeHeader from "../components/Home/Header";
import NewMeetingButton from "../components/Home/NewMeetingButton";
import JoinMeetingButton from "../components/Home/JoinMeeting/JoinMeetingButton";

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
    <PageWraper HeaderContent={<HomeHeader />}>
      <Grid
        container
        justifyContent={"space-around"}
        sx={{ height: "100%" }}
        alignItems="center"
      >
        <Grid item xs={4}>
          <Grid container>
            <NewMeetingButton />
            <JoinMeetingButton />
          </Grid>
        </Grid>
        <Grid item xs={4} height={"80%"} position="relative">
          <Image src={images.login.joinAnimation} layout="fill" />
          <Typography
            sx={{
              font: "normal normal 500 32px/38px sans-serif",
              color: "white",
              zIndex: "2",
              position: "absolute",
              bottom: "0",
              textAlign: "center",
              width: "100%",
            }}
          >
            {text.login.welcome}
          </Typography>
        </Grid>
      </Grid>
    </PageWraper>
  );
}