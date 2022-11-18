import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CreateRtcClient } from "../../../MEET_SDK/rtc";
import { socket } from "../../../Utils/Configs/Socket";
import SelfControl from "./SelfControls";
import VideoPlayer from "./VideoPlayer";
export default function MainGrid() {

  //store selector
  const userData = useSelector((state) => state.user.data);


  //localStates
  const [RtcClient, setRtcClient] = useState()


  //creating RTC client here
  useEffect(() => {
    if (RtcClient || !socket) return

    CreateRtcClient().then(device => {
      setRtcClient(device)
    }).catch(e => console.log(e.message))

  }, [])


  //for producing tracks

  useEffect(() => {
    if (!RtcClient || userData.role !== "host") return

    RtcClient.produceTracks({}).then((transport) => {
      console.log({ transport })
    }).catch((e) => {
      console.log({ e })
    })

  }, [RtcClient])

  console.log({ RtcClient })

  return (
    <Grid
      container
      sx={{
        maxHeight: "100%",
        overflowY: "auto",
      }}
      justifyContent="center"
    >
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={false} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          border: "1px solid yello",
          aspectRatio: "1",
          position: "relative",
        }}
      >
        <VideoPlayer />
        <SelfControl disabled={true} />
      </Grid>
    </Grid>
  );
}
