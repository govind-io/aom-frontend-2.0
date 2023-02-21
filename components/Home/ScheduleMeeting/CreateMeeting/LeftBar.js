import CustomTimePicker from "../.././../../Utils/DesignUtilities/DateTimePicker/TimePicker";
import CustomDatePicker from "../.././../../Utils/DesignUtilities/DateTimePicker/DatePicker";
import {
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import text from "../../../../Content/text.json";

export default function CreateMeetingLeftBar({
  setPin,
  setPasscode,
  setRoomName,
  roomname,
  pin,
  passcode,
  setendDate,
  setendTime,
  endTime,
  endDate,
  setStartTime,
  startDate,
  startTime,
  setStartDate,
}) {
  return (
    <Grid
      container
      sx={{
        width: "100%",
      }}
    >
      <Grid item xs={12}>
        <Typography
          sx={{
            font: "normal normal 600 18px/21px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {text.home.scheduleForm.roomname}
        </Typography>
        <TextField
          fullWidth
          value={roomname}
          onChange={(e) => setRoomName(e.target.value)}
          name={"roomname"}
          placeholder={text.home.scheduleForm.roomNamePlaceholder}
          required={true}
          inputProps={{
            style: {
              font: "normal normal normal 16px/19px Work Sans",
              color: "#CECECE",
              padding: "5px 10px",
            },
          }}
          type={"text"}
          sx={{
            border: "1px solid #797979",
            borderRadius: "8px",
            marginTop: "10px",
          }}
          variant="outlined"
        />
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
            font: "normal normal 600 18px/21px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {text.home.scheduleForm.dateAndTime}
        </Typography>
        <Grid container alignItems={"center"}>
          <Grid
            item
            sx={{
              width: "23%",
              padding: "5px 10px",
            }}
          >
            <CustomDatePicker value={startDate} setValue={setStartDate} />
          </Grid>
          <Grid
            item
            sx={{
              width: "23%",
              padding: "5px 10px",
            }}
          >
            <CustomTimePicker value={startTime} setValue={setStartTime} />
          </Grid>
          <Grid
            item
            sx={{
              width: "8%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                font: "normal normal 600 18px/21px Work Sans",
                color: "#F5F5F5",
                textAlign: "center",
                width: "100%",
              }}
            >
              To
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              width: "23%",
              padding: "5px 10px",
            }}
          >
            <CustomTimePicker value={endTime} setValue={setendTime} />
          </Grid>
          <Grid
            item
            sx={{
              width: "23%",
              padding: "5px 10px",
            }}
          >
            <CustomDatePicker value={endDate} setValue={setendDate} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={"30px"}>
        <Divider
          sx={{
            backgroundColor: "#C4C4C466",
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          marginTop: "30px",
        }}
      >
        <Typography
          sx={{
            font: "normal normal 600 18px/21px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {text.home.scheduleForm.security}
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Grid container alignItems={"center"}>
          <Grid item>
            <Checkbox
              size="small"
              sx={{
                color: "#474749",
                "&.Mui-checked": {
                  color: "#66B984",
                },
                padding: 0,
              }}
              checked={passcode}
              onChange={() => {
                setPasscode((prev) => !prev);
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              sx={{
                marginLeft: "10px",
                color: "#CECECE",
                font: "normal normal normal 14px/16px Work Sans",
              }}
            >
              {text.home.scheduleForm.passcode}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              name={"pin"}
              value={pin}
              onChange={(e) => setPin(e.target.value.toUpperCase())}
              placeholder={text.home.scheduleForm.passcode}
              required={passcode}
              inputProps={{
                style: {
                  font: "normal normal normal 16px/19px Work Sans",
                  color: "#CECECE",
                  padding: "5px 10px",
                },
              }}
              type={"text"}
              sx={{
                border: "1px solid #797979",
                borderRadius: "8px",
                marginLeft: "20px",
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Tooltip
              arrow
              componentsProps={{
                tooltip: {
                  sx: { backgroundColor: "transparent" },
                },
              }}
              title={
                <>
                  <Typography
                    sx={{
                      background: "#2B2D2E 0% 0% no-repeat padding-box",
                      boxShadow: "10px 10px 20px #0000007E",
                      border: "1px solid #79797982",
                      font: "normal normal normal 12px/18px Work Sans",
                      color: "#CECECE",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    {text.home.scheduleForm.passcodeInfo}
                  </Typography>
                </>
              }
              placement={"top"}
            >
              <IconButton
                sx={{
                  border: "2px solid #CECECE",
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  width: "20px",
                  height: "20px",
                  color: "#CECECE",
                  textAlign: "center",
                  ml: "20px",
                  fontSize: "12px",
                }}
              >
                i
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
