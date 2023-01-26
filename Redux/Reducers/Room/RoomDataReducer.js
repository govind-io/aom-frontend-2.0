import { HYDRATE } from "next-redux-wrapper";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import { SAVE_ROOM_DATA } from "../../Types/Users/RoomTypes";

const initialState = {
  name: "",
  meetingId: "",
  participants: "",
  messages: "",
  moderator: "",
};

export const RoomReducer = (state = initialState, action) => {
  const data = action.payload || action.data;

  switch (action.type) {
    case SAVE_ROOM_DATA:
      return { ...state, ...data };

    case HYDRATE: {
      return { ...state, ...data.room };
    }

    case DELETE_ALL: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
