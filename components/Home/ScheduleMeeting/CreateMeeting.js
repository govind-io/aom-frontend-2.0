import ToastHandler from "../../../Utils/Toast/ToastHandler";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import text from "../../../Content/text.json";
import { useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePickerUtil from "../../../Utils/DesignUtilities/DateTimePicker/DatePicker";
import TimePicker from "../../../Utils/DesignUtilities/DateTimePicker/TimePicker";
import {
  combineDateTime,
  TimeNMinsInFuture,
} from "../../../Utils/DesignUtilities/DateManipulation";
import { forwardRef } from "react";
import RandomPinGenerator from "../../../Utils/ComponentUtilities/RandomPinGenerator";
import { CreateRoom } from "../../../Redux/Actions/Room/RoomDataAction";

export default forwardRef(function CreateMeeting(
  { handleCloseModal, setPage },
  ref
) {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.user.data);

  const [loading, setLoading] = useState();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());

  const [startTime, setStartTime] = useState(TimeNMinsInFuture(30));
  const [endTime, setendTime] = useState(TimeNMinsInFuture(60));

  const [roomname, setRoomName] = useState("");
  const [passcode, setPasscode] = useState(false);
  const [pin, setPin] = useState(RandomPinGenerator());

  const resetFormValues = () => {
    setStartDate(new Date());
    setStartTime(TimeNMinsInFuture(30));
    setendDate(new Date());
    setendTime(TimeNMinsInFuture(60));
    setRoomName("");
  };

  useImperativeHandle(ref, () => ({ resetFormValues }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const timeEnd = new Date(endTime);
    const dateEnd = new Date(endDate);

    const dateStart = new Date(startDate);
    const timeStart = new Date(startTime);

    const start = combineDateTime({
      dateInput: dateStart,
      timeInput: timeStart,
    }).getTime();

    const end = combineDateTime({
      dateInput: dateEnd,
      timeInput: timeEnd,
    }).getTime();

    if (new Date().getTime() > start) {
      return ToastHandler(
        "dan",
        "Start time should be greater then current time"
      );
    }

    if (start > end) {
      ToastHandler("dan", "Start Time should be less than end time");
      return;
    }

    if (passcode && pin.length !== 6) {
      ToastHandler("dan", "Passcode should be 6 characters long");
      return;
    }

    setLoading(true);

    dispatch(
      CreateRoom({
        data: {
          personal: false,
          pin,
          passcode,
          start,
          end,
          name: roomname,
        },
        onFailed: () => {
          ToastHandler("dan", "Something went wrong");
          setLoading(false);
        },
        onSuccess: (data) => {
          setLoading(false);
          setPage(2);
        },
      })
    );
  };

  return (
    <Grid
      container
      sx={{
        position: "absolute",
        background: "#1B1A1D 0% 0% no-repeat padding-box",
        border: "1px solid #FFFFFF4D",
        borderRadius: "16px",
        padding: "32px",
        width: "80%",
        display: "flex",
        justifyContent: "center",
        maxWidth: "700px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography
              sx={{
                font: "normal normal 600 24px/28px Work Sans",
                color: "#F5F5F5",
              }}
            >
              {text.home.scheduleForm.schedule}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginTop: "50px",
            }}
          >
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
              required
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
                }}
              >
                <DatePickerUtil value={startDate} setValue={setStartDate} />
              </Grid>
              <Grid
                item
                sx={{
                  width: "23%",
                }}
              >
                <TimePicker value={startTime} setValue={setStartTime} />
              </Grid>
              <Grid
                item
                sx={{
                  width: "8%",
                }}
              >
                <Typography
                  sx={{
                    font: "normal normal 600 18px/21px Work Sans",
                    color: "#F5F5F5",
                  }}
                >
                  To
                </Typography>
              </Grid>
              <Grid
                item
                sx={{
                  width: "23%",
                }}
              >
                <TimePicker value={endTime} setValue={setendTime} />
              </Grid>
              <Grid
                item
                sx={{
                  width: "23%",
                }}
              >
                <DatePickerUtil value={endDate} setValue={setendDate} />
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
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginTop: "50px",
            }}
          >
            <Button
              variant={"contained"}
              sx={{
                font: "normal normal 600 14px/16px Work Sans",
                color: "#CECECE",
                bgcolor: "transparent",
                borderRadius: "8px",
                padding: "5px 10px",
                marginLeft: "10px",
                border: "1px solid #797979",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              disableFocusRipple={true}
              onClick={handleCloseModal}
            >
              {text.home.scheduleForm.cancel}
            </Button>
            <Button
              variant={"contained"}
              sx={{
                font: "normal normal 600 14px/16px Work Sans",
                color: "#F5F5F5",
                bgcolor: "#66B984",
                borderRadius: "8px",
                padding: "5px 10px",
                marginLeft: "20px",
                "&:hover": {
                  backgroundColor: "#66B984",
                },
              }}
              type="submit"
              disableRipple={true}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                text.home.scheduleForm.create
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
});
