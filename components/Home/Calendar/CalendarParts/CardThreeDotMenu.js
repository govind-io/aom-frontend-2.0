import {
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import text from "../../../../Content/text.json";

export default function CardThreeDotMenu() {
  const [openMenu, setOpenMenu] = useState(false);

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
    <>
      <IconButton ref={anchorRef} onClick={handleOpenMenu}>
        <MoreVertIcon
          sx={{
            color: "white",
            backgroundColor: "transparent",
            borderRadius: "8px",
            width: "20px",
          }}
        />
      </IconButton>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{
          top: anchorRef.current?.offsetTop,
          left: anchorRef.current?.offsetLeft,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={openMenu}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList>
            <MenuItem>{text.room.mute}</MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popover>
    </>
  );
}
