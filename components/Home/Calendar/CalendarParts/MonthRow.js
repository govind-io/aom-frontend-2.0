import { Grid, IconButton } from "@mui/material";
import { useMemo } from "react";
import { getNthMonthFromCurrentMonth } from "../../../../Utils/DesignUtilities/DateManipulation";

export default function MonthRow({
  activeMonth,
  setActiveMonth,
  setActiveDate,
}) {
  const MonthsArray = useMemo(() => {
    const temp = [];
    for (let i = -1; i <= 2; i++) {
      temp.push(getNthMonthFromCurrentMonth(i));
    }

    return temp;
  }, []);

  return (
    <Grid container justifyContent={"space-between"} spacing={2}>
      {MonthsArray.map((item) => {
        return (
          <Grid item xs={3} key={item.number}>
            <IconButton
              disableRipple={true}
              sx={{
                font: "normal normal normal 14px/16px Work Sans",
                color: activeMonth === item.number ? "#66B984" : "#FFFFFF",
                width: "100%",
                textAlign: "center",
              }}
              onClick={() => {
                setActiveMonth(item.number);

                if (item.number === new Date().getMonth() + 1) {
                  return setActiveDate(new Date().getDate());
                }

                return setActiveDate(1);
              }}
            >
              {item.name}
            </IconButton>
          </Grid>
        );
      })}
    </Grid>
  );
}
