export const DEBUG_LOGS = 1;


export const NotHost = (ref) => {
    return ref.role !== "host"
}

export const NotJoined = (ref) => {
    console.log("user joined state ", ref.rtmClient?.connected)

    if (!ref.rtmClient) return true

    return !ref.rtmClient.connected
}