import { Divider, Grid, IconButton, Typography } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import text from "../../../../Content/text.json";
import { useState } from "react";
import Search from "./Search";
import List from "./List";
import { ToggleParticpantsList } from "../../../../Redux/Actions/Comps/CollapsibleComps";
import { useDispatch } from "react-redux";

export default function Participants() {
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  return (
    <Grid
      container
      sx={{
        height: "100%",
      }}
      justifyContent="center"
      alignItems={"center"}
    >
      <Grid
        container
        sx={{
          background: "#2B2D2E 0% 0% no-repeat padding-box",
          borderRadius: "8px",
          width: "90%",
          height: "90%",
          padding: "25px 20px",
          paddingRight: "0px",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "fit-content",
            paddingRight: "20px",
          }}
        >
          <Typography
            sx={{
              font: "normal normal 600 24px/28px Work Sans",
              color: "#F5F5F5",
            }}
          >
            {text.room.participants.participants}
          </Typography>

          <IconButton
            onClick={() => {
              dispatch(ToggleParticpantsList());
            }}
          >
            <CancelOutlinedIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            paddingRight: "20px",
            height: "fit-content",
            backgroundColor: "#79797980",
          }}
        >
          <Divider />
        </Grid>
        <Search setSearchQuery={setSearchQuery} />
        <Grid
          item
          xs={12}
          sx={{
            height: "calc(100% - 80px)",
            paddingRight: "20px",
            overflowY: "auto",
            "::-webkit-scrollbar": {
              width: "0.5em",
              backgroundColor: "#F5F5F5",
            },
            "::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
              backgroundColor: "#000000",
            },
          }}
        >
          <List searchQuery={searchQuery} />
        </Grid>
      </Grid>
    </Grid>
  );
}
