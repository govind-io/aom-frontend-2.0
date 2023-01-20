import {
  Avatar,
  ClickAwayListener,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import image from "../../Content/images.json";

export default function HomeHeader() {
  const [openMenu, setOpenMenu] = useState(false);

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
    <Grid
      container
      sx={{
        justifyContent: "flex-end",
      }}
    >
      <Grid item>
        <IconButton onClick={handleOpenMenu} ref={anchorRef}>
          <Avatar
            src={`${process.env.KHULKE_USER_PROFILE_PIC_URL}/${user.username}/pp`}
          />
          <img
            src={image.global.downArrow}
            style={{
              marginLeft: "5px",
            }}
          />
        </IconButton>

        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{ vertical: "bottom" }}
          open={openMenu}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>
              <MenuItem>Hi @{user.username}</MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Popover>
      </Grid>
    </Grid>
  );
}
