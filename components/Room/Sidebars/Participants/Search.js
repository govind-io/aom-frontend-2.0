import { Grid, Input, TextField } from "@mui/material";
import text from "../../../../Content/text.json";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function Search({ setSearchQuery }) {
  return (
    <Grid
      item
      xs={12}
      sx={{
        marginRight: "20px",
        marginTop: "10px",
      }}
    >
      <Input
        fullWidth
        sx={{
          background: "#1B1A1D 0% 0% no-repeat padding-box",
          borderRadius: "24px",
          padding: "0px",
        }}
        inputProps={{
          style: {
            font: "normal normal normal 14px/16px Work Sans",
            color: "#7C7E82",
            padding: "10px 20px",
            height: "30px",
            borderRadius: "24px",
          },
        }}
        placeholder={text.room.participants.search}
        startAdornment={
          <SearchRoundedIcon size="md" sx={{ color: "white", ml: "10px" }} />
        }
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
    </Grid>
  );
}
