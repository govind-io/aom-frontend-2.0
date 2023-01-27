import { CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageWraper from "../../../components/Common/PageWraper";
import HomeHeader from "../../../components/Home/Header";
import { WAITING_TIME } from "../../../Utils/Contants/Conditional";

export default function LeftLobby() {
  const roomData = useSelector((s) => s.room.data);
  const router = useRouter();

  const [timeRemaining, setTimeRemaining] = useState(WAITING_TIME);

  const { room } = router.query;

  const { isReady } = router;

  useEffect(() => {
    if (!isReady) return;

    if (roomData.meetingId !== room) {
      //router.push("/home");
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
      <Grid
        container
        sx={{
          height: "100%",
          padding: "50px 100px",
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
                Returning to Home Screen
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageWraper>
  );
}
