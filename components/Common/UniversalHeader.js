import { Avatar, Grid } from "@mui/material";
import { useRouter } from "next/router";
import images from "../../Content/images.json";
import { UniversalHeaderStyle } from "../../styles/Common/UniversalHeader";
export default function UniversalHeader({ children }) {
  const router = useRouter();

  return (
    <Grid
      container
      alignItems={"center"}
      sx={UniversalHeaderStyle.container}
    >
      <Grid
        item
        sx={UniversalHeaderStyle.item}
      >
        <Avatar
          src={images.global.khulke}
          variant="square"
          onClick={() => {
            router.push("/home");
          }}
          sx={UniversalHeaderStyle.avatarIcon}
        />
      </Grid>
      <Grid container sx={UniversalHeaderStyle.gridContainer}>
        {children}
      </Grid>
    </Grid>
  );
}
