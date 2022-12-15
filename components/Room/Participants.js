import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToggleParticpantsList } from "../../Redux/Actions/Comps/CollapsibleComps";
import { meetClient } from "../../Utils/Configs/MeetClient";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { ChangeParticipantCounts } from "../../Redux/Actions/Comps/DataComps";

export default function Participants() {
  //states here
  const [participants, setParticipants] = useState([]);

  const dispatch = useDispatch();

  //selectors here
  const userData = useSelector((state) => state.user.data);

  //effects here
  useEffect(() => {
    if (!meetClient) return;

    const userJoinedEvent = ({ uid, role }) => {



      setParticipants((prev) => {
        return [...prev, { name: uid, role }];
      });
    };

    const userLeftEvent = ({ uid, role }) => {


      setParticipants((prev) => {
        const newParticipants = prev.filter((item) => item.name !== uid || item.role !== role);
        return newParticipants;
      });
    };

    const func = async () => {
      const participantsLocal = await meetClient.getJoinedUsers(userData.token);
      setParticipants(participantsLocal);
    };

    func();

    meetClient?.on("user-joined", userJoinedEvent);

    meetClient?.on("user-left", userLeftEvent);

    return () => {
      meetClient?.off("user-joined", userJoinedEvent);
      meetClient?.off("user-left", userLeftEvent);
    };
  }, [meetClient]);





  useEffect(() => {
    dispatch(ChangeParticipantCounts(participants.length));
  }, [participants]);

  return (
    <Paper
      elevation={5}
      style={{
        backgroundColor: "#9b7b56",
        height: "100%",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          style={{
            position: "sticky",
            top: "0",
            backgroundColor: "#9b7b56",
          }}
        >
          <IconButton
            onClick={() => {
              dispatch(ToggleParticpantsList(false));
            }}
            sx={{ position: "absolute", right: "0px" }}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <Typography
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Participants{" "}
          </Typography>
        </Grid>
        {participants.map((item) => {
          return (
            <Paper
              elevation={4}
              style={{
                width: "80%",
                margin: "auto",
                padding: "10px",
                marginBottom: "10px",
              }}
              key={item.name}
            >
              <Grid item xs={12} key={item.name}>
                <Typography
                  variant={"p"}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "left",
                    fontSize: "18px",
                  }}
                >
                  {item.name.split("-")[0]} -{" "}
                  <span
                    style={{
                      textTransform: "capitalize",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "normal",
                    }}
                  >
                    {item.role}
                  </span>{" "}
                  {item.name === userData.uid && (
                    <>
                      -{" "}
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "normal",
                        }}
                      >
                        Self
                      </span>
                    </>
                  )}
                </Typography>
              </Grid>
            </Paper>
          );
        })}
      </Grid>
    </Paper>
  );
}
