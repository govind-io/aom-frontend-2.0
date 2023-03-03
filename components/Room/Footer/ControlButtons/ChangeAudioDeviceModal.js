import {
  ClickAwayListener,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import text from "../../../../Content/text.json";
import VolumeIndicator from "../../../Common/VolumeIndicator";
import DeviceSelect from "./DeviceSelect";

export default function ChangeAudioDeviceModal({
  open,
  setOpen,
  anchorRef,
  activeDevice,
  allDevices,
  setActiveDevice,
}) {
  const { volumes } = useSelector((s) => s.room.metaData);
  const userData = useSelector((s) => s.user.data);

  const router = useRouter();

  const { profilename } = router.query;

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
                    {text.room.mic}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <DeviceSelect
                    activeDevice={activeDevice}
                    allDevices={allDevices}
                    setActiveDevice={setActiveDevice}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="div"
                    sx={{
                      border: "0.5px solid #797979",
                      borderRadius: "11px",
                      color: "#797979",
                      padding: "5px 15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VolumeIndicator
                      volume={
                        volumes[
                          `${userData.username}-${
                            profilename || userData.name || userData.username
                          }`
                        ]
                      }
                      customContainerStyle={{
                        background: "none",
                      }}
                      customIconStyle={{
                        fontSize: "20px",
                      }}
                    />
                    {text.room.micTest}
                  </Typography>
                </Grid>
              </Grid>
            </MenuItem>
          </MenuList>
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
}
