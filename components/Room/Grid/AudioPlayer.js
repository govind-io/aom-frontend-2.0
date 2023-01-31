import { useCallback } from "react";

export default function MeetAudioPlayer({ audioTrack }) {
  const audioRef = useCallback(
    (node) => {
      if (!node || !audioTrack) return;
      node.srcObject = audioTrack;
      node.play();
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
