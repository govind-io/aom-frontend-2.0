import {
  ClickAwayListener,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import text from "../../../../Content/text.json";
import { useDispatch } from "react-redux";
import { DeleteRoom } from "../../../../Redux/Actions/Room/RoomDataAction";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";

export default function CardThreeDotMenu({ meetingId, setAllCards }) {
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
          top: anchorRef.current?.getBoundingClientRect().top,
          left: anchorRef.current?.getBoundingClientRect().left,
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openMenu}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList
            sx={{
              minWidth: "150px",
            }}
          >
            <MenuItem
              sx={{
                font: "normal normal normal 12px/14px Work Sans",
              }}
            >
              {text.home.calendar.edit}
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{
                font: "normal normal normal 12px/14px Work Sans",
              }}
              onClick={() => {
                dispatch(
                  DeleteRoom({
                    data: { meetingId },
                    onFailed: () => {
                      ToastHandler("dan", "Something went wrong");
                      setOpenMenu(false);
                    },
                    onSuccess: () => {
                      ToastHandler("sus", "Meeting ended successfully");
                      setOpenMenu(false);
                      setAllCards((prev) => {
                        return [
                          ...prev.map((item) => {
                            console.log({ meetingId, item });
                            if (item.meetingId !== meetingId) return item;

                            return { ...item, deleted: true };
                          }),
                        ];
                      });
                    },
                  })
                );
              }}
            >
              {text.home.calendar.end}
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popover>
    </>
  );
}
