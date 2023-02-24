import { Badge, Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { GetRoomCountForMonth } from "../../../../Redux/Actions/Room/RoomDataAction";
import { getDaysAndDateForNthMonthOfCurrentYear } from "../../../../Utils/DesignUtilities/DateManipulation";

export default function DateRow({ activeMonth, setActiveDate, activeDate }) {
  const DatesArray = useMemo(() => {
    return getDaysAndDateForNthMonthOfCurrentYear(activeMonth);
  }, [activeMonth]);

  const dispatch = useDispatch();

  const [count, setCount] = useState({});

  useEffect(() => {
    const element = document.getElementById(`date-${activeDate}`);

    element.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });

    setCount({});

    const data = {
      data: {
        month: activeMonth,
      },
      onSuccess: (data) => {
        setCount(data);
      },
      onFailed: () => {
        console.log("fetching meeting count for the month failed");
      },
    };

    dispatch(GetRoomCountForMonth(data));
  }, [activeMonth]);

  return (
    <Grid
      container
      spacing={2}
      flexWrap="nowrap"
      sx={{
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        maxWidth: "100%",
      }}
      id="datesContainer"
    >
      {DatesArray.map((item) => {
        return (
          <Grid item id={`date-${item.dateString}`} key={item.dateString}>
            <IconButton
              disableRipple={true}
              onClick={() => {
                setActiveDate(item.dateString);
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      height: "50px",
                      backgroundColor:
                        activeDate === item.dateString ? "#66B984" : "none",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      aspectRatio: "1",
                      font: "normal normal normal 15px/18px Work Sans",
                      color: "#FFFFFF",
                    }}
                  >
                    <Badge
                      badgeContent={count[item.dateString]}
                      max={10}
                      color="error"
                      overlap="rectangular"
                      componentsProps={{
                        badge: {
                          style: {
                            aspectRatio: 1,
                            width: "auto",
                            minWidth: "0px",
                            fontSize: "10px",
                            padding: "5px",
                            top: "-5px",
                          },
                        },
                      }}
                    >
                      {item.dateString}{" "}
                    </Badge>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      font: "normal normal normal 15px/18px Work Sans",
                      color:
                        activeDate === item.dateString ? "#66B984" : "#FFFFFF",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {item.dayName}
                  </Typography>
                </Grid>
              </Grid>
            </IconButton>
          </Grid>
        );
      })}
    </Grid>
  );
}
