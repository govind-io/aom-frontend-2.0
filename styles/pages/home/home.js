export const HomeStyle = {
container: { height: "100%", width: "100%" },
gridItem: {
    "@media (max-width: 900px)": {
      marginTop: "30px",
    },
  },
calenderGridItem: {
    height: "80%",
    position:"relative",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 900px)": {
      maxWidth: "100%",
    },
  },
  meetingGridItem: {
    "@media (max-width: 900px)": {
      justifyContent: "space-around",
    },
  }
}