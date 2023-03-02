import { CircularProgress, Grid, IconButton } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import text from "../../../Content/text.json";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteRoom,
  SaveRoomControls,
} from "../../../Redux/Actions/Room/RoomDataAction";
import { meetClient, setMeetClient } from "../../../Utils/Configs/MeetClient";
import { useRouter } from "next/router";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import {
  handleCreateAndPublishScreenTrack,
} from "../../../Utils/MeetingUtils/Tracks";
import ConfirmationModal from "../../Common/ConfirmationModal";
import { useMemo, useState } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SquareIcon from "@mui/icons-material/Square";
import {
  handleStartRecording,
  handleStopRecording,
} from "../../../Utils/MeetingUtils/Recorder";
import DotMenu from "./DotMenu";
import {
  EVENTSTATUS
} from "../../../Utils/Contants/Constants";
import MicButton from "./ControlButtons/MicButton";
import VideoButton from "./ControlButtons/VideoButton";

export default function Controls() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { screen } = useSelector((s) => s.room.controls);
  const { existingPresenter } = useSelector((s) => s.room.metaData);
  const { moderator, meetingId } = useSelector((s) => s.room.data);
  const { username } = useSelector((s) => s.user.data);

  const [recording, setRecording] = useState(false);
  const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleCloseLeaveRoom = () => {
    setOpenLeaveRoom(false);
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
      if (existingPresenter) {
        return ToastHandler(
          "warn",
          "Please wait for others to stop sharing screen"
        );
      }

      const screenTrack = await handleCreateAndPublishScreenTrack();
      if (!screenTrack) return;
      screenTrack[0].onended(async () => {
        screenTrack.forEach((item) => item.stop());
        await meetClient.unprodueTracks(screenTrack);
        dispatch(SaveRoomControls({ screen: !screenTrack }));
      });

      return dispatch(SaveRoomControls({ screen: screenTrack }));
    }
  };

  const leaveRoom = () => {
    if (!meetClient) return;

    meetClient.close();

    setMeetClient("");

    ToastHandler("sus", "Left Meeting Succefully");

    return router.push(`/room/${router.query.room}/left`);
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
      await meetClient.emit(EVENTSTATUS.NOTIFICATION_EVENT, { content: EVENTSTATUS.END_MEETING_EVENT });
      dispatch(
        DeleteRoom({
          data: { meetingId },
          onFailed: () => {
            ToastHandler("dan", "Something went wrong");
            setLoading(false);
            meetClient.close();
            router.push("/home");
          },
          onSuccess: () => {
            ToastHandler("sus", "Meeting ended successfully");
            setLoading(false);
            meetClient.close();
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
  }, [meetClient, leaveRoom]);

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
