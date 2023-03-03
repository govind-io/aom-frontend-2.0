import React from "react";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";

export default function VolumeIndicator({
  volume,
  customIconStyle,
  customContainerStyle = {},
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        position: "relative",
        background: "#FFFFFF 0% 0% no-repeat padding-box",
        borderRadius: "50%",
        opacity: "0.88",
        backdropFilter: "blur(4px)",

        ...customContainerStyle,
      }}
    >
      <KeyboardVoiceOutlinedIcon
        sx={[{ color: "#04AA6D", fontSize: "30px" }, customIconStyle]}
      />

      <div
        style={{
          width: "17%",
          display: "flex",
          alignItems: "flex-end",
          height: "36%",
          position: "absolute",
          top: "20%",
        }}
      >
        <div
          style={{
            height: volume ? `${volume * 10}%` : "0%",
            backgroundColor: "#04AA6D",
            width: "100%",
            borderRadius: "5px",
          }}
        ></div>
      </div>
    </div>
  );
}
