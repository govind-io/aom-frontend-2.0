import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import metaTags from "../Content/metaTags.json";
import { Grid } from "@mui/material";
import PageWraper from "../components/Common/PageWraper";
import { useEffect, useState } from "react";
import HomeHeader from "../components/Home/Header";
import NewMeetingButton from "../components/Home/NewMeetingButton";
import JoinMeetingButton from "../components/Home/JoinMeeting/JoinMeetingButton";
import MetaTagsGenerator from "../Utils/ComponentUtilities/MetaTagsGenerator";
import ScheduleMeetingButton from "../components/Home/ScheduleMeeting/ScheduleMeetingButton";
import CalendarButton from "../components/Home/Calendar/CalendarButtom";
import WelcomeAnimation from "../components/Home/WelcomeAniamtion";
import CalendarParts from "../components/Home/Calendar/CalendarParts";
import ScheduleMeetingModal from "../components/Home/ScheduleMeeting/ScheduleMeetingModal";
import { HomeStyle } from "../styles/pages/home/home";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.token]);

  return (
    <PageWraper HeaderContent={<HomeHeader />}>
      <MetaTagsGenerator metaTags={metaTags["/"]} />
      <Grid
        container
        justifyContent={"space-around"}
        sx={HomeStyle.container}
        alignItems="center"
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={4}
          sx={HomeStyle.gridItem}
        >
          <Grid
            container
            sx={HomeStyle.meetingGridItem}
          >
            <NewMeetingButton />
            <JoinMeetingButton />
            <ScheduleMeetingButton setOpenModal={setScheduleModalOpen} />
            <CalendarButton setCalendar={setCalendar} calendar={calendar} />
          </Grid>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={4}
          sx={[HomeStyle.calenderGridItem, HomeStyle.gridItem]}
        >
          {calendar ? (
            <CalendarParts
              setScheduleModalOpen={setScheduleModalOpen}
              ScheduleModalOpen={ScheduleModalOpen}
            />
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
