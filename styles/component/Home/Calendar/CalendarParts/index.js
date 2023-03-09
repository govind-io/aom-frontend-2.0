export const CalendarStyle = {
    container: {
        height: "100%",
        alignContent: "flex-start",
        maxWidth: "80%",
        margin: "auto",
      },
    rowStyle : {
        boxShadow: "inset 0px 3px 6px #00000029",
    },
    monthRowStyle: {
        height: "50px",
        background: "#2E2E2E 0% 0% no-repeat padding-box",
        borderRadius: "20px 20px 0px 0px",
        marginBottom: "10px",
        padding: "0px 25px",
        display: "flex",
        alignItems: "center",
      },
    dateRowStyle: {
        height: "100px",
        marginBottom: "10px",
        background: "#2E2E2E 0% 0% no-repeat padding-box",
        padding: "0px 25px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
      },
    iconStyle: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
    },
    leftIcon: {
        left: "0px",
    },
    rightIcon: {
        right: "0px"
    },
    cardRowStyle: {
        height: "calc(100% - 200px)",
        background: "#2E2E2E 0% 0% no-repeat padding-box",
        borderRadius: "0px 0px 20px 20px",
        padding: "25px",
    },
    navNextIconStyle: {
        color: "white",
      }
}