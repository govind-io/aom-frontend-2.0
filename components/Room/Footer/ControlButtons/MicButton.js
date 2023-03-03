import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../../Redux/Actions/Room/RoomDataAction";
import { meetClient } from "../../../../Utils/Configs/MeetClient";
import {
  handleCreateAndPublishAudioTrack,
  handleUnPublishTrack,
} from "../../../../Utils/MeetingUtils/Tracks";
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

  const turnAudioWithNewDevice = async (newMicId) => {
    await handleUnPublishTrack(audio);
    const newAudio = await handleCreateAndPublishAudioTrack(newMicId);
    dispatch(
      SaveRoomControls({
        audio: newAudio,
      })
    );
  };

  useEffect(() => {
    if (!meetClient) return;

    meetClient
      .getAllMics()
      .then((mics) => {
        setAllMics(mics);

        const defaultMic = mics.find((item) => item.deviceid === "default");

        if (!defaultMic) {
          setActiveCamera(mics[0].deviceId);
          if (audio) {
            turnAudioWithNewDevice(mics[0].deviceId);
          }
        }
      })
      .catch((e) => {
        console.log("error occured while fetching mics");
      });

    meetClient
      .getAllSpeakers()
      .then((speakers) => {
        setAllSpeakers(speakers);
      })
      .catch((e) => {
        console.log("error occured while fetching speakers");
      });
  }, [meetClient]);

  const toggleAudio = async ({ deviceId }) => {
    if (!meetClient) return;

    if (audio) {
      await handleUnPublishTrack(audio);
      dispatch(SaveRoomControls({ audio: false }));
    } else {
      const newAudio = await handleCreateAndPublishAudioTrack(
        deviceId || activeMic
      );
      dispatch(
        SaveRoomControls({
          audio: newAudio,
        })
      );
      return;
    }
  };

  const ChangeMic = async (newMicId) => {
    setActiveMic(newMicId);

    if (!audio) {
      await toggleAudio({ deviceId: newMicId });
    } else {
      await turnAudioWithNewDevice(newMicId);
    }
  };

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
