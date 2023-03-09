import { AudioRenderer } from "@livekit/react-core";

export default function MeetAudioPlayer({ audioTrack }) {
  return audioTrack ? <AudioRenderer track={audioTrack} /> : <></>;
}
