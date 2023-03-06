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

export default function VideoButton() {
  const { video } = useSelector((s) => s.room.controls);

  const dispatch = useDispatch();

  const [activeCamera, setActiveCamera] = useState("default");
  const [allCameras, setAllCameras] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [resolution, setResolution] = useState(
    CAMERA_RESOLUTIONS.find((item) => item.label.toLowerCase() === "auto")
      .dimension
  );

  const anchorRef = useRef();

  useEffect(() => {}, []);

  const toggleVideo = async ({ deviceId, newResolution }) => {};

  const changeCamera = async (newCamId) => {
    setActiveCamera(newCamId);

    if (!video) {
      await toggleVideo({ deviceId: newCamId });
    } else {
      await turnVideoWithNewDevice({ newCamId });
    }
  };

  const changeResolution = async (newResolution) => {
    setResolution(newResolution);

    if (!video) {
      await toggleVideo({ newResoltuion: newResolution });
    } else {
      await turnVideoWithNewDevice({ newResolution });
    }
  };

  return (
    <span style={RoomStyle.micCamButtonContainer} ref={anchorRef}>
      <IconButton
        sx={[
          {
            backgroundColor: video && video.enabled ? "#27292B" : "#CC3425",
          },
          RoomStyle.micCamButton,
        ]}
        disableRipple={true}
        onClick={toggleVideo}
      >
        {video && video.enabled ? (
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
