import { Grid, Fade, Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageWraper from "../components/Common/PageWraper";
import { DeleteAll } from "../Redux/Actions/DeleteAll";
import { GetUserData, LogInAnoynmous } from "../Redux/Actions/User/DataAction";
import { updateTokens } from "../Utils/Configs/ApiConfigs";
import ToastHandler from "../Utils/Toast/ToastHandler";
import images from "../Content/images.json";

export default function LandingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.data);

  const { token, from, name } = router.query;
  const { isReady } = router;

  useEffect(() => {
    if (!isReady) return;

    if (token) {
      dispatch(DeleteAll());
      updateTokens({ refresh: token, access: token });
    }

    if (!token && user.token) {
      router.push("/home");
      return;
    }

    if (!token && !user.token) {
      dispatch(
        LogInAnoynmous({
          onSuccess: (data) => {
            updateTokens({ refresh: data.token, access: data.token });
            dispatch(
              GetUserData({
                onSuccess: () => {
                  //get user profile data
                  if (from === "roompage" && room) {
                    router.push(`/room/${room}`);
                    return;
                  }

                  router.push("/home");
                },
                onFailed: () => {
                  ToastHandler("dan", "Something went wrong");
                },
                data: {
                  token: data.token,
                },
              })
            );
          },
        })
      );

      return;
    }

    dispatch(
      GetUserData({
        onSuccess: () => {
          //get user profile data
          updateTokens({ refresh: token, access: token });
          if (from === "roompage" && name) {
            router.push(`/room/${name}`);
            return;
          }
          router.push("/home");
        },
        onFailed: () => {
          ToastHandler("dan", "Something went wrong");
        },
        data: {
          token,
          loggedin: token ? true : false,
        },
      })
    );
  }, [token, isReady]);

  return (
    <PageWraper>
      <Grid
        container
        height={"100%"}
        justifyContent="center"
        alignItems={"center"}
      >
        <Grid item>
          <Fade in={true} appear={false}>
            <Paper elevation={4}>
              <Image
                src={images.global.khulke}
                width="150px"
                height={"150px"}
                className="zoom-in-out"
              />
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </PageWraper>
  );
}
