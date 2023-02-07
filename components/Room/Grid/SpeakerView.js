import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IndividualSpeaker from "./IndividualSpeaker";

export default function SpeakerView({ users, presenters, selfUID }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);
  const { chat, participants } = useSelector((s) => s.comps.comp);
  const { volumes } = useSelector((s) => s.room.metaData);

  const [activeSpeaker, setActiveSpeaker] = useState({
    uid: selfUID,
    video,
    audio,
    role: "host",
  });

  const widthCalculator = () => {
    if (chat || participants) return "20%";

    return "16.66%";
  };

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
      if (activeSpeaker.uid.includes("(Screen)")) {
        setActiveSpeaker({
          uid: selfUID,
          role: "host",
          video: video,
        });
      }
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
          height: users.length + presenters.length > 0 || screen ? "25%" : "0%",
          paddingBottom: "10px",
        }}
      >
        <Grid
          sx={{
            height: "100%",
            width: "100%",
            overflowX: "auto",
            "::-webkit-scrollbar": {
              width: "0.5em",
              backgroundColor: "#F5F5F5",
            },
            "::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
              backgroundColor: "#000000",
            },
            flexWrap: "wrap",
            alignItems: "center",
            alignContent:
              (chat || participants) && users.length > 4
                ? "none"
                : !chat && !participants && users.length > 5
                ? "none"
                : "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeSpeaker?.uid !== selfUID && (
            <Grid
              item
              sx={{
                height: "100%",
                width: `calc(${widthCalculator()} - 10px)`,
                marginRight: "10px",
                marginLeft: "10px",
              }}
            >
              <IndividualSpeaker
                audio={audio}
                video={video}
                name={selfUID.split("-")[1]}
                username={selfUID.split("-")[0]}
                volume={volumes[selfUID]}
                smallTile={true}
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
                sx={{
                  height: "100%",
                  width: `calc(${widthCalculator()} - 10px)`,
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
                key={item.uid}
              >
                <IndividualSpeaker
                  audio={item.audio}
                  video={item.video}
                  name={item.uid.split("-")[1]}
                  username={item.uid.split("-")[0]}
                  volume={volumes[item.uid]}
                  smallTile={true}
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
            users.length + presenters.length > 0 || screen ? "75%" : "100%",
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
