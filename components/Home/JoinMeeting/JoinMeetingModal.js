import {
  Button,
  Checkbox,
  Grid,
  TextField,
  Modal,
  Typography,
  Zoom,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import text from "../../../Content/text.json";

//Mui Styles here

export default function JoinMeetingModal({ open, setOpen }) {
  const user = useSelector((s) => s.user.data);

  const [meetingId, setMeetingId] = useState("");
  const [profilename, setProfileName] = useState(
    user.username || user.name || user.user_id
  );
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ target: e.target });
  };

  const handleCloseModal = () => {
    setOpen(false);
    setMeetingId("");
    setProfileName(user.username || user.name || user.user_id);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleCloseModal}
      closeAfterTransition
      componentsProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(43, 43, 43, 0.8)",
          },
        },
      }}
    >
      <Zoom in={open}>
        <Grid
          container
          sx={{
            position: "absolute",
            top: "50%",
            left: "35%",
            transform: "translateY(-50%) !important",
            background: "#1B1A1D 0% 0% no-repeat padding-box",
            border: "1px solid #FFFFFF4D",
            borderRadius: "16px",
            padding: "32px",
            width: "30%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    font: "normal normal 600 24px/28px Work Sans",
                    color: "#F5F5F5",
                  }}
                >
                  {text.home.joinForm.join}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name={"meetingId"}
                  placeholder={text.home.joinForm.meetingId}
                  value={meetingId}
                  inputProps={{
                    style: {
                      font: "normal normal normal 16px/19px Work Sans",
                      color: "#CECECE",
                      padding: "5px 10px",
                    },
                  }}
                  type={"text"}
                  sx={{
                    marginTop: "50px",
                    border: "1px solid #797979",
                    borderRadius: "8px",
                  }}
                  variant="outlined"
                  onChange={(e) => {
                    setMeetingId(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name={"name"}
                  placeholder={text.home.joinForm.name}
                  value={profilename}
                  inputProps={{
                    style: {
                      font: "normal normal normal 16px/19px Work Sans",
                      color: "#CECECE",
                      padding: "5px 10px",
                    },
                  }}
                  sx={{
                    marginTop: "20px",
                    border: "1px solid #797979",
                    borderRadius: "8px",
                  }}
                  type={"text"}
                  variant="outlined"
                  onChange={(e) => {
                    setProfileName(e.target.value);
                  }}
                />
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
                <Checkbox
                  size="small"
                  sx={{
                    color: "#474749",
                    "&.Mui-checked": {
                      color: "#66B984",
                    },
                    padding: 0,
                  }}
                  checked={!audio}
                  onChange={() => setAudio((prev) => !prev)}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    color: "#CECECE",
                    fontSize: "14px",
                  }}
                >
                  {text.home.joinForm.dontConnectAudio}
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
                <Checkbox
                  size="small"
                  sx={{
                    color: "#474749",
                    "&.Mui-checked": {
                      color: "#66B984",
                    },
                    padding: 0,
                  }}
                  onChange={() => setVideo((prev) => !prev)}
                  checked={!video}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    color: "#CECECE",
                    fontSize: "14px",
                  }}
                >
                  {text.home.joinForm.dontConnectVideo}
                </Typography>
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
                  {text.home.joinForm.cancel}
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
                >
                  {text.home.joinForm.joinBtn}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Zoom>
    </Modal>
  );
}
