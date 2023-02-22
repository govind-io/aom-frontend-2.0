import { Grid, IconButton } from "@mui/material";
import { useState } from "react";
import { getNthMonthFromCurrentMonth } from "../../../../Utils/DesignUtilities/DateManipulation";
import CardRow from "./CardRow";
import DateRow from "./DateRow";
import MonthRow from "./MonthRow";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function CalendarParts({ setScheduleModalOpen }) {
  //all calendar related states are here

  const [activeMonth, setActiveMonth] = useState(
    getNthMonthFromCurrentMonth(0).number
  );

  const [activeDate, setActiveDate] = useState(new Date().getDate());

  const handleDateScroll = (direction) => {
    const container = document.getElementById("datesContainer");
    const individualDate = document.getElementById(`date-${activeDate}`);

    if (direction === "left") {
      container.scrollBy({
        top: 0,
        left: -individualDate.clientWidth,
        behavior: "smooth",
      });
    } else if (direction === "right") {
      container.scrollBy({
        top: 0,
        left: individualDate.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100%",
        alignContent: "flex-start",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          height: "50px",
          background: "#2E2E2E 0% 0% no-repeat padding-box",
          boxShadow: "inset 0px 3px 6px #00000029",
          borderRadius: "20px 20px 0px 0px",
          marginBottom: "10px",
          padding: "0px 25px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MonthRow
          activeMonth={activeMonth}
          setActiveMonth={setActiveMonth}
          setActiveDate={setActiveDate}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "100px",
          marginBottom: "10px",
          background: "#2E2E2E 0% 0% no-repeat padding-box",
          boxShadow: "inset 0px 3px 6px #00000029",
          padding: "0px 25px",
          display: "flex",
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
        }}
      >
        <DateRow
          activeMonth={activeMonth}
          activeDate={activeDate}
          setActiveDate={setActiveDate}
        />
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "0px",
          }}
          onClick={() => {
            handleDateScroll("left");
          }}
        >
          <NavigateBeforeIcon
            sx={{
              color: "white",
            }}
          />
        </IconButton>
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "0px",
          }}
          onClick={() => {
            handleDateScroll("right");
          }}
        >
          <NavigateNextIcon
            sx={{
              color: "white",
            }}
          />
        </IconButton>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "calc(100% - 200px)",
          background: "#2E2E2E 0% 0% no-repeat padding-box",
          boxShadow: "inset 0px 3px 6px #00000029",
          borderRadius: "0px 0px 20px 20px",
          padding: "25px",
        }}
      >
        <CardRow
          setScheduleModalOpen={setScheduleModalOpen}
          activeMonth={activeMonth}
          activeDate={activeDate}
        />
      </Grid>
    </Grid>
  );
}
