import {
  Button,
  Checkbox,
  Grid,
  TextField,
  Modal,
  Typography,
  Zoom,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import text from "../../../Content/text.json";
import { GetRoomDetails } from "../../../Redux/Actions/Room/RoomDataAction";
import { SaveUserData } from "../../../Redux/Actions/User/DataAction";
import ToastHandler from "../../../Utils/Toast/ToastHandler";

//Mui Styles here

export default function JoinMeetingModal({ open, setOpen }) {
  const user = useSelector((s) => s.user.data);
  const router = useRouter();
  const dispatch = useDispatch();

  const [meetingId, setMeetingId] = useState("");
  const [profilename, setProfileName] = useState(user.name || "");
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!meetingId || !profilename) {
      ToastHandler("dan", "Meeting Id and Name is required");
      return;
    }

    if (pin && pin?.length !== 6) {
      return ToastHandler(
        "dan",
        "Passcode can not be longer than 6 characters"
      );
    }

    setLoading(true);

    dispatch(
      GetRoomDetails({
        data: {
          meetingId,
          pin,
        },
        onSuccess: (data) => {
          setLoading(false);
          router.push(
            {
              pathname: `/room/${data.meetingId}`,
              query: {
                video,
                audio,
                profilename,
              },
            },
            { pathname: `/room/${data.meetingId}` }
          );

          dispatch(SaveUserData({ name: profilename }));
        },
        onFailed: (data) => {
          console.log({ data });
          if (data.message.includes(404)) {
            ToastHandler("dan", "Invalid Meeting Id");
          } else {
            ToastHandler("dan", "Something went wrong");
          }
          setLoading(false);
        },
      })
    );
  };

  const handleCloseModal = () => {
    setOpen(false);
    setMeetingId("");
    setProfileName(user.name || user.username);
    setPin("");
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
                  required={true}
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
                    const addHyphen = (str) => {
                      var result = "";
                      for (var i = 0; i < str.length; i++) {
                        result += str[i];
                        if ((i + 1) % 3 == 0 && i != str.length - 1) {
                          result += "-";
                        }
                      }
                      return result;
                    };

                    const text = e.target.value.replace(/-/g, "");

                    if (text.length > 0 && !/^[a-zA-Z0-9]+$/.test(text)) {
                      return ToastHandler(
                        "dan",
                        "Meeting Id should not contain any special characters"
                      );
                    }

                    if (text.length > 9) {
                      return ToastHandler(
                        "warn",
                        "Meeting Id Can not be Longer than 9 characters"
                      );
                    }

                    setMeetingId(addHyphen(text).toUpperCase());
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name={"name"}
                  required={true}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name={"pin"}
                  placeholder={text.home.joinForm.pin}
                  value={pin}
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
                    setPin(e.target.value);
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
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress
                      sx={{
                        color: "white",
                      }}
                    />
                  ) : (
                    text.home.joinForm.joinBtn
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Zoom>
    </Modal>
  );
}
