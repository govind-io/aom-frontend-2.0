import { Grid, IconButton } from "@mui/material";
import { useState } from "react";
import { getNthMonthFromCurrentMonth } from "../../../../Utils/DesignUtilities/DateManipulation";
import CardRow from "./CardRow";
import DateRow from "./DateRow";
import MonthRow from "./MonthRow";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { CalendarStyle } from "../../../../styles/component/Home/Calendar/CalendarParts";

export default function CalendarParts({
  setScheduleModalOpen,
  ScheduleModalOpen,
}) {
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
      sx={CalendarStyle.container}
    >
      <Grid
        item
        xs={12}
        sx={[CalendarStyle.rowStyle,CalendarStyle.monthRowStyle]}
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
        sx={[CalendarStyle.rowStyle,CalendarStyle.dateRowStyle]}
      >
        <DateRow
          activeMonth={activeMonth}
          activeDate={activeDate}
          setActiveDate={setActiveDate}
          ScheduleModalOpen={ScheduleModalOpen}
        />
        <IconButton
          sx={[CalendarStyle.iconStyle, CalendarStyle.leftIcon]}
          onClick={() => {
            handleDateScroll("left");
          }}
        >
          <NavigateBeforeIcon
            sx={CalendarStyle.navNextIconStyle}

          />
        </IconButton>
        <IconButton
          sx={[CalendarStyle.iconStyle, CalendarStyle.rightIcon]}
          onClick={() => {
            handleDateScroll("right");
          }}
        >
          <NavigateNextIcon
            sx={CalendarStyle.navNextIconStyle}
          />
        </IconButton>
      </Grid>
      <Grid
        item
        xs={12}
        sx={[CalendarStyle.rowStyle,CalendarStyle.cardRowStyle]}
      >
        <CardRow
          setScheduleModalOpen={setScheduleModalOpen}
          activeMonth={activeMonth}
          activeDate={activeDate}
          ScheduleModalOpen={ScheduleModalOpen}
        />
      </Grid>
    </Grid>
  );
}
