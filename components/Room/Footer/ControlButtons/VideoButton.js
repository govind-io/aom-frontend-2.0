import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../../Redux/Actions/Room/RoomDataAction";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useEffect, useRef, useState } from "react";
import { RoomStyle } from "../../../../styles/pages/room/controls";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChangeVideoDeviceModal from "./ChangeVideoDeviceModal";
import { CAMERA_RESOLUTIONS } from "../../../../Utils/Configs/CameraResolution";
import { ROOM } from "../../../../Utils/MeetingUtils/MeetingConstant";
import { Room, Track } from "livekit-client";

export default function VideoButton() {
  const { video } = useSelector((s) => s.room.controls);

  const dispatch = useDispatch();

  const [activeCamera, setActiveCamera] = useState();
  const [allCameras, setAllCameras] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [resolution, setResolution] = useState(
    CAMERA_RESOLUTIONS.find((item) => item.label.toLowerCase() === "auto")
      .dimension
  );

  const anchorRef = useRef();

  useEffect(() => {
    const getUpdatedCameras = async () => {
      const cameras = await Room.getLocalDevices("videoinput", true);

      setAllCameras(cameras);

      if (!activeCamera) {
        setActiveCamera(cameras[0].deviceId);
      }
    };

    getUpdatedCameras();
  }, [openMenu]);

  const toggleVideo = async () => {
    dispatch(SaveRoomControls({ video: !video }));
    ROOM.localParticipant.setCameraEnabled(!video);
  };

  const changeCamera = async (newCamId) => {
    try {
      await ROOM.switchActiveDevice("videointput", newCamId);
      setActiveCamera(newCamId);
    } catch (e) {
      console.log({ e }, "Could not change speakers");
    }
  };

  const changeResolution = async (newResolution) => {
    setResolution(newResolution);

    Array.from(ROOM.localParticipant.videoTracks.entries()).forEach(
      ([key, value]) => {
        const localVideoTrack = value.track;

        if (localVideoTrack.source !== Track.Source.ScreenShare) {
          localVideoTrack.setPublishingQuality(newResolution.liveKit);
        }
      }
    );
  };

  return (
    <span style={RoomStyle.micCamButtonContainer} ref={anchorRef}>
      <IconButton
        sx={[
          {
            backgroundColor: video ? "#27292B" : "#CC3425",
          },
          RoomStyle.micCamButton,
        ]}
        disableRipple={true}
        onClick={toggleVideo}
      >
        {video ? (
          <VideocamIcon sx={RoomStyle.micCamIcon} />
        ) : (
          <VideocamOffIcon sx={RoomStyle.micCamIcon} />
        )}
      </IconButton>
      <IconButton
        sx={RoomStyle.micCamExpandButton}
        onClick={() => setOpenMenu((prev) => !prev)}
      >
        <ExpandLessIcon sx={RoomStyle.micCamExpandButtonIcon} />
      </IconButton>
      <ChangeVideoDeviceModal
        open={openMenu}
        setOpen={setOpenMenu}
        anchorRef={anchorRef}
        activeDevice={activeCamera}
        allDevices={allCameras}
        setActiveDevice={changeCamera}
        resolution={resolution}
        changeResolution={changeResolution}
      />
    </span>
  );
}
