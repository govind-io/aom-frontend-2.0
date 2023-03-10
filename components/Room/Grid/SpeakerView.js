import { Grid } from "@mui/material";
import { RoomEvent } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ROOM } from "../../../Utils/MeetingUtils/MeetingConstant";
import IndividualSpeaker from "./IndividualSpeaker";

export default function SpeakerView({
  users,
  presenters,
  selfUID,
  setPresenters,
}) {
  const { chat, participants } = useSelector((s) => s.comps.comp);

  const [activeSpeaker, setActiveSpeaker] = useState(ROOM.localParticipant);

  const presentersRef = useRef();
  presentersRef.current = presenters;

  const widthCalculator = () => {
    if (chat || participants) return "20%";

    return "16.66%";
  };

  useEffect(() => {
    if (presenters.length !== 0) {
      setActiveSpeaker(presenters[0]);
      return;
    }

    const handleActiveSpeakerChanged = (newActiveSpeakers) => {
      if (presentersRef.current.length > 0) return;

      const allUsers = newActiveSpeakers;

      let loudestSpeaker = allUsers[0];

      if (!loudestSpeaker) {
        return;
      }

      allUsers.forEach((item) => {
        if (item.audioLevel > loudestSpeaker.audioLevel) {
          loudestSpeaker = item;
        }
      });

      const speaker = loudestSpeaker;

      setActiveSpeaker(speaker);
    };

    ROOM.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChanged);

    return () => {
      ROOM.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChanged);
    };
  }, [presenters, users]);

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
          height: users.size + presenters.length > 0 ? "25%" : "0%",
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
              (chat || participants) && users.size > 4
                ? "none"
                : !chat && !participants && users.size > 5
                ? "none"
                : "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {(activeSpeaker?.identity !== selfUID || presenters.length > 0) && (
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
                name={ROOM.localParticipant.name}
                username={selfUID.split("-")[0]}
                participant={ROOM.localParticipant}
                smallTile={true}
                setPresenters={setPresenters}
              />
            </Grid>
          )}

          {Array.from(users).map(([key, item]) => {
            if (
              item.identity === activeSpeaker?.identity &&
              presenters.length === 0
            ) {
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
                key={key}
              >
                <IndividualSpeaker
                  name={item.name}
                  username={item.identity.split("-")[0]}
                  smallTile={true}
                  setPresenters={setPresenters}
                  participant={item}
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
          height: users.size + presenters.length > 0 ? "75%" : "100%",
        }}
      >
        {activeSpeaker && (
          <IndividualSpeaker
            name={activeSpeaker?.name}
            username={activeSpeaker?.identity.split("-")[0]}
            participant={activeSpeaker}
            setPresenters={setPresenters}
            isPresenter={presenters.length > 0}
          />
        )}
      </Grid>
    </Grid>
  );
}
