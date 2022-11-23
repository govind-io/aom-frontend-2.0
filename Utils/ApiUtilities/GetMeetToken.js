import axios from "axios"
import { TOKEN } from "../../ENV.JS"
import { API_BASE_URL } from "../Configs/ApiConfigs"

import ToastHandler from "../Toast/ToastHandler"

export const GetMeetToken = async (room) => {

    try {
        const response = await axios({
            url: `${API_BASE_URL}/generate-token`,
            method: "POST",
            headers: {
                Authorization: TOKEN
            },
            data: {
                room
            }
        })

        if (response.status === 200) {
            return response.data.token
        }
        else {
            ToastHandler("dan", "Error getting Meet SDK token")
            return false
        }
    } catch (e) {
        ToastHandler("dan", e.message)
        return false
    }



}