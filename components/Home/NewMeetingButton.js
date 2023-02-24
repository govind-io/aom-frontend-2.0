import text from "../../Content/text.json";
import images from "../../Content/images.json";
import {
  Checkbox,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fontSize } from "@mui/system";
import { useRouter } from "next/router";
import { CreateRoom } from "../../Redux/Actions/Room/RoomDataAction";
import ToastHandler from "../../Utils/Toast/ToastHandler";

export default function NewMeetingButton() {
  const [openMenu, setOpenMenu] = useState(false);
  const [useMeetId, setUseMeetId] = useState(true);
  const [startVideo, setStartVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.user.data);

  const anchorRef = useRef();

  const handleOpenMenu = (e) => {
    setOpenMenu(true);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenMenu(false);
  };

  const handleNewMeeting = () => {
    setLoading(true);
    dispatch(
      CreateRoom({
        data: {
          personal: useMeetId,
        },
        onFailed: () => {
          ToastHandler("dan", "Something went wrong");
          setLoading(false);
        },
        onSuccess: (data) => {
          setLoading(false);
          router.push(
            {
              pathname: `/room/${data.meetingId}`,
              query: { audio: true, video: startVideo, internalRedirect: true },
            },
            { pathname: `/room/${data.meetingId}` }
          );
        },
      })
    );
  };

  return (
    <Grid item sm={3} md={6} lg={6} textAlign="center">
      <IconButton
        sx={{
          backgroundColor: "#66B984",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "40px",
          "@media (max-width: 900px)": {
            padding: "10px",
          },
        }}
        disableRipple={true}
        onClick={handleNewMeeting}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress sx={{ color: "white" }} />
        ) : (
          <img
            src={images.login.new}
            style={{
              maxWidth: "80%",
            }}
          />
        )}
      </IconButton>
      <IconButton
        sx={{ width: "100%", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
        ref={anchorRef}
      >
        <Typography
          textAlign={"center"}
          sx={{
            color: "#CECECE",
            fontSize: "24px",
            paddingTop: "10px",
            "@media (max-width: 900px)": {
              fontSize: "12px",
            },
          }}
        >
          {text.login.new} <img src={images.global.downArrow} />
        </Typography>
      </IconButton>

      {/* Menu UI here */}
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={openMenu}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={4}
            style={{ borderRadius: "10px", backgroundColor: "#2b2d2e" }}
          >
            <MenuList sx={{ backgroundColor: "#2b2d2e", borderRadius: "10px" }}>
              <MenuItem
                sx={{
                  paddingBottom: "5px",
                  paddingTop: "5px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
                onClick={() => {
                  setStartVideo(!startVideo);
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
                  checked={startVideo}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    color: "#CECECE",
                    fontSize: "13px",
                  }}
                >
                  {text.login.startVideo}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                sx={{
                  paddingBottom: "5px",
                  paddingTop: "5px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
                onClick={() => {
                  setUseMeetId(!useMeetId);
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
                  checked={useMeetId}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    color: "#CECECE",
                    fontSize: "13px",
                  }}
                >
                  {text.login.personalMeetId} {user.meetingId?.toUpperCase()}
                </Typography>
              </MenuItem>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popover>
    </Grid>
  );
}
