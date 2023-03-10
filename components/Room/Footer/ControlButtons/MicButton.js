import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../../Redux/Actions/Room/RoomDataAction";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { useEffect, useRef, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { RoomStyle } from "../../../../styles/pages/room/controls";
import ChangeAudioDeviceModal from "./ChangeAudioDeviceModal";
import { ROOM } from "../../../../Utils/MeetingUtils/MeetingConstant";
import { Room } from "livekit-client";

export default function MicButton() {
  const { audio } = useSelector((s) => s.room.controls);

  const dispatch = useDispatch();

  const [activeMic, setActiveMic] = useState();
  const [allMics, setAllMics] = useState([]);

  const [activeSpeaker, setActiveSpeaker] = useState("default");
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  const anchorRef = useRef();

  const toggleAudio = async ({ deviceId }) => {
    dispatch(SaveRoomControls({ audio: !audio }));
    ROOM.localParticipant.setMicrophoneEnabled(!audio);
  };

  const ChangeMic = async (newMicId) => {
    try {
      await ROOM.switchActiveDevice("audioinput", newMicId);
      setActiveMic(newMicId);
    } catch (e) {
      console.log({ e }, "Could not change mics");
    }
  };

  const ChangeSpeaker = async (newSpeakerId) => {
    try {
      await ROOM.switchActiveDevice("audiooutput", newSpeakerId);
      setActiveSpeaker(newSpeakerId);
    } catch (e) {
      console.log({ e }, "Could not change speakers");
    }
  };

  useEffect(() => {
    const getUpdateMicsAndSpeaker = async () => {
      const mics = await Room.getLocalDevices("audioinput", true);
      const speakers = await Room.getLocalDevices("audiooutput", true);

      setAllSpeakers(speakers);
      setAllMics(mics);

      if (!activeMic) {
        setActiveMic(mics[0].deviceId);
      }

      if (!activeSpeaker) {
        setActiveSpeaker(speakers[0].deviceId);
      }
    };

    getUpdateMicsAndSpeaker();
  }, [openMenu]);

  return (
    <span style={RoomStyle.micCamButtonContainer} ref={anchorRef}>
      <IconButton
        sx={[
          { backgroundColor: audio ? "#27292B" : "#CC3425" },
          RoomStyle.micCamButton,
        ]}
        disableRipple={true}
        onClick={toggleAudio}
      >
        {audio ? (
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
        activeMic={activeMic}
        allMics={allMics}
        setActiveMic={ChangeMic}
        activeSpeaker={activeSpeaker}
        allSpeakers={allSpeakers}
        setActiveSpeaker={ChangeSpeaker}
      />
    </span>
  );
}
