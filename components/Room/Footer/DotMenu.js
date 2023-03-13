import {
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import text from "../../../Content/text.json";
import { MuteAllUsers } from "../../../Redux/Actions/Room/RoomDataAction";
import ToastHandler from "../../../Utils/Toast/ToastHandler";

export default function DotMenu() {
  const user = useSelector((s) => s.user.data);
  const roomData = useSelector((s) => s.room.data);

  const dispatch = useDispatch();

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

  const muteAll = (e) => {
    const data = {
      data: { meetingId: roomData.meetingId },
      onFailed: () => {
        ToastHandler("dan", "Could Not mute everyone");
      },
      onSuccess: () => {
        ToastHandler("sus", "Muted All users");
      },
    };

    dispatch(MuteAllUsers(data));
    handleClose(e);
  };

  if (user.username !== roomData.moderator?.username) return <></>;

  return (
    <>
      <IconButton
        sx={{
          marginRight: "20px",
        }}
        ref={anchorRef}
        onClick={handleOpenMenu}
      >
        <MoreVertIcon
          sx={{
            color: "white",
            backgroundColor: "#27292B",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
          }}
        />
      </IconButton>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{
          top: anchorRef.current?.offsetTop - 45,
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
            <MenuItem onClick={muteAll}>{text.room.mute}</MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popover>
    </>
  );
}
