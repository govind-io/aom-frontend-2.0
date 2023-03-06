import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../../Redux/Actions/Room/RoomDataAction";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { useEffect, useRef, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { RoomStyle } from "../../../../styles/pages/room/controls";
import ChangeAudioDeviceModal from "./ChangeAudioDeviceModal";

export default function MicButton() {
  const { audio } = useSelector((s) => s.room.controls);

  const dispatch = useDispatch();

  const [activeMic, setActiveMic] = useState("default");
  const [allMics, setAllMics] = useState([]);

  const [activeSpeaker, setActiveSpeaker] = useState("default");
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  const anchorRef = useRef();

  const toggleAudio = async ({ deviceId }) => {};

  const ChangeMic = async (newMicId) => {};

  return (
    <span style={RoomStyle.micCamButtonContainer} ref={anchorRef}>
      <IconButton
        sx={[
          { backgroundColor: audio && audio?.enabled ? "#27292B" : "#CC3425" },
          RoomStyle.micCamButton,
        ]}
        disableRipple={true}
        onClick={toggleAudio}
      >
        {audio && audio?.enabled ? (
          <MicIcon sx={RoomStyle.micCamIcon} />
        ) : (
          <MicOffIcon sx={RoomStyle.micCamIcon} />
        )}
      </IconButton>
      <IconButton
        sx={RoomStyle.micCamExpandButton}
        onClick={() => {
          setOpenMenu((prev) => !prev);
        }}
      >
        <ExpandLessIcon sx={RoomStyle.micCamExpandButtonIcon} />
      </IconButton>
      <ChangeAudioDeviceModal
        open={openMenu}
        setOpen={setOpenMenu}
        anchorRef={anchorRef}
        activeDevice={activeMic}
        allDevices={allMics}
        setActiveDevice={ChangeMic}
      />
    </span>
  );
}
