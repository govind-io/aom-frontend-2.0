import { Grid, IconButton, Typography } from "@mui/material";
import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
import { useDispatch, useSelector } from "react-redux";
import { ToggleCalendar } from "../../../Redux/Actions/Comps/CollapsibleComps";
export default function CalendarButton({ setCalendar, calendar }) {
  const dispatch = useDispatch();

  return (
    <Grid
      item
      xs={6}
      textAlign="center"
      sx={{
        marginTop: "50px",
        opacity: calendar ? 0.2 : 1,
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "#F5F5F5",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "40px",
          "&:disabled": {
            bgcolor: "#F5F5F5",
          },
        }}
        disableRipple={true}
        disabled={calendar}
        onClick={() => {
          setCalendar(true);
        }}
      >
        <img src={images.login.calendar} />
      </IconButton>
      <Typography
        textAlign={"center"}
        sx={{
          color: "#CECECE",
          font: "24px",
          paddingTop: "10px",
        }}
      >
        {text.home.calendar.calendar}
      </Typography>
    </Grid>
  );
}
