export const handleUserJoined = (ref, callback) => {
  const socket = ref.rtmClient;
  socket?.off("rtc-user-joined");
  socket?.on("rtc-user-joined", (user) => {
    callback(user);
  });
};

export const handleUserLeft = (ref, callback) => {
  const socket = ref.rtmClient;
  socket?.off("user-left");
  socket?.on("user-left", (user) => {
    callback(user);
  });
};
