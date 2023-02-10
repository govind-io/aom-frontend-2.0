import { Button, Grid, Typography } from "@mui/material";
import text from "../../../Content/text.json";
import images from "../../../Content/images.json";
import { useSelector } from "react-redux";
import Link from "next/link";
import { convertDateToReadable } from "../../../Utils/DesignUtilities/DateManipulation";
import ToastHandler from "../../../Utils/Toast/ToastHandler";

export default function SuccessPage({ setPage, handleCloseModal }) {
  const roomData = useSelector((s) => s.room.data);
  const user = useSelector((s) => s.user.data);

  const copyMeetLink = () => {
    navigator.clipboard.writeText(
      `${roomData.moderator.name || roomData.moderator.username} ${
        text.home.scheduleForm.inviting
      }: ${roomData.name}

${text.home.scheduleForm.joinMeeting}
       
${text.home.scheduleForm.time} :${convertDateToReadable(
        roomData.start
      )} to ${convertDateToReadable(roomData.end)}
${text.home.scheduleForm.link} :${
        roomData.passcode
          ? `https://${window.location.host}/room/${roomData.meetingId}?passcode=${roomData.pin}`
          : `https://${window.location.host}/room/${roomData.meetingId}`
      }
${text.home.scheduleForm.meetingId} :${roomData.meetingId.toUpperCase()}
${
  roomData.passcode
    ? `${text.home.scheduleForm.passcode} : ${roomData.pin}`
    : ""
}`
    );

    ToastHandler("sus", "Meeting Link Copied Succefully");
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
      <Grid item xs={12}>
        <Typography
          sx={{
            font: "normal normal 600 24px/28px Work Sans",
            color: "#F5F5F5",
            textAlign: "center",
          }}
        >
          {text.home.scheduleForm.success}
        </Typography>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <img
          src={images.home.success}
          style={{
            maxWidth: "40%",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{
            font: "normal normal medium 18px/24px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {text.home.scheduleForm.created}
        </Typography>
      </Grid>
      <Grid item xs={12} mt={"30px"}>
        <Typography
          variant="p"
          sx={{
            font: "normal normal medium 18px/24px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {user.name || user.username} {text.home.scheduleForm.inviting}:{" "}
          {roomData.name}.
        </Typography>
        <Typography
          sx={{
            font: "normal normal medium 18px/24px Work Sans",
            color: "#F5F5F5",
            marginTop: "20px",
          }}
        >
          {text.home.scheduleForm.joinMeeting}
        </Typography>
        <Typography
          sx={{
            font: "normal normal medium 18px/24px Work Sans",
            color: "#F5F5F5",
            marginTop: "10px",
          }}
        >
          {text.home.scheduleForm.time} :{" "}
          {convertDateToReadable(roomData.start)} to{" "}
          {convertDateToReadable(roomData.end)}
        </Typography>
        <Typography
          sx={{
            font: "normal normal medium 18px/24px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {text.home.scheduleForm.link} :{" "}
          <Link
            href={
              roomData.passcode
                ? `https://${window.location.host}/room/${roomData.meetingId}?passcode=${roomData.pin}`
                : `https://${window.location.host}/room/${roomData.meetingId}`
            }
            legacyBehavior={true}
            style={{
              color: "#0000EE !important",
            }}
          >
            {roomData.passcode
              ? `https://${window.location.host}/room/${roomData.meetingId}?passcode=${roomData.pin}`
              : `https://${window.location.host}/room/${roomData.meetingId}`}
          </Link>
        </Typography>
        <Typography
          sx={{
            font: "normal normal medium 18px/24px Work Sans",
            color: "#F5F5F5",
          }}
        >
          {text.home.scheduleForm.meetingId} :{" "}
          {roomData.meetingId.toUpperCase()}
        </Typography>
        {roomData.passcode && roomData.pin && (
          <Typography
            sx={{
              font: "normal normal medium 18px/24px Work Sans",
              color: "#F5F5F5",
            }}
          >
            {text.home.scheduleForm.passcode} : {roomData.pin}
          </Typography>
        )}
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
          {text.home.scheduleForm.close}
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
          disableRipple={true}
          onClick={copyMeetLink}
        >
          {text.home.scheduleForm.copy}
        </Button>
      </Grid>
    </Grid>
  );
}
