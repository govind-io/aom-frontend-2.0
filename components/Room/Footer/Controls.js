import { CircularProgress, Grid, IconButton } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import text from "../../../Content/text.json";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteRoom,
  SaveRoomControls,
} from "../../../Redux/Actions/Room/RoomDataAction";
import { useRouter } from "next/router";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import ConfirmationModal from "../../Common/ConfirmationModal";
import { useMemo, useState } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SquareIcon from "@mui/icons-material/Square";
import {
  handleStartRecording,
  handleStopRecording,
} from "../../../Utils/MeetingUtils/Recorder";
import DotMenu from "./DotMenu";
import MicButton from "./ControlButtons/MicButton";
import VideoButton from "./ControlButtons/VideoButton";
import { ROOM } from "../../../Utils/MeetingUtils/MeetingConstant";
import { useParticipant } from "@livekit/react-core";

export default function Controls() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { existingPresenter } = useSelector((s) => s.room.metaData);
  const { moderator, meetingId } = useSelector((s) => s.room.data);
  const { username } = useSelector((s) => s.user.data);

  const [recording, setRecording] = useState(false);
  const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
  const [loading, setLoading] = useState(false);

  const { screenSharePublication: screen } = useParticipant(
    ROOM.localParticipant
  );

  const handleCloseLeaveRoom = () => {
    setOpenLeaveRoom(false);
  };

  const toggleScreen = async () => {
    dispatch(SaveRoomControls({ screen: !screen }));
    ROOM.localParticipant.setScreenShareEnabled(!screen, {
      audio: true,
      systemAudio: "include",
    });
  };

  const leaveRoom = () => {
    ROOM?.disconnect();
    router.push("/home");
    ToastHandler("info", "Meeting left successfully");
  };

  const toggleRecording = async () => {
    if (!recording) {
      setRecording(
        await handleStartRecording(
          setRecording,
          `${router.query.room}'s Recording.mp4`
        )
      );
      return;
    }

    if (recording) {
      setRecording(await handleStopRecording());
      return;
    }
  };

  const EndMeetButton = useMemo(() => {
    const endMeeting = async () => {
      setLoading(true);

      dispatch(
        DeleteRoom({
          data: { meetingId },
          onFailed: () => {
            ToastHandler("dan", "Something went wrong");
            setLoading(false);

            router.push("/home");
          },
          onSuccess: () => {
            ToastHandler("sus", "Meeting ended successfully");
            setLoading(false);

            router.push("/home");
          },
        })
      );
    };

    return (
      <IconButton
        sx={{
          marginLeft: "20px",
          background: "#BC4130 0% 0% no-repeat padding-box",
          borderRadius: "8px",
          padding: "10px 15px",
          font: "normal normal 600 14px/16px Work Sans",
          color: "#F5F5F5",
        }}
        variant={"contained"}
        disableRipple={true}
        onClick={endMeeting}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress
            sx={{
              color: "white",
            }}
          />
        ) : (
          text.room.end
        )}
      </IconButton>
    );
  }, [leaveRoom]);

  return (
    <Grid item>
      <MicButton />
      <VideoButton />
      <IconButton
        sx={{
          backgroundColor: "#27292B",
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
          backgroundColor: "#27292B",
          borderRadius: "8px",
          marginRight: "20px",
        }}
        disableRipple={true}
        onClick={toggleRecording}
      >
        {recording ? (
          <SquareIcon sx={{ color: "white" }} />
        ) : (
          <RadioButtonCheckedIcon sx={{ color: "white" }} />
        )}
      </IconButton>
      <DotMenu />
      <IconButton
        sx={{
          padding: "10px 15px",
          backgroundColor: "#CC3425",
          borderRadius: "8px",
          font: "normal normal 600 16px/19px Work Sans",
          color: "#F5F5F5",
        }}
        disableRipple={true}
        onClick={() => setOpenLeaveRoom(true)}
      >
        {text.room.leave}
      </IconButton>
      <ConfirmationModal
        open={openLeaveRoom}
        handleCloseModal={handleCloseLeaveRoom}
        title={text.room.leave}
        text={text.room.sureLeave}
        confirm={leaveRoom}
        reject={handleCloseLeaveRoom}
        confirmText={text.room.leaveConfirm}
        rejectText={text.room.stay}
        extraButton={moderator?.username === username ? EndMeetButton : ""}
      />
    </Grid>
  );
}
