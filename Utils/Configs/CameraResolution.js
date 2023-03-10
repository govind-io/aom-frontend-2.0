import { VideoQuality } from "livekit-client";

export const CAMERA_RESOLUTIONS = [
  {
    label: "Auto",
    dimension: {
      width: {
        min: 640,
        max: 1920,
      },
      height: {
        min: 400,
        max: 1080,
      },
      liveKit: VideoQuality.MEDIUM,
    },
  },
  {
    label: "High Defination (720p)",
    dimension: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      liveKit: VideoQuality.HIGH,
    },
  },
  {
    label: "Standard Defination (360p)",
    dimension: {
      width: { ideal: 480 },
      height: { ideal: 360 },
      liveKit: VideoQuality.MEDIUM,
    },
  },
  {
    label: "Low Quality (240p)",
    dimension: {
      width: { ideal: 426 },
      height: { ideal: 240 },
      liveKit: VideoQuality.LOW,
    },
  },
];
