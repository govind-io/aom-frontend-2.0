import {
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import text from "../../../../Content/text.json";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useDispatch } from "react-redux";
import { TogglChatList } from "../../../../Redux/Actions/Comps/CollapsibleComps";
import SendMessage from "./SendMessage";
import Messages from "./Messages";

export default function Chat() {
  const dispatch = useDispatch();

  return (
    <Grid
      container
      sx={{
        height: "100%",
      }}
      justifyContent="center"
      alignItems={"center"}
    >
      <Grid
        container
        sx={{
          background: "#2B2D2E 0% 0% no-repeat padding-box",
          borderRadius: "8px",
          width: "90%",
          height: "90%",
          padding: "25px 20px",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "fit-content",
          }}
        >
          <Typography
            sx={{
              font: "normal normal 600 24px/28px Work Sans",
              color: "#F5F5F5",
            }}
          >
            {text.room.chat.messages}
          </Typography>

          <IconButton
            onClick={() => {
              dispatch(TogglChatList());
            }}
          >
            <CancelOutlinedIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{
              backgroundColor: "#79797980",
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            height: "calc(100% - 100px)",
          }}
        >
          <Messages />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            height: "60px",
          }}
        >
          <SendMessage />
        </Grid>
      </Grid>
    </Grid>
  );
}
