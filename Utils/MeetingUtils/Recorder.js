let stream = null;
let chunks = [];
let mediaRecorder = null;

let recordingName = "";

export const handleStopRecording = async () => {
  mediaRecorder?.stop();
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  mediaRecorder = null;
  return true;
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    chunks.push(event.data);
    return handleSaveRecording();
  }
};

const handleSaveRecording = async () => {
  const blob = new Blob(chunks, { type: chunks[0].type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = recordingName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  chunks = [];
  recordingName = "";
  return true;
};

export const handleStartRecording = async (setRecording, name) => {
  try {
    const localStreamstream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
      preferCurrentTab: true,
    });

    stream = localStreamstream;
    stream.addEventListener("inactive", () => {
      handleStopRecording();
      setRecording(false);
    });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    recordingName = name;
    return true;
  } catch (error) {
    console.error("Error starting recording", error);
    return false;
  }
};
