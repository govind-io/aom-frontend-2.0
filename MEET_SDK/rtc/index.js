import { Device } from "mediasoup-client"
import { RTCEvents } from "../configs/SETTINGS"
import { globalSocket } from "../socket"

export let globalDevice


const PeersData = {}
let selfProducer


export const CreateRtcClient = () => new Promise((resolve, reject) => {
    const socket = globalSocket

    if (!socket?.connected) {
        reject("You must call ConnectMeet first before CreatingRtcClient")
    }

    const timer = setTimeout(() => {
        reject("Could not create a device")
    }, [10 * 1000])

    socket.emit("get-rtp-capabilities", async ({ routerRtpCapabilities }) => {
        const device = new Device()
        globalDevice = device
        await device.load({ routerRtpCapabilities })
        clearTimeout(timer)

        //adding custom methods here
        device.on = EventListenerFunc

        device.produceTracks = handleProduceTracks

        resolve(device)
    })

})


const EventListenerFunc = async (eventName, callback) => {
    switch (eventName) {
        case RTCEvents["user-published"]:
            handleUserPublishedEvent(callback)
            break;

        default:
            break;
    }

}


const handleUserPublishedEvent = async () => {
    const socket = globalSocket
}


const handleProduceTracks = (data) => {

    return new Promise((resolve, reject) => {
        if (!data) return reject(new Error("Atleast one of the tracks is required"))

        const audioTracks = data.audioTracks
        const videoTracks = data.videoTracks

        const socket = globalSocket
        const device = globalDevice


        if (socket.role !== "host") return reject(new Error("Only Hosts can Publish"))

        socket.emit("create-producer-transport", async (data, error) => {
            if (error) {
                return reject(error)
            }

            const producerTransport = await device.createSendTransport(data)

            selfProducer = producerTransport

            resolve(selfProducer)
        })
    })




}