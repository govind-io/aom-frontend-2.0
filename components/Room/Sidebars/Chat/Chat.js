import { Divider, Grid, IconButton, Typography } from "@mui/material";
import text from "../../../../Content/text.json";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useDispatch } from "react-redux";
import { TogglChatList } from "../../../../Redux/Actions/Comps/CollapsibleComps";
import SendMessage from "./SendMessage";
import Messages from "./Messages";

export default function Chat({ messages, setMessages }) {
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
          paddingRight: "0px",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "fit-content",
            paddingRight: "20px",
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
        <Grid
          item
          xs={12}
          sx={{
            paddingRight: "20px",
          }}
        >
          <Divider
            sx={{
              backgroundColor: "#79797980",
            }}
          />
        </Grid>

        <Messages messages={messages} setMessages={setMessages} />

        <Grid
          item
          xs={12}
          sx={{
            height: "60px",
            marginRight: "20px",
          }}
        >
          <SendMessage setMessages={setMessages} />
        </Grid>
      </Grid>
    </Grid>
  );
}
