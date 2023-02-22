import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import images from "../Content/images.json";
import metaTags from "../Content/metaTags.json";
import text from "../Content/text.json";
import { Grid, Typography } from "@mui/material";
import PageWraper from "../components/Common/PageWraper";
import { useEffect, useState } from "react";
import Image from "next/image";
import HomeHeader from "../components/Home/Header";
import NewMeetingButton from "../components/Home/NewMeetingButton";
import JoinMeetingButton from "../components/Home/JoinMeeting/JoinMeetingButton";
import MetaTagsGenerator from "../Utils/ComponentUtilities/MetaTagsGenerator";
import ScheduleMeetingButton from "../components/Home/ScheduleMeeting/ScheduleMeetingButton";
import CalendarButton from "../components/Home/Calendar/CalendarButtom";
import { ToggleCalendar } from "../Redux/Actions/Comps/CollapsibleComps";
import WelcomeAnimation from "../components/Home/WelcomeAniamtion";
import CalendarParts from "../components/Home/Calendar/CalendarParts";
import ScheduleMeetingModal from "../components/Home/ScheduleMeeting/ScheduleMeetingModal";

export default function Home() {
  //constants here
  const router = useRouter();

  const user = useSelector((s) => s.user.data);

  const [calendar, setCalendar] = useState(false);
  const [ScheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    if (!user.token) {
      router.push("/");
      return;
    }
  }, []);

  return (
    <PageWraper HeaderContent={<HomeHeader />}>
      <MetaTagsGenerator metaTags={metaTags["/"]} />
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
            <ScheduleMeetingButton setOpenModal={setScheduleModalOpen} />
            <CalendarButton setCalendar={setCalendar} calendar={calendar} />
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          height={"80%"}
          position="relative"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {calendar ? (
            <CalendarParts setScheduleModalOpen={setScheduleModalOpen} />
          ) : (
            <WelcomeAnimation />
          )}
        </Grid>
      </Grid>
      <ScheduleMeetingModal
        open={ScheduleModalOpen}
        setOpen={setScheduleModalOpen}
      />
    </PageWraper>
  );
}
