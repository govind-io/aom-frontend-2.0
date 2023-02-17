import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageWraper from "../../../components/Common/PageWraper";
import HomeHeader from "../../../components/Home/Header";
import { WAITING_TIME } from "../../../Utils/Contants/Conditional";
import text from "../../../Content/text.json";
import metaTags from "../../../Content/metaTags.json";
import MetaTagsGenerator from "../../../Utils/ComponentUtilities/MetaTagsGenerator";

export default function LeftLobby() {
  const roomData = useSelector((s) => s.room.data);
  const router = useRouter();

  const [timeRemaining, setTimeRemaining] = useState(WAITING_TIME);

  const { room } = router.query;

  const { isReady } = router;

  useEffect(() => {
    if (!isReady) return;

    if (roomData.meetingId !== room) {
      router.push("/home");
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev - 1 <= 0) {
          router.push("/home");
        }
        return prev - 1;
      });
    }, [1000]);

    return () => {
      clearInterval(interval);
    };
  }, [roomData]);

  return (
    <PageWraper HeaderContent={<HomeHeader />}>
      <MetaTagsGenerator metaTags={metaTags["/"]} />
      <Grid
        container
        sx={{
          height: "100%",
          padding: "50px 100px",
          position: "relative",
        }}
      >
        <Grid item xs={12}>
          <Grid container alignItems={"center"}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={100 - (timeRemaining / WAITING_TIME) * 100}
                size={50}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    font: "normal normal normal 20px/24px Work Sans",
                    color: "#F5F5F5",
                  }}
                >
                  {timeRemaining}
                </Typography>
              </Box>
            </Box>
            <Grid item>
              <Typography
                sx={{
                  font: "normal normal normal 20px/24px Work Sans",
                  color: "#F5F5F5",
                  marginLeft: "20px",
                }}
              >
                {text.room.redirection}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          justifyContent={"center"}
        >
          <Grid item xs={12}>
            <Typography
              textAlign={"center"}
              sx={{
                font: "normal normal 500 48px/57px Work Sans",
                color: "#F5F5F5",
              }}
            >
              {text.room.leftMeeting}
            </Typography>
          </Grid>
          <Grid sx={{ marginTop: "50px" }}>
            <IconButton
              sx={{
                border: "1px solid #797979",
                borderRadius: "8px",
                backgroundColor: "transparent",
                font: "normal normal normal 20px/24px Work Sans",
                color: "#F5F5F5",
                padding: "10px 15px",
              }}
              disableRipple={true}
              onClick={() => {
                router.push(
                  {
                    pathname: `/room/${room}`,
                    query: {
                      internalRedirect: true,
                    },
                  },
                  { pathname: `/room/${room}` }
                );
              }}
            >
              {text.room.rejoin}
            </IconButton>
            <IconButton
              sx={{
                marginLeft: "50px",
                border: "1px solid #797979",
                borderRadius: "8px",
                background: "#66B984 0% 0% no-repeat padding-box",
                font: "normal normal normal 20px/24px Work Sans",
                color: "#F5F5F5",
                padding: "10px 15px",
              }}
              disableRipple={true}
              onClick={() => {
                router.push(`/home`);
              }}
            >
              {text.room.redirectionButton}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </PageWraper>
  );
}
