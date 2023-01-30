import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import IndividualSpeaker from "./IndividualSpeaker";
import MeetVideoPlayer from "./VideoPlayer";

export default function GalleryView({}) {
  const { audio, video, screen } = useSelector((s) => s.room.controls);

  const users = Array.from({ length: 1 }, (_, i) => i);

  const user = useSelector((s) => s.user.data);

  const gridHeightandWidthCalculator = (num) => {
    const nearestSquareRoot = Math.round(Math.sqrt(num));

    if (num === 2) {
      return {
        height: "100%",
        width: "50%",
      };
    }

    return {
      height: `${100 / nearestSquareRoot}%`,
      width: `${100 / nearestSquareRoot}%`,
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
      {users.map(() => (
        <Grid
          item
          sx={{
            ...gridHeightandWidthCalculator(users.length + 1),
          }}
        >
          <IndividualSpeaker
            audio={audio}
            video={video}
            username={user.username}
          />
        </Grid>
      ))}
    </Grid>
  );
}
