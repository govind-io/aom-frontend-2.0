import React, { useEffect, useState } from "react";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import { VolumeIndicatorStyle } from "../../styles/Common/VolumeIndicator";
import { VIEWSTATUS } from "../../Utils/Contants/Conditional";
import { ROOM } from "../../Utils/MeetingUtils/MeetingConstant";

export default function VolumeIndicator({
  volume,
  customIconStyle,
  customContainerStyle = {},
}) {
  const volumeIndicate = VolumeIndicatorStyle(
    customContainerStyle,
    customIconStyle,
    volume * 10 // This converts volume from 0-1 to 0-10 to reflect animation properly
  );

  //this state is toggled every 800ms to reflect the animation
  const [reRenderer, setReRenderer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setReRenderer((prev) => !prev);
    }, [VIEWSTATUS.VOLUME_ANIMATION_INTERVAL]);

    return clearInterval(interval);
  }, []);

  return (
    <div style={volumeIndicate.main}>
      <KeyboardVoiceOutlinedIcon sx={volumeIndicate.keyVolume} />

      <div style={volumeIndicate.volumeContainer}>
        <div style={volumeIndicate.mainVolume}></div>
      </div>
    </div>
  );
}
