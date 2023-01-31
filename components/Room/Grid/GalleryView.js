import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import IndividualSpeaker from "./IndividualSpeaker";

export default function GalleryView({ volumes, selfUID, users }) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

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
    >
      <Grid
        item
        sx={{
          ...gridHeightandWidthCalculator(users.length + 1),
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
              ...gridHeightandWidthCalculator(users.length + 1),
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
  );
}
