import { Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllRoom } from "../../../../Redux/Actions/Room/RoomDataAction";
import { MonthAndDateToISOStringForCurrentYear } from "../../../../Utils/DesignUtilities/DateManipulation";
import Card from "./Card";
import images from "../../../../Content/images.json";
import text from "../../../../Content/text.json";

export default function AllCards({
  activeMonth,
  activeDate,
  ScheduleModalOpen,
}) {
  const dispatch = useDispatch();

  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeMonth || !activeDate) return;

    const startDate = MonthAndDateToISOStringForCurrentYear(
      activeMonth,
      activeDate
    );

    setLoading(true);

    const data = {
      data: {
        startDate,
      },
      onSuccess: (data) => {
        setAllCards(data);
        setLoading(false);
      },
      onFailed: () => {
        setLoading(false);
      },
    };

    dispatch(GetAllRoom(data));
  }, [activeDate, activeMonth, ScheduleModalOpen]);

  return (
    <Grid
      container
      sx={{
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        alignContent: "flex-start",
      }}
    >
      {loading ? (
        Array.from({ length: 3 }, (_, i) => i).map((item) => (
          <Skeleton
            key={item}
            variant="rectangular"
            width={"100%"}
            height="100px"
            animation="wave"
            sx={{
              borderRadius: "10px",
              marginTop: "20px",
            }}
          />
        ))
      ) : !loading && allCards.length > 0 ? (
        allCards.map((item) => {
          return (
            <Card
              key={item._id}
              activeMonth={activeMonth}
              activeDate={activeDate}
              {...item}
              setAllCards={setAllCards}
            />
          );
        })
      ) : (
        <Grid
          container
          sx={{
            height: "100%",
          }}
        >
          <img
            src={images.home.noMeetings}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              margin: "auto",
            }}
          />

          <Typography
            sx={{
              marginTop: "20px",
              textAlign: "center",
              font: "normal normal 600 24px/28px Work Sans",
              color: "#FFFFFF",
              width: "100%",
            }}
          >
            {text.home.calendar.noMeeeting}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
