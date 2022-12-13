export const handleUserJoined = (ref, callback) => {
  const socket = ref.rtmClient;
  socket?.off("rtc-user-joined");
  socket?.on("rtc-user-joined", (user) => {
    callback(user);
  });
};

let userJoinedFunction;

export const handleUserLeft = (ref, callback) => {
  const socket = ref.rtmClient;

  userJoinedFunction = (user) => {
    callback(user);
  };

  if (userJoinedFunction) {
    socket?.off("user-left", userJoinedFunction);
    console.log("turned of user-left")
  }

  socket?.on("user-left", userJoinedFunction);
};
