import { Grid, IconButton, Typography } from "@mui/material";
import { useCallback } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import ScrollZoom from "../../../Utils/ComponentUtilities/ScrollToZoom";

export default function VideoPlayer({
  audioTrack,
  videoTrack,
  user,
  self,
  pinnedUser,
  setPinnedUser,
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
      {(videoTrack && videoTrack?.enabled) || (!self && videoTrack) ? (
        <video
          style={{
            width: "100%",
            height: "100%",
          }}
          ref={videoRef}
          autoPlay={true}
        />
      ) : (
        <Grid
          sx={{
            width: "100%",
            height: "100%",
          }}
          container
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: "0px 5px",
              color: "black",
              zIndex: "2",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            {self
              ? "You have turned your camera off"
              : `${user.uid} has turned camera off`}
          </Typography>
        </Grid>
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
              {self ? "You" : `${user.uid}`}
            </span>{" "}
            [{user.role}]
          </Typography>
        </Grid>
        {!self && (
          <Grid item>
            <IconButton
              onClick={() => {
                if (pinnedUser.uid === user.uid) return setPinnedUser({});

                setPinnedUser(user);
              }}
            >
              <PushPinIcon
                sx={{
                  color: pinnedUser.uid === user.uid ? "black" : "grey",
                }}
              />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
