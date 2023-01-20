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

  const token = useRouter().query.token;

  useEffect(() => {
    if (!token && !user.token) {
      dispatch(
        LogInAnoynmous({
          onSuccess: (data) => {
            updateTokens({ refresh: data.token, access: data.token });
            router.push("/home");
          },
        })
      );
      return;
    }

    if (user.token && !token) {
      router.push("/home");
      return;
    }

    dispatch(DeleteAll());

    dispatch(
      GetUserData({
        onSuccess: () => {
          //get user profile data
          updateTokens({ refresh: token, access: token });
          router.push("/home");
        },
        onFailed: () => {
          ToastHandler("dan", "Something went wrong");
        },
        data: {
          token,
        },
      })
    );
  }, [token]);

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
