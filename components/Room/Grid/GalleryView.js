import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTopUsers } from "../../../Utils/DesignUtilities/CalculationManipulation";
import IndividualSpeaker from "./IndividualSpeaker";

export default function GalleryView({ selfUID, users }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  const { chat, participants } = useSelector((s) => s.comps.comp);

  const { volumes } = useSelector((s) => s.room.metaData);

  const [gridUsers, setGridUsers] = useState([]);

  const [bottomUsers, setBottomUsers] = useState([]);

  const totalNumberOfGridUsers = chat || participants ? 9 : 12;

  const gridHeightandWidthCalculator = () => {
    const num =
      gridUsers.length >= totalNumberOfGridUsers
        ? gridUsers.length
        : gridUsers.length + 1;

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
    if (screen) {
      setGridUsers([]);
      setBottomUsers(users);
      return;
    }

    if (users.length <= totalNumberOfGridUsers) {
      setGridUsers(users);
      setBottomUsers([]);
      return;
    }

    const [topUsers, restUsers] = getTopUsers(
      volumes,
      users,
      totalNumberOfGridUsers
    );

    setGridUsers(topUsers);
    setBottomUsers(restUsers);
  }, [users, chat, participants, volumes, screen]);

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
          height:
            gridUsers.length >= totalNumberOfGridUsers || screen
              ? "75%"
              : "100%",
          display: "flex",
          flexWrap: "wrap",
          position: "relative",
          justifyContent: "center",
        }}
        spacing={1}
      >
        {!screen && gridUsers.length === 0 && (
          <Grid item sx={{ width: "100%", height: "100%" }}>
            <IndividualSpeaker
              video={video}
              audio={audio}
              name={selfUID.split("-")[1]}
              username={selfUID.split("-")[0]}
              volume={volumes[selfUID]}
            />
          </Grid>
        )}

        {screen ? (
          <Grid item sx={{ width: "100%", height: "100%" }}>
            <IndividualSpeaker
              video={screen[1] || screen[0]}
              name={`${selfUID.split("-")[1]} (Screen)`}
              username={selfUID.split("-")[0]}
              volume={volumes[selfUID]}
              selfScreen={true}
            />
          </Grid>
        ) : (
          gridUsers.map((item) => {
            return (
              <Grid
                item
                sx={{
                  ...gridHeightandWidthCalculator(),
                }}
                key={item.uid}
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
          })
        )}

        {!screen &&
          gridUsers.length < totalNumberOfGridUsers &&
          gridUsers.length > 0 && (
            <Grid
              sx={{
                ...gridHeightandWidthCalculator(),
              }}
              item
            >
              <IndividualSpeaker
                video={video}
                audio={audio}
                name={selfUID.split("-")[1]}
                username={selfUID.split("-")[0]}
                volume={volumes[selfUID]}
              />
            </Grid>
          )}
      </Grid>

      {(gridUsers.length >= totalNumberOfGridUsers || screen) && (
        <Grid
          item
          xs={12}
          sx={{
            height:
              gridUsers.length >= totalNumberOfGridUsers || screen
                ? "25%"
                : "0%",
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
            {bottomUsers.map((item) => {
              return (
                <Grid
                  item
                  sx={{
                    width: `calc(${widthCalculator()} - 10px)`,
                    height: "100%",
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
                video={video}
                name={selfUID.split("-")[1]}
                username={selfUID.split("-")[0]}
                volume={volumes[selfUID]}
                audio={audio}
                smallTile={true}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
