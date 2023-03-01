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


export default function VideoButton() {
    const { video } = useSelector((s) => s.room.controls);

    const dispatch = useDispatch();

    const toggleVideo = async () => {
        if (!meetClient) return;

        if (video) {
            await handleUnPublishTrack(video);
            dispatch(SaveRoomControls({ video: false }));
        } else {
            return dispatch(
                SaveRoomControls({ video: await handleCreateAndPublishVideoTrack() })
            );
        }
    };

    return (
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
    );
}
