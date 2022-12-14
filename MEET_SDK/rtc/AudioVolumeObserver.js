export class AudioVolumeObserver {

    constructor(ref) {
        this.enabled = false
        this.socket = ref.rtmClient
    }

    init() {
        return new Promise((resolve, reject) => {
            const ping = setTimeout(() => {
                reject("TimedOut Enabling")
                this.enabled = false
            }, [2000])

            this.socket.emit("enable-volume-observer", (e) => {
                if (e) {
                    clearTimeout(ping)
                    return reject(e)
                }
                clearTimeout(ping)
                resolve(true)
                this.enabled = true
            })
        })

    }

    enabled = false

    socket

    onVolume(callback) {
        this.socket?.on("volumes", volumes => callback(volumes))
    }
}