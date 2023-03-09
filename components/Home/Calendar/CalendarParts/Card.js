import { Grid, IconButton, Typography } from "@mui/material";
import convertDateToLocalTime, {
  convertDateToReadable,
} from "../../../../Utils/DesignUtilities/DateManipulation";
import text from "../../../../Content/text.json";
import CardThreeDotMenu from "./CardThreeDotMenu";
import { useRouter } from "next/router";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";
import { CardStyle } from "../../../../styles/component/Home/Calendar/CalendarParts/Card";
import { StandardStyle } from "../../../../styles/common/StandardStyle";

export default function Card({
  name,
  meetingId,
  start,
  passcode,
  pin,
  deleted,
  moderator,
  end,
  setAllCards,
}) {
  const router = useRouter();

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${moderator.name || "Khul Ke guest"} ${text.home.scheduleForm.inviting}

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
      sx={CardStyle.gridItem}
    >
      <Grid container alignItems={"center"}>
        <Grid
          item
          sx={{
            width: "calc(100% - 90px)",
          }}
        >
          <Grid container alignItems={"center"}>
            <Grid
              item
              sx={{
                width: "calc(100% - 70px)",
              }}
            >
              <Typography
                sx={{
                  font: "normal normal 600 18px/21px Work Sans",
                  color: "#FFFFFF",
                }}
              >
                {name}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                marginRight: "auto",
                marginLeft: "10px",
              }}
            >
              <Typography
                sx={{
                  font: "normal normal 600 12px/21px Work Sans",
                  color: "#FFFFFF",
                }}
              >
                {convertDateToLocalTime(start)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sx={{ marginLeft: "auto" }}>
          {!deleted ? (
            <IconButton
              sx={[StandardStyle.calenderButton,CardStyle.calenderJoinButton]}
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
              sx={[StandardStyle.calenderButton,CardStyle.calenderEndButton]}
              disableRipple={true}
            >
              {text.home.calendar.ended}
            </IconButton>
          )}
        </Grid>
        {!deleted && (
          <Grid item textAlign="right">
            <CardThreeDotMenu meetingId={meetingId} setAllCards={setAllCards} />
          </Grid>
        )}

        <Grid item xs={12} mt="10px">
          <IconButton
            onClick={copyLink}
            sx={CardStyle.copyLinkStyle}
          >
            <Grid
              container
              sx={CardStyle.typographyContainer}
            >
              <Typography
                sx={CardStyle.typographyMeeting}
              >
                {`${
                  typeof window !== "undefined"
                    ? `https://${window.location.host}`
                    : ""
                }/room/${meetingId}` + `${passcode ? `?passcode=${pin}` : ""}`}
              </Typography>
              <ContentCopyIcon
                sx={CardStyle.contentCopyIcon}
                size="sm"
              />
            </Grid>
          </IconButton>
        </Grid>
        <Grid
          item
          xs={12}
          sx={CardStyle.scheduleFormItem}
        >
          <Grid>
            <Typography
              sx={CardStyle.scheduleFormMeeting}
            >
              {text.home.scheduleForm.meetingId}: {meetingId.toUpperCase()}
            </Typography>
          </Grid>
          {passcode && (
            <Grid>
              <Typography
                sx={CardStyle.scheduleFormMeeting}
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
