import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IndividualSpeaker from "./IndividualSpeaker";

export default function SpeakerView({ users, presenters, volumes, selfUID }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  const [activeSpeaker, setActiveSpeaker] = useState({
    uid: selfUID,
    video,
    audio,
    role: "host",
  });

  useEffect(() => {
    if (screen) {
      setActiveSpeaker({
        uid: `${selfUID} (Screen)`,
        role: "host",
        selfScreen: true,
        video: screen[1] || screen[0],
      });
      return;
    }

    if (presenters.length !== 0) {
      setActiveSpeaker({
        ...presenters[0],
        uid: `${presenters[0].uid} (Screen)`,
      });
      return;
    }

    const allUsers = Object.keys(volumes);

    let loudestSpeaker = allUsers[0];

    if (!loudestSpeaker) {
      setActiveSpeaker({ uid: selfUID, video, audio, role: "host" });
      return;
    }

    allUsers.forEach((item) => {
      if (volumes[item] > volumes[loudestSpeaker]) {
        loudestSpeaker = item;
      }
    });

    const speaker = users.find((item) => item.uid === loudestSpeaker) || {
      uid: selfUID,
      video,
      audio,
      role: "host",
    };

    setActiveSpeaker(speaker);
  }, [presenters, users, volumes, screen]);

  return (
    <Grid
      container
      sx={{
        height: "100%",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          height: users.length + presenters.length > 0 || screen ? "30%" : "0%",
        }}
      >
        <Grid
          container
          sx={{
            height: "100%",
            overflowX: "auto",
          }}
          justifyContent="center"
          spacing={1}
        >
          {activeSpeaker?.uid !== selfUID && (
            <Grid
              item
              xs={3}
              sx={{
                height: "100%",
              }}
            >
              <IndividualSpeaker
                audio={audio}
                video={video}
                name={selfUID.split("-")[1]}
                username={selfUID.split("-")[0]}
                volume={volumes[selfUID]}
              />
            </Grid>
          )}

          {users.map((item) => {
            if (item.uid === activeSpeaker?.uid && !presenters.length > 0) {
              return;
            }
            return (
              <Grid
                item
                xs={3}
                sx={{
                  height: "100%",
                }}
              >
                <IndividualSpeaker
                  audio={item.audio}
                  video={item.video}
                  name={item.uid.split("-")[1]}
                  username={item.uid.split("-")[0]}
                  volume={volumes[item.uid]}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height:
            users.length + presenters.length > 0 || screen ? "70%" : "100%",
        }}
      >
        {activeSpeaker && (
          <IndividualSpeaker
            audio={activeSpeaker?.audio}
            video={activeSpeaker?.video}
            name={activeSpeaker?.uid.split("-")[1]}
            username={activeSpeaker?.uid.split("-")[0]}
            volume={volumes[activeSpeaker?.uid]}
            selfScreen={activeSpeaker.selfScreen}
          />
        )}
      </Grid>
    </Grid>
  );
}
