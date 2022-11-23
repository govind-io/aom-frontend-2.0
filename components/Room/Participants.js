import { Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../Utils/Configs/Socket";

export default function Participants() {
  //states here
  const [participants, setParticipants] = useState([]);

  //selectors here
  const userData = useSelector((state) => state.user.data);

  //effects here

  useEffect(() => {
    if (!socket) return;

    const userJoinedEvent = ({ uid, role }) => {
      setParticipants((prev) => {
        return [...prev, { name: uid, role }];
      });
    };

    const userLeftEvent = ({ uid, role }) => {
      setParticipants((prev) => {
        const newParticipants = prev.filter((item) => item.name !== uid);
        return newParticipants;
      });
    };

    const func = async () => {
      const participantsLocal = await socket.getJoinedUsers(userData.token);
      setParticipants(participantsLocal);
    };

    func();

    socket?.on("user-joined", userJoinedEvent);

    socket?.on("user-left", userLeftEvent);

    return () => {
      socket?.off("user-joined", userJoinedEvent);
      socket?.off("user-left", userLeftEvent);
    };
  }, [socket]);

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
          <Typography
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Participants
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
                  {item.name} -{" "}
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
                  {item.name === userData.name && (
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
