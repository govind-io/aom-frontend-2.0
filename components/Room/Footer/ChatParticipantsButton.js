import { Badge, Grid, IconButton } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  TogglChatList,
  ToggleParticpantsList,
} from "../../../Redux/Actions/Comps/CollapsibleComps";

export default function ChatParticipantsButton() {
  const { chat, participants } = useSelector((s) => s.comps.dataComp);

  const dispatch = useDispatch();

  const toggleParticipants = () => {
    dispatch(ToggleParticpantsList());
  };

  const toggleChat = () => {
    dispatch(TogglChatList());
  };

  return (
    <Grid item>
      <Badge
        badgeContent={participants}
        color={"success"}
        max={1000}
        sx={{
          marginRight: "20px",
        }}
      >
        <IconButton onClick={toggleParticipants}>
          <PeopleAltOutlinedIcon sx={{ color: " white" }} />
        </IconButton>
      </Badge>

      <Badge badgeContent={chat} color={"success"} max={10}>
        <IconButton onClick={toggleChat}>
          <ChatOutlinedIcon sx={{ color: "white" }} />
        </IconButton>
      </Badge>
    </Grid>
  );
}
