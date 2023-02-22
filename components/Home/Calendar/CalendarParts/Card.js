import { Grid, IconButton, Typography } from "@mui/material";
import convertDateToLocalTime, {
  convertDateToReadable,
} from "../../../../Utils/DesignUtilities/DateManipulation";
import text from "../../../../Content/text.json";
import CardThreeDotMenu from "./CardThreeDotMenu";
import { useRouter } from "next/router";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";

export default function Card({
  name,
  meetingId,
  start,
  passcode,
  pin,
  deleted,
  moderator,
  end,
}) {
  const router = useRouter();

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${moderator.name || "Khul ke guest"} ${text.home.scheduleForm.inviting}

${text.home.scheduleForm.title}: ${name}       
${text.home.scheduleForm.time}: ${convertDateToReadable(
        start
      )} to ${convertDateToReadable(end)}
      
${text.home.scheduleForm.link}: ${
        passcode
          ? `https://${window.location.host}/room/${meetingId}?passcode=${pin}`
          : `https://${window.location.host}/room/${meetingId}`
      }
${text.home.scheduleForm.meetingId}: ${meetingId.toUpperCase()}
${passcode ? `${text.home.scheduleForm.passcode}: ${pin}` : ""}`
    );

    ToastHandler("sus", "Meeting Link Copied Succefully");
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        borderRadius: "10px",
        background: "#66B984 0% 0% no-repeat padding-box",
        boxShadow: "0px 10px 10px #00000029",
        height: "fit-content",
        padding: "15px 10px 10px 10px",
        marginTop: "20px",
      }}
    >
      <Grid container alignItems={"center"}>
        <Grid item xs={5}>
          <Typography
            sx={{
              font: "normal normal 600 18px/21px Work Sans",
              color: "#FFFFFF",
            }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={{
              font: "normal normal 600 12px/21px Work Sans",
              color: "#FFFFFF",
            }}
          >
            {convertDateToLocalTime(start)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {!deleted ? (
            <IconButton
              sx={{
                font: "normal normal bold 12px/14px Work Sans",
                color: "#66B984",
                backgroundColor: "white",
                borderRadius: "11px",
                boxShadow: "0px 3px 6px #00000029",
                padding: "5px 10px",
              }}
              disableRipple={true}
              onClick={() => {
                router.push(
                  {
                    pathname: `/room/${meetingId}`,
                    query: {
                      internalRedirect: true,
                      passcode: pin || "",
                    },
                  },
                  { pathname: `/room/${meetingId}` }
                );
              }}
            >
              {text.home.joinForm.joinBtn}
            </IconButton>
          ) : (
            <IconButton
              sx={{
                font: "normal normal bold 12px/14px Work Sans",
                color: "#CC3425",
                backgroundColor: "#F5F5F5",
                borderRadius: "11px",
                boxShadow: "0px 3px 6px #00000029",
                padding: "5px 10px",
                cursor: "default",
              }}
              disableRipple={true}
            >
              {text.home.calendar.ended}
            </IconButton>
          )}
        </Grid>
        <Grid item xs={1} textAlign="right">
          <CardThreeDotMenu />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            borderTop: "0.5px solid white",
            borderBottom: "0.5px solid white",
            padding: "5px 0px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={copyLink}
        >
          <Typography
            sx={{
              font: "normal normal normal 10px/11px Work Sans",
              color: "#FFFFFF",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {`${
              typeof window !== "undefined"
                ? `https://${window.location.host}`
                : ""
            }/room/${meetingId}` + `${passcode ? `?passcode=${pin}` : ""}`}
          </Typography>
          <ContentCopyIcon
            sx={{
              marginLeft: "auto",
              color: "white",
              marginLeft: "10px",
            }}
            size="sm"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            marginTop: "20px",
          }}
        >
          <Grid>
            <Typography
              sx={{
                font: "normal normal 600 12px/14px Work Sans",
                color: "#FFFFFF",
              }}
            >
              {text.home.scheduleForm.meetingId}: {meetingId.toUpperCase()}
            </Typography>
          </Grid>
          {passcode && (
            <Grid>
              <Typography
                sx={{
                  font: "normal normal 600 12px/14px Work Sans",
                  color: "#FFFFFF",
                }}
              >
                {text.home.scheduleForm.passcode}: {pin}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
