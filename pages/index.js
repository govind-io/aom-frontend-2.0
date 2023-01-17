import ToastHandler from "../Utils/Toast/ToastHandler";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UniversalHeader from "../components/Common/UniversalHeader";
import { Grid, Typography } from "@mui/material";
import PageWraper from "../components/Common/PageWraper";

export default function Home() {
  //constants here
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <PageWraper>
      <Typography
        sx={{
          color: "white",
        }}
      >
        Hello
      </Typography>
    </PageWraper>
  );
}
