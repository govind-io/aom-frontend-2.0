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

export default function Controls() {
  const dispatch = useDispatch();

  const { audio, screen, video } = useSelector((s) => s.room.controls);

  const toggleVideo = () => {
    dispatch(SaveRoomControls({ video: !video }));
  };

  const toggleAudio = () => {
    dispatch(SaveRoomControls({ audio: !audio }));
  };

  const toggleScreen = () => {
    dispatch(SaveRoomControls({ screen: !screen }));
  };

  return (
    <Grid item>
      <IconButton
        sx={{
          backgroundColor: audio ? "#27292B" : "#CC3425",
          borderRadius: "8px",
          marginRight: "20px",
        }}
        disableRipple={true}
        onClick={toggleAudio}
      >
        {audio ? (
          <MicIcon sx={{ color: "white" }} />
        ) : (
          <MicOffIcon sx={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: video ? "#27292B" : "#CC3425",
          borderRadius: "8px",
          marginRight: "20px",
        }}
        disableRipple={true}
        onClick={toggleVideo}
      >
        {video ? (
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
      >
        {text.room.leave}
      </IconButton>
    </Grid>
  );
}
