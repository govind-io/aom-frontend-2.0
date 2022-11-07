import {
  Grid,
  Button,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { setSocket } from "../Utils/Configs/Socket";
import { DesignForms, JoinRoomForm } from "../Utils/DesignUtilities/Form";
import ToastHandler from "../Utils/Toast/ToastHandler";
import { ConnectMeet } from "../MEET_SDK";
import { useRouter } from "next/router";
import { SaveUserData } from "../Redux/Actions/User/DataAction";
import { useDispatch } from "react-redux";

export default function Home() {
  //constants here
  const router = useRouter();
  const dispatch = useDispatch();

  //form submission handler
  const handleJoin = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      room: e.target.room.value,
      role: e.target.role.value,
    };

    if (!formData.name || !formData.room || !formData.role) {
      return ToastHandler("dan", "Please fill all fields");
    } else if (formData.name.includes(" ")) {
      return ToastHandler("dan", "Name can not have spaces");
    }

    const token = "xyz"; //logic for getting the token
    ConnectMeet({ token, role: formData.role, uid: formData.name })
      .then((socket) => {
        setSocket(socket);
        dispatch(
          SaveUserData({
            room: formData.room,
            name: formData.name,
            role: formData.role,
            token,
            uid: formData.name,
          })
        );
        router.push(`/room/${formData.room}`);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  return (
    <form
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
      onSubmit={handleJoin}
    >
      <Grid
        container
        justifyContent={"center"}
        style={{
          maxWidth: "500px",
        }}
      >
        <Grid item xs={12}>
          {DesignForms(JoinRoomForm)}
        </Grid>
        <Grid item xs={12} marginTop="20px">
          <Typography
            variant="h4"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "1.5rem",
              lineHeight: "1.66",
              letterSpacing: "0.03333em",
              textAlign: "left",
            }}
          >
            You want to join as:
          </Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="host"
            name="role"
          >
            <FormControlLabel value="host" control={<Radio />} label="Host" />
            <FormControlLabel
              value="audience"
              control={<Radio />}
              label="Audience"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            style={{
              margin: "auto",
              marginTop: "10px",
              marginRight: "20px",
            }}
            type="submit"
          >
            Join
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
