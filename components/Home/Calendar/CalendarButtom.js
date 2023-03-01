import { Grid, IconButton, Typography } from "@mui/material";
import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
export default function CalendarButton({ setCalendar, calendar }) {
  return (
    <Grid
      item
      sm={3}
      md={6}
      lg={6}
      textAlign="center"
      sx={{
        marginTop: "50px",
        opacity: calendar ? 0.2 : 1,
        "@media (max-width: 900px)": {
          marginTop: "0px",
        },
        maxWidth: "100%",
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "#F5F5F5",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "30px",
          "&:disabled": {
            bgcolor: "#F5F5F5",
          },
          "@media (max-width: 900px)": {
            padding: "10px",
          },
        }}
        disableRipple={true}
        disabled={calendar}
        onClick={() => {
          setCalendar(true);
        }}
      >
        <img
          src={images.login.calendar}
          style={{
            maxWidth: "80%",
          }}
        />
      </IconButton>
      <Typography
        textAlign={"center"}
        sx={{
          color: "#CECECE",
          fontSize: "24px",
          paddingTop: "10px",
          "@media (max-width: 900px)": {
            fontSize: "12px",
          },
        }}
      >
        {text.home.calendar.calendar}
      </Typography>
    </Grid>
  );
}
