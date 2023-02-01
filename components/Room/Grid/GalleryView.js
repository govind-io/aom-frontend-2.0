import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import IndividualSpeaker from "./IndividualSpeaker";

export default function GalleryView({ selfUID, users, presenters }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  const { volumes } = useSelector((s) => s.room.metaData);

  const totalUsers = screen
    ? users.length + presenters.length + 2
    : users.length + presenters.length + 1;

  const gridHeightandWidthCalculator = (num) => {
    const columns = Math.ceil(Math.sqrt(num));
    const rows = Math.ceil(num / columns);

    return {
      height: `${100 / rows}%`,
      width: `${100 / columns}%`,
    };
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        height: "100%",
      }}
      justifyContent="center"
      spacing={1}
    >
      {screen && (
        <Grid
          item
          sx={{
            ...gridHeightandWidthCalculator(totalUsers),
          }}
        >
          <IndividualSpeaker
            video={screen[1] || screen[0]}
            name={`${selfUID.split("-")[1]} (Screen)`}
            username={selfUID.split("-")[0]}
            volume={volumes[selfUID]}
            selfScreen={true}
          />
        </Grid>
      )}

      <Grid
        item
        sx={{
          ...gridHeightandWidthCalculator(totalUsers),
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
      {users.map((item) => {
        return (
          <Grid
            item
            sx={{
              ...gridHeightandWidthCalculator(totalUsers),
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

      {presenters.map((item) => {
        return (
          <Grid
            item
            sx={{
              ...gridHeightandWidthCalculator(
                users.length + presenters.length + 1
              ),
            }}
          >
            <IndividualSpeaker
              audio={item.audio}
              video={item.video}
              name={item.uid.split("-")[1]}
              username={item.uid.split("-")[0]}
              volume={null}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
