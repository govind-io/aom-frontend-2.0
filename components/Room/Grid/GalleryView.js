import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTopUsers } from "../../../Utils/DesignUtilities/CalculationManipulation";
import { ROOM } from "../../../Utils/MeetingUtils/MeetingConstant";
import IndividualSpeaker from "./IndividualSpeaker";

export default function GalleryView({ selfUID, users, setPresenters }) {
  const { chat, participants } = useSelector((s) => s.comps.comp);

  const [gridUsers, setGridUsers] = useState([]);

  const [bottomUsers, setBottomUsers] = useState([]);

  const totalNumberOfGridUsers = chat || participants ? 9 : 12;

  const gridHeightandWidthCalculator = () => {
    const num =
      gridUsers.size >= totalNumberOfGridUsers
        ? gridUsers.size
        : gridUsers.size + 1;

    const columns = Math.ceil(Math.sqrt(num));
    const rows = Math.ceil(num / columns);

    return {
      height: `${100 / rows}%`,
      width: `${100 / columns}%`,
    };
  };

  const widthCalculator = () => {
    if (chat || participants) return "25%";

    return "20%";
  };

  useEffect(() => {
    if (users.length <= totalNumberOfGridUsers) {
      setGridUsers(users);
      setBottomUsers([]);
      return;
    }

    const [topUsers, restUsers] = getTopUsers(users, totalNumberOfGridUsers);

    setGridUsers(topUsers);
    setBottomUsers(restUsers);
  }, [users, chat, participants]);

  return (
    <Grid
      container
      sx={{
        width: "100%",
        height: "100%",
      }}
      justifyContent="center"
    >
      <Grid
        container
        sx={{
          height: gridUsers.size >= totalNumberOfGridUsers ? "75%" : "100%",
          display: "flex",
          flexWrap: "wrap",
          position: "relative",
          justifyContent: "center",
        }}
        spacing={1}
      >
        {gridUsers.size === 0 && (
          <Grid item sx={{ width: "100%", height: "100%" }}>
            <IndividualSpeaker
              name={ROOM.localParticipant.name}
              username={selfUID.split("-")[0]}
              participant={ROOM.localParticipant}
              setPresenters={setPresenters}
            />
          </Grid>
        )}

        {Array.from(gridUsers).map(([key, item]) => {
          return (
            <Grid
              item
              sx={{
                ...gridHeightandWidthCalculator(),
              }}
              key={key}
            >
              <IndividualSpeaker
                name={item.name}
                username={item.identity.split("-")[0]}
                participant={item}
                setPresenters={setPresenters}
              />
            </Grid>
          );
        })}

        {gridUsers.size < totalNumberOfGridUsers && gridUsers.size > 0 && (
          <Grid
            sx={{
              ...gridHeightandWidthCalculator(),
            }}
            item
          >
            <IndividualSpeaker
              name={ROOM.localParticipant.name}
              username={selfUID.split("-")[0]}
              participant={ROOM.localParticipant}
              setPresenters={setPresenters}
            />
          </Grid>
        )}
      </Grid>

      {gridUsers.size >= totalNumberOfGridUsers && (
        <Grid
          item
          xs={12}
          sx={{
            height: gridUsers.size >= totalNumberOfGridUsers ? "25%" : "0%",
            display: "flex",
            flexWrap: "nowrap",
          }}
        >
          <Grid
            sx={{
              height: "100%",
              overflowX: "auto",
              width: "80%",
              flexDirection: "column",
              "::-webkit-scrollbar": {
                width: "0.5em",
                backgroundColor: "#F5F5F5",
              },
              "::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                backgroundColor: "#000000",
              },
              alignItems: "flex-end",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {Array.from(bottomUsers).map(([key, item]) => {
              return (
                <Grid
                  item
                  sx={{
                    width: `calc(${widthCalculator()} - 10px)`,
                    height: "100%",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                  key={key}
                >
                  <IndividualSpeaker
                    name={item.name}
                    username={item.identity.split("-")[0]}
                    participant={item}
                    smallTile={true}
                    setPresenters={setPresenters}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Grid
            container
            sx={{
              height: "100%",
              width: "20%",
            }}
            justifyContent="center"
          >
            <Grid
              item
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <IndividualSpeaker
                name={ROOM.localParticipant.name}
                username={selfUID.split("-")[0]}
                participant={ROOM.localParticipant}
                smallTile={true}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
