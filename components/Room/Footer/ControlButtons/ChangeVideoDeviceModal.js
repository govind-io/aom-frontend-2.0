import {
  ClickAwayListener,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Select,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import text from "../../../../Content/text.json";
import { CAMERA_RESOLUTIONS } from "../../../../Utils/Configs/CameraResolution";
import DeviceSelect from "./DeviceSelect";

export default function ChangeVideoDeviceModal({
  open,
  setOpen,
  anchorRef,
  activeDevice,
  allDevices,
  setActiveDevice,
  resolution,
  changeResolution,
}) {
  const selectRef = useRef();

  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={{
        top: anchorRef.current?.offsetTop - 20,
        left: anchorRef.current?.offsetLeft + 40,
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
    >
      <ClickAwayListener onClickAway={() => setOpen((prev) => !prev)}>
        <Paper
          elevation={4}
          sx={{ backgroundColor: "#2b2d2e", width: "400px" }}
        >
          <MenuList
            sx={{
              background:
                "ßtransparent url('img/Rectangle 6506.png') 0% 0 % no - repeat padding- box",
              boxShadow: "ß10px 10px 20px #0000007E",
              border: "ß1px solid #FFFFFF4D",
              borderRadius: "ß10px",
              padding: "20px 10px",
            }}
          >
            <MenuItem
              sx={{
                paddingBottom: "5px",
                paddingTop: "5px",
                paddingLeft: "10px",
                paddingRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
              disableRipple={true}
            >
              <Grid
                container
                spacing={2}
                alignItems={"center"}
                justifyContent="center"
              >
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      font: "normal normal 600 16px/19px Work Sans",
                      color: "#FFFFFF",
                    }}
                  >
                    {text.room.camera}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <DeviceSelect
                    activeDevice={activeDevice}
                    allDevices={allDevices}
                    setActiveDevice={setActiveDevice}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    fullWidth
                    inputProps={{
                      "aria-label": "Without label",
                    }}
                    ref={selectRef}
                    sx={{
                      height: "30px",
                      color: "#fff",
                      font: "normal normal normal 14px/16px Work Sans",
                      border: "1px solid white",
                    }}
                    value={resolution}
                    MenuProps={{
                      anchorReference: "anchorPosition",
                      anchorPosition: {
                        top:
                          selectRef.current?.getBoundingClientRect()?.top ||
                          -1000,
                        left:
                          selectRef.current?.getBoundingClientRect()?.left ||
                          1000,
                      },
                      transformOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      disablePortal: true,
                    }}
                    onChange={(e) => {
                      changeResolution(e.target.value);
                    }}
                  >
                    {CAMERA_RESOLUTIONS.map((item) => {
                      return (
                        <MenuItem value={item.dimension} key={item.label}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              </Grid>
            </MenuItem>
          </MenuList>
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
}
