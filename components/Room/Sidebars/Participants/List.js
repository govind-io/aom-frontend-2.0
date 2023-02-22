import { Avatar, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import text from "../../../../Content/text.json";
import { meetClient } from "../../../../Utils/Configs/MeetClient";
import VolumeIndicator from "../../../Common/VolumeIndicator";

export default function List({ searchQuery }) {
  const [users, setUsers] = useState([]);

  const [showUsers, setShowUsers] = useState(users);

  const roomData = useSelector((s) => s.room.data);

  const { volumes } = useSelector((s) => s.room.metaData);

  useEffect(() => {
    if (!meetClient) return;

    const intialParticipant = async () => {
      const allUsers = await meetClient.getJoinedUsers(roomData.token);

      setUsers(allUsers);
    };

    const handleUserJoined = (user) => {
      setUsers((prev) => [...prev, user]);
    };

    const handleUserLeft = (user) => {
      setUsers((prev) => prev.filter((item) => item.uid !== user.uid));
    };

    meetClient.on("user-joined", handleUserJoined);

    meetClient.on("user-left", handleUserLeft);

    intialParticipant();

    return () => {
      meetClient.off("user-joined", handleUserJoined);
      meetClient.off("user-left", handleUserLeft);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setShowUsers(users);
      return;
    }

    setShowUsers((prev) =>
      users.filter((item) => {
        const username = item.uid || item.name;

        {
          return username.includes(searchQuery);
        }
      })
    );
  }, [searchQuery, users]);

  return (
    <>
      <Grid item xs={12}>
        <Typography
          sx={{
            font: "normal normal 600 18px/21px Work Sans",
            color: "#F5F5F5",
            mt: "20px",
          }}
        >
          {text.room.participants.thisCall}
          <Typography
            variant="span"
            sx={{
              font: "normal normal normal 12px/14px Work Sans",
              color: "#CECECE",
              background: "#3D3F41 0% 0% no-repeat padding-box",
              borderRadius: "4px",
              width: "50px",
              height: "50px",
              padding: "5px",
              ml: "20px",
            }}
          >
            {users.length}
          </Typography>
        </Typography>
      </Grid>

      {showUsers.map((item) => {
        return (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: "20px",
              display: "flex",
              height: "50px",
              flexWrap: "wrap",
            }}
            key={item.name || item.uid}
          >
            <Grid
              sx={{
                height: "100%",
                width: "fit-content",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                src={`${process.env.KHULKE_USER_PROFILE_PIC_URL}/${
                  item.uid.split("-")[0]
                }/pp`}
              />
            </Grid>
            <Grid
              sx={{
                width: "calc(100% - 70px)",
                paddingLeft: "20px",
              }}
            >
              <Grid
                sx={{
                  height: "fit-content",
                }}
              >
                <Typography
                  sx={{
                    font: "normal normal 600 16px/19px Work Sans",
                    color: "#F5F5F5",
                  }}
                >
                  {(item.name || item.uid).split("-")[1]}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  ml: "auto",
                }}
              >
                <Typography
                  sx={{
                    marginTop: "10px",
                    font: "normal normal normal 14px/16px Work Sans",
                    color: "#CECECE",
                  }}
                >
                  @{(item.name || item.uid).split("-")[0]}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              sx={{
                width: "30px",
                display: "flex",
                alignItems: "center",
                height: "30px",
              }}
            >
              <VolumeIndicator volume={volumes[item.name || item.uid]} />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}
