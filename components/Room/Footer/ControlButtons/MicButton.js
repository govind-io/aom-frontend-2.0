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
import { useEffect, useState } from "react";

export default function MicButton() {
    const { audio } = useSelector((s) => s.room.controls);

    const dispatch = useDispatch();

    const [activeMic, setActiveMic] = useState("default")
    const [allMics, setAllMics] = useState([])


    useEffect(() => {
        if (!meetClient) return

        meetClient.getAllMics

    }, [meetClient])


    const toggleAudio = async (deviceId) => {
        if (!meetClient) return;

        if (audio) {
            await handleUnPublishTrack(audio);
            dispatch(SaveRoomControls({ audio: false }));
        } else {
            return dispatch(
                SaveRoomControls({ audio: await handleCreateAndPublishAudioTrack(deviceId) })
            );
        }
    };

    const ChangeMic = async () => { }

    return (
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
    );
}
