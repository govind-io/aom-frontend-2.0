import {
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
import Image from "next/image";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import images from "../../Content/images.json";
import text from "../../Content/text.json";
import { SaveRoomLayout } from "../../Redux/Actions/Room/RoomDataAction";
import { FullScreenElement } from "../../Utils/ComponentUtilities/FullScreen";
import { GALLERY, SPEAKER } from "../../Utils/Contants/Conditional";

export default function RoomHeader() {
  const room = useSelector((s) => s.room);
  const dispatch = useDispatch();

  const anchorRef = useRef();

  const [openMenu, setOpenMenu] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const handleViewChange = (view) => {
    dispatch(SaveRoomLayout({ view }));
    setOpenMenu(false);
  };

  return (
    <Grid
      container
      sx={{
        marginLeft: "20px",
        flexWrap: "nowrap",
        height: "100%`",
      }}
      alignItems="center"
    >
      <Grid
        item
        sx={{ width: "2px", height: "70%", backgroundColor: "white" }}
      />
      <Grid
        container
        justifyContent={"space-between"}
        alignItems="center"
        sx={{ height: "100%" }}
        marginLeft="20px"
      >
        <Grid item xs={10}>
          <Typography
            sx={{
              color: "white",
              font: "normal normal 600 20px/24px Work Sans",
            }}
          >
            {room.data.name}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            ref={anchorRef}
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            <Image
              width="25px"
              height="25px"
              style={
                room.layout.view === GALLERY ? { transform: "scale(2)" } : {}
              }
              src={
                room.layout.view === GALLERY
                  ? images.room.galleryview
                  : images.room.speakerview
              }
            />
            <Typography
              sx={{
                font: "normal normal medium 16px/19px Work Sans",
                color: "#F5F5F5",
                marginLeft: "10px",
              }}
            >
              {text.room.view}
            </Typography>
          </IconButton>

          <Popover
            anchorEl={anchorRef.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openMenu}
          >
            <ClickAwayListener onClickAway={() => setOpenMenu((prev) => !prev)}>
              <Paper
                elevation={4}
                sx={{ backgroundColor: "#2b2d2e", borderRadius: "10px" }}
              >
                <MenuList
                  sx={{
                    backgroundColor: "#2b2d2e",
                    borderRadius: "10px",
                    minWidth: "150px",
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
                    onClick={() => {
                      handleViewChange(SPEAKER);
                    }}
                  >
                    <Grid container justifyContent={"space-between"}>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                        }}
                      >
                        {room.layout.view === SPEAKER && (
                          <Image
                            src={images.room.check}
                            width={"15px"}
                            height={"10px"}
                          />
                        )}

                        <Typography
                          sx={{
                            font: "normal normal normal 14px/16px Work Sans",
                            color: "#F5F5F5",
                            marginLeft: "10px",
                          }}
                        >
                          {text.room.speakerView}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Image
                          src={images.room.speakerview}
                          width={"15px"}
                          height={"15px"}
                        />
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      paddingBottom: "5px",
                      paddingTop: "5px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                    onClick={() => {
                      handleViewChange(GALLERY);
                    }}
                  >
                    <Grid container justifyContent={"space-between"}>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                        }}
                      >
                        {room.layout.view === GALLERY && (
                          <Image
                            src={images.room.check}
                            width={"15px"}
                            height={"10px"}
                          />
                        )}

                        <Typography
                          sx={{
                            font: "normal normal normal 14px/16px Work Sans",
                            color: "#F5F5F5",
                            marginLeft: "10px",
                          }}
                        >
                          {text.room.galleryView}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Image
                          src={images.room.galleryview}
                          width={"15px"}
                          height={"15px"}
                          style={{
                            transform: "scale(2)",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </MenuItem>
                  <Divider
                    sx={{
                      backgroundColor: "#0000007E",
                    }}
                  />
                  <MenuItem
                    sx={{
                      paddingBottom: "5px",
                      paddingTop: "5px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                    onClick={() => {
                      FullScreenElement(undefined, fullScreen);
                      setFullScreen((prev) => !prev);
                      setOpenMenu(false);
                    }}
                  >
                    <Grid container justifyContent={"space-between"}>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                        }}
                      >
                        <Typography
                          sx={{
                            font: "normal normal normal 14px/16px Work Sans",
                            color: "#F5F5F5",
                            marginLeft: "10px",
                          }}
                        >
                          {text.room.fullScreen}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Image
                          src={images.room.fullscreenview}
                          width={"15px"}
                          height={"15px"}
                        />
                      </Grid>
                    </Grid>
                  </MenuItem>
                </MenuList>
              </Paper>
            </ClickAwayListener>
          </Popover>
        </Grid>
      </Grid>
    </Grid>
  );
}
