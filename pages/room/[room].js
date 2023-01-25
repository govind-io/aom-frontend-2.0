import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ToastHandler from "../../Utils/Toast/ToastHandler";

export default function Room() {
  const user = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room);

  const router = useRouter();
  const { room } = router.query;
  const { isReady } = router;

  useEffect(() => {
    if (!isReady) return;

    if (!room) {
      ToastHandler("dan", "Please Join a Room");
      router.push("/home");
      return;
    }

    //other room joining functionality here
    ToastHandler("sus", "Joined Room " + room);
  }, [room, isReady]);

  return <Grid>{room}</Grid>;
}
