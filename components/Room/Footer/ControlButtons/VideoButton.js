import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../../Redux/Actions/Room/RoomDataAction";
import { meetClient } from "../../../../Utils/Configs/MeetClient";
import {
  handleCreateAndPublishVideoTrack,
  handleUnPublishTrack,
} from "../../../../Utils/MeetingUtils/Tracks";
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

  const turnVideoWithNewDevice = async ({ newCamId, newResolution }) => {
    await handleUnPublishTrack(video);
    const newVideo = await handleCreateAndPublishVideoTrack(
      newCamId,
      newResolution
    );
    dispatch(
      SaveRoomControls({
        video: newVideo,
      })
    );
  };

  useEffect(() => {
    if (!meetClient) return;

    meetClient
      .getAllCameras()
      .then((cameras) => {
        setAllCameras(cameras);

        const defaultCamera = cameras.find(
          (item) => item.deviceid === "default"
        );

        if (!defaultCamera) {
          setActiveCamera(cameras[0].deviceId);
          if (video) {
            turnVideoWithNewDevice({ newCamId: cameras[0].deviceId });
          }
        }
      })
      .catch((e) => {
        console.log("error occured while fetching cameras");
      });
  }, [meetClient]);

  const toggleVideo = async ({ deviceId, newResolution }) => {
    if (!meetClient) return;

    if (video) {
      await handleUnPublishTrack(video);
      dispatch(SaveRoomControls({ video: false }));
    } else {
      return dispatch(
        SaveRoomControls({
          video: await handleCreateAndPublishVideoTrack(
            deviceId || activeCamera,
            newResolution || resolution
          ),
        })
      );
    }
  };

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
