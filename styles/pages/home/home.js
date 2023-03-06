export const HomeStyle = {
container: { height: "100%", width: "100%" },
gridItem: {
    "@media (max-width: 56.25rem)": {
      marginTop: "1.875rem",
    },
  },
calenderGridItem: {
    height: "80%",
    position:"relative",
    display: "flex",
    alignItems: "center",
    "@media (max-width: 56.25rem)": {
      maxWidth: "100%",
    },
  },
  meetingGridItem: {
    "@media (max-width: 56.25rem)": {
      justifyContent: "space-around",
    },
  }
}