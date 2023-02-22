import { Grid, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllRoom } from "../../../../Redux/Actions/Room/RoomDataAction";
import { MonthAndDateToISOStringForCurrentYear } from "../../../../Utils/DesignUtilities/DateManipulation";
import Card from "./Card";

export default function AllCards({ activeMonth, activeDate }) {
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
  }, [activeDate, activeMonth]);

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
      {loading
        ? Array.from({ length: 2 }, (_, i) => i).map(() => (
            <Skeleton
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
        : !loading && allCards.length > 0
        ? allCards.map((item) => {
            return (
              <Card
                key={item._id}
                activeMonth={activeMonth}
                activeDate={activeDate}
                {...item}
              />
            );
          })
        : "Nothing to show"}
    </Grid>
  );
}
