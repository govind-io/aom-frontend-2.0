import { Grid, IconButton, Typography } from "@mui/material";
import { useCallback } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import ScrollZoom from "../../../Utils/ComponentUtilities/ScrollToZoom";
import CancelPresentation from "@mui/icons-material/CancelPresentation";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "../../../Utils/DesignUtilities/AvatarUtils";
import VolumeVisualizer from "./VolumeIndicator";
import PulsingAvatar from "./PulsingAvatar";
export default function VideoPlayer({
  audioTrack,
  videoTrack,
  user,
  self,
  pinnedUser,
  setPinnedUser,
  selfScreen,
  stopSharingScreen,
  volume,
}) {
  const videoRef = useCallback(
    (node) => {
      if (!node || !videoTrack) return;
      node.srcObject = videoTrack;
      ScrollZoom(node, 2, 0.2);
    },
    [videoTrack]
  );

  const audioRef = useCallback(
    (node) => {
      if (!node || !audioTrack || self) return;
      node.srcObject = audioTrack;
    },
    [audioTrack]
  );

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid black",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!self && (
        <Grid
          item
          xs={12}
          sx={{
            position: "absolute",
            bottom: "0px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {!videoTrack?.enabled && (
            <IconButton
              variant={"contained"}
              sx={{
                backgroundColor: "black",
                ml: "10px",
                width: "fit-content",
                height: "fit-content",
                borderRadius: "10px",
              }}
            >
              <VideocamOffIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          )}

          {!audioTrack?.enabled && (
            <IconButton
              variant={"contained"}
              sx={{
                backgroundColor: "black",
                ml: "10px",
                width: "fit-content",
                height: "fit-content",
                borderRadius: "10px",
              }}
            >
              <MicOffIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          )}
        </Grid>
      )}

      {videoTrack && videoTrack?.enabled ? (
        <Grid
          item
          xs={12}
          sx={{
            height: "100%",
            transformOrigin: "50%",
            transform:
              user.uid.split("@")[1] === "screen" ? "scaleX(1)" : "scaleX(-1)",
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
            }}
            autoPlay={true}
          />
        </Grid>
      ) : (
        <PulsingAvatar uid={user.uid} volume={volume} />
      )}

      <audio
        style={{
          display: "none",
        }}
        autoPlay={true}
        ref={audioRef}
      />

      <Grid
        container
        justifyContent={"space-between"}
        alignItems="center"
        sx={{
          top: "0px",
          left: "0px",
          position: "absolute",
        }}
      >
        <Grid item>
          <Typography
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: "0px 5px",
              color: "white",
              zIndex: "2",
              borderRadius: "5px",
              fontSize: "12px",
              marginLeft: "5px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {self
                ? "You"
                : selfScreen
                  ? "You@screen"
                  : `${user.uid.split("-")[0]}${user.uid.split("@")[1] ? "@screen" : ""
                  }`}
            </span>
            [{user.role}]
          </Typography>
        </Grid>
        <Grid item>
          <VolumeVisualizer volume={volume} />
          {!self && (
            <IconButton
              onClick={() => {
                if (pinnedUser.uid === user.uid) return setPinnedUser({});

                setPinnedUser(user);
              }}
            >
              <PushPinIcon
                sx={{
                  color: pinnedUser.uid === user.uid ? "#afafaf" : "white",
                }}
              />
            </IconButton>
          )}
        </Grid>
      </Grid>
      {selfScreen && (
        <Grid
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
          container
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            style={{
              backgroundColor: "white",
              padding: "0px 5px",
              color: "black",
              zIndex: "2",
              borderRadius: "5px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Your screen is being shared to everyone in the room
            <IconButton
              sx={{
                marginLeft: "10px",
              }}
              onClick={() => {
                stopSharingScreen();
              }}
              variant={"contained"}
            >
              <CancelPresentation />
            </IconButton>
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
