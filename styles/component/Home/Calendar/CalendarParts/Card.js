import { StandardStyle } from "../../../../common/StandardStyle";

export const CardStyle = {
    gridItem: {
        borderRadius: "10px",
        background: "#1A191C",
        boxShadow: "0px 10px 10px #00000029",
        height: "fit-content",
        padding: "10px",
        marginTop: "20px",
      },
      calenderEndButton: {
        color: "#CC3425",
        backgroundColor: "#F5F5F5",
        cursor: "default",
      },
      calenderJoinButton: {
        font: StandardStyle.font,
        color: "#66B984",
        backgroundColor: "white",
      },
      typographyContainer: {
        borderTop: "0.5px solid white",
        borderBottom: "0.5px solid white",
        padding: "5px 0px",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        alignItems: "center",
        cursor: "pointer",
      },
      typographyMeeting: {
        font: "normal normal normal 10px/11px Work Sans",
        color: "#72A2FF",
        textOverflow: "ellipsis",
        maxWidth: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
      },
      contentCopyIcon: {
        marginLeft: "auto",
        color: "#72A2FF",
        marginLeft: "10px",
      },
      copyLinkStyle: {
        width: "100%",
        borderRadius: "0px",
        padding: "0px",
      },
      scheduleFormItem : {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        marginTop: "20px",
      },
      scheduleFormMeeting: {
        font: "normal normal 600 12px/14px Work Sans",
        color: "#FFFFFF",
      }
}