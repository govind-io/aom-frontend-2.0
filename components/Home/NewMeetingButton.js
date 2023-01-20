import text from "../../Content/text.json";
import images from "../../Content/images.json";
import {
  Checkbox,
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
import { useSelector } from "react-redux";
import { fontSize } from "@mui/system";

export default function NewMeetingButton() {
  const [openMenu, setOpenMenu] = useState(false);
  const [useMeetId, setUseMeetId] = useState(false);
  const [startVideo, setStartVideo] = useState(false);

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

  return (
    <Grid item xs={6} textAlign="center">
      <IconButton
        sx={{
          backgroundColor: "#66B984",
          borderRadius: "20%",
          aspectRatio: "1",
          padding: "40px",
        }}
        disableRipple={true}
      >
        <img src={images.login.new} />
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
            font: "24px",
            paddingTop: "10px",
          }}
        >
          {text.login.new} <img src={images.global.downArrow} />
        </Typography>
      </IconButton>

      {/* Menu UI here */}
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openMenu}
      >
        <ClickAwayListener
          onClickAway={handleClose}
          sx={{ borderRadius: "10px", bgcolor: "#2b2d2e" }}
        >
          <Paper elevation={4}>
            <MenuList sx={{ bgcolor: "#2b2d2e" }}>
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
                  {text.login.personalMeetId} {user.meetId}
                </Typography>
              </MenuItem>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popover>
    </Grid>
  );
}
