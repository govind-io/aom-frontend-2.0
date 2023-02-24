import { Grid, IconButton } from "@mui/material";
import text from "../../../../Content/text.json";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AllCards from "./AllCards";

export default function CardRow({
  setScheduleModalOpen,
  activeDate,
  activeMonth,
  ScheduleModalOpen,
}) {
  return (
    <Grid
      sx={{
        height: "100%",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          marginBottom: "20px",
        }}
      >
        <IconButton
          sx={{
            width: "100%",
            background: "#66B984 0% 0% no-repeat padding-box",
            boxShadow: "0px 10px 10px #00000029",
            borderRadius: "10px",
            textAlign: "center",
            font: "normal normal 600 12px/14px Work Sans",
            color: "#FFFFFF",
          }}
          disableRipple={true}
          onClick={() => {
            setScheduleModalOpen(true);
          }}
        >
          {text.home.scheduleForm.schedule}{" "}
          <AddCircleIcon
            size="sm"
            sx={{
              marginLeft: "10px",
            }}
          />
        </IconButton>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "calc(100% - 60px)",
        }}
      >
        <AllCards
          activeDate={activeDate}
          activeMonth={activeMonth}
          ScheduleModalOpen={ScheduleModalOpen}
        />
      </Grid>
    </Grid>
  );
}
