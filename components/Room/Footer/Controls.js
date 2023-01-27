import { Grid, IconButton } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import text from "../../../Content/text.json";
import { useDispatch, useSelector } from "react-redux";
import { SaveRoomControls } from "../../../Redux/Actions/Room/RoomDataAction";
import { meetClient } from "../../../Utils/Configs/MeetClient";
import { useRouter } from "next/router";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import {
  handleCloseAndUnPublishTrack,
  handleCreateAndPublishAudioTrack,
  handleCreateAndPublishScreenTrack,
  handleCreateAndPublishVideoTrack,
} from "../../../Utils/MeetingUtils/Tracks";

export default function Controls() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { audio, screen, video } = useSelector((s) => s.room.controls);

  const toggleVideo = async () => {
    if (!meetClient) return;

    if (video && video?.enabled) {
      await video.setEnabled(false);
      dispatch(SaveRoomControls({ video }));
    } else {
      if (!video) {
        return dispatch(
          SaveRoomControls({ video: await handleCreateAndPublishVideoTrack() })
        );
      } else if (video && video.setEnabled) {
        await video.setEnabled(true);
        dispatch(SaveRoomControls({ video }));
      }
    }
  };

  const toggleAudio = async () => {
    if (!meetClient) return;

    if (audio && audio.enabled) {
      await audio.setEnabled(false);
      dispatch(SaveRoomControls({ audio }));
    } else {
      if (!audio) {
        return dispatch(
          SaveRoomControls({ audio: await handleCreateAndPublishAudioTrack() })
        );
      } else if (audio && audio.setEnabled) {
        await audio.setEnabled(true);
        dispatch(SaveRoomControls({ audio }));
      }
    }
  };

  const toggleScreen = async () => {
    if (!meetClient) return;

    if (screen) {
      try {
        screen.forEach((item) => item.stop());
        await meetClient.unprodueTracks(screen);
        dispatch(SaveRoomControls({ screen: !screen }));
      } catch (e) {
        ToastHandler("dan", "Something went wrong");
        console.log({ e });
      }
    } else {
      return dispatch(
        SaveRoomControls({ screen: await handleCreateAndPublishScreenTrack() })
      );
    }
  };

  const leaveRoom = () => {
    if (!meetClient) return;

    meetClient.close();

    ToastHandler("sus", "Left Meeting Succefully");

    return router.push("/home");
  };

  return (
    <Grid item>
      <IconButton
        sx={{
          backgroundColor: audio && audio?.enabled ? "#27292B" : "#CC3425",
          borderRadius: "8px",
          marginRight: "20px",
        }}
        disableRipple={true}
        onClick={toggleAudio}
      >
        {audio && audio?.enabled ? (
          <MicIcon sx={{ color: "white" }} />
        ) : (
          <MicOffIcon sx={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: video && video.enabled ? "#27292B" : "#CC3425",
          borderRadius: "8px",
          marginRight: "20px",
        }}
        disableRipple={true}
        onClick={toggleVideo}
      >
        {video && video.enabled ? (
          <VideocamIcon sx={{ color: "white" }} />
        ) : (
          <VideocamOffIcon sx={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: screen ? "#27292B" : "#CC3425",
          borderRadius: "8px",
          marginRight: "20px",
        }}
        disableRipple={true}
        onClick={toggleScreen}
      >
        {screen ? (
          <CancelPresentationIcon sx={{ color: "white" }} />
        ) : (
          <PresentToAllIcon sx={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        sx={{
          padding: "10px 15px",
          backgroundColor: "#CC3425",
          borderRadius: "8px",
          font: "normal normal 600 16px/19px Work Sans",
          color: "#F5F5F5",
        }}
        disableRipple={true}
        onClick={leaveRoom}
      >
        {text.room.leave}
      </IconButton>
    </Grid>
  );
}
