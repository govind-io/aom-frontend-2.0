import React from "react";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import { VolumeIndicatorStyle } from "../../styles/Common/VolumeIndicator";

export default function VolumeIndicator({
  volume,
  customIconStyle,
  customContainerStyle = {},
}) {
  const volumeIndicate = VolumeIndicatorStyle(customContainerStyle, customIconStyle,volume);
  return (
    <div
      style={volumeIndicate.main}
    >
      <KeyboardVoiceOutlinedIcon
        sx={volumeIndicate.keyVolume}
      />

      <div
        style={volumeIndicate.volumeContainer}
      >
        <div
          style={volumeIndicate.mainVolume}
        ></div>
      </div>
    </div>
  );
}
