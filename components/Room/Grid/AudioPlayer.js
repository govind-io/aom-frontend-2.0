import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

export default function MeetAudioPlayer({ audioTrack }) {
  const audioRef = useCallback(
    (node) => {
      if (!node || !audioTrack || !audioTrack?.enabled) return;

      try {
        node.srcObject = audioTrack;
        node.play();
      } catch (e) {
        console.log("something went wrong, warning: ", { e });
      }
    },
    [audioTrack, audioTrack?.enabled]
  );

  return (
    <audio
      ref={audioRef}
      autoPlay={true}
      sx={{
        display: "none",
      }}
    />
  );
}
