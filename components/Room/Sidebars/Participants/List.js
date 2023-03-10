import { Avatar, Grid, Typography } from "@mui/material";
import { RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import text from "../../../../Content/text.json";
import { ROOM } from "../../../../Utils/MeetingUtils/MeetingConstant";
import VolumeIndicator from "../../../Common/VolumeIndicator";

export default function List({ searchQuery }) {
  const [users, setUsers] = useState([]);

  const [showUsers, setShowUsers] = useState(users);

  const { volumes } = useSelector((s) => s.room.metaData);

  useEffect(() => {
    //setting initial users and updating it based on new users joined and left
    setUsers([
      ROOM.localParticipant,
      ...Array.from(ROOM.participants).map(([key, item]) => item),
    ]);

    const userJoined = (joinedUser) => {
      setUsers((prev) => [...prev, joinedUser]);
    };

    const userLeft = (leftUser) => {
      setUsers((prev) =>
        prev.filter((item) => item.identity !== leftUser.identity)
      );
    };

    ROOM.on(RoomEvent.ParticipantConnected, userJoined);
    ROOM.on(RoomEvent.ParticipantDisconnected, userLeft);

    return () => {
      ROOM.off(RoomEvent.ParticipantConnected, userJoined);
      ROOM.off(RoomEvent.ParticipantDisconnected, userLeft);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setShowUsers(users);
      return;
    }

    setShowUsers((prev) =>
      users.filter((item) => {
        const username = item.identity.toLowerCase();

        {
          return username.includes(searchQuery.toLowerCase());
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
            key={item.identity}
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
                  item.identity.split("-")[0]
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
                  {item.name}
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
                  @{item.identity.split("-")[0]}
                </Typography>
              </Grid>
            </Grid>
            {volumes[item.name] && (
              <Grid
                sx={{
                  width: "30px",
                  display: "flex",
                  alignItems: "center",
                  height: "30px",
                }}
              >
                <VolumeIndicator volume={item.audioLevel} />
              </Grid>
            )}
          </Grid>
        );
      })}
    </>
  );
}
