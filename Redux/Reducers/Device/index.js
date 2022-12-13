import { HYDRATE } from "next-redux-wrapper";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import { UPDATE_DEVICE_ID } from "../../Types/Users/DataTypes";

const initialState = {
    id: ""
}

export const DeviceReducer = (state = initialState, action) => {
    const data = action.payload || action.data

    switch (action.type) {
        case UPDATE_DEVICE_ID:
            return { ...state, id: data }

        case HYDRATE: {
            return { ...state, ...data.device };
        }

        case DELETE_ALL: {
            return initialState;
        }

        default: {
            return state;
        }
    }
}