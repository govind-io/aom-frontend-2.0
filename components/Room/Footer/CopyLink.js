import { Grid, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import { useSelector } from "react-redux";

export default function CopyLink() {
  const room = useSelector((s) => s.room);

  const copyMeetLink = () => {
    navigator.clipboard.writeText(
      `${window.location.host}/room/${room.data.meetingId}`
    );

    ToastHandler("sus", "Meeting Link Copied Succefully");
  };

  return (
    <Grid
      item
      sx={{
        height: "60%",
      }}
      onClick={copyMeetLink}
    >
      <Grid
        container
        width="210px"
        height={"100%"}
        sx={{
          background: "#27292B 0% 0% no-repeat padding-box",
          borderRadius: "8px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
        alignItems="center"
      >
        <Grid item xs={9}>
          <Typography
            sx={{
              font: "normal normal normal 12px/14px Work Sans",
              color: "#CECECE",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {`${
              typeof window !== "undefined" ? window.location.host : ""
            }/room/${room.data.meetingId}`}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            width: "2px",
            height: "100%",
            backgroundColor: "#CECECE",
          }}
        />
        <Grid item>
          <ContentCopyIcon
            sx={{
              marginLeft: "10px",
              color: "#CECECE",
              marginLeft: "10px",
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
