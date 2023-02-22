import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import text from "../../../Content/text.json";
import { useImperativeHandle, useState } from "react";
import { useDispatch } from "react-redux";

import {
  combineDateTime,
  TimeNMinsInFuture,
} from "../../../Utils/DesignUtilities/DateManipulation";
import { forwardRef } from "react";
import RandomPinGenerator from "../../../Utils/ComponentUtilities/RandomPinGenerator";
import { CreateRoom } from "../../../Redux/Actions/Room/RoomDataAction";
import CreateMeetingLeftBar from "./CreateMeeting/LeftBar";
import CreateMeetingRightBar from "./CreateMeeting/RightBar";

export default forwardRef(function CreateMeeting(
  { handleCloseModal, setPage },
  ref
) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState();

  //form data related states here
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());

  const [startTime, setStartTime] = useState(TimeNMinsInFuture(30));
  const [endTime, setendTime] = useState(TimeNMinsInFuture(60));

  const [roomname, setRoomName] = useState("");
  const [passcode, setPasscode] = useState(false);
  const [pin, setPin] = useState(RandomPinGenerator());

  //Form Handling Function
  const resetFormValues = () => {
    setStartDate(new Date());
    setStartTime(TimeNMinsInFuture(30));
    setendDate(new Date());
    setendTime(TimeNMinsInFuture(60));
    setRoomName("");
    setPasscode(false);
    setPin(RandomPinGenerator());
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
          resetFormValues();
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
        maxWidth: "900px",
      }}
    >
      <Grid item xs={12}>
        <Typography
          sx={{
            font: "normal normal 600 24px/28px Work Sans",
            color: "#F5F5F5",
            marginBottom: "50px",
          }}
        >
          {text.home.scheduleForm.schedule}
        </Typography>
      </Grid>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CreateMeetingLeftBar
              setPasscode={setPasscode}
              setPin={setPin}
              setRoomName={setRoomName}
              setStartDate={setStartDate}
              setendDate={setendDate}
              setendTime={setendTime}
              endTime={endTime}
              endDate={endDate}
              setStartTime={setStartTime}
              startDate={startDate}
              startTime={startTime}
              roomname={roomname}
              pin={pin}
              passcode={passcode}
            />
          </Grid>
          {/* <Grid item xs={5}>
            <CreateMeetingRightBar />
          </Grid> */}
          <Grid
            item
            xs={12}
            sx={{
              marginTop: "50px",
              // textAlign: "center",
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
