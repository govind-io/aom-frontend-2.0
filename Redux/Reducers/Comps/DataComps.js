import { HYDRATE } from "next-redux-wrapper";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import {
  CHANGE_PARTICIPANTS_COUNT,
  CHANGE_UNREAD_MESSAGE_COUNT,
} from "../../Types/Users/CompsType";

const intialState = {
  participants: 0,
  chat: 0,
};

export const DataCompsReducer = (state = intialState, action) => {
  const data = action.data || action.payload;
  switch (action.type) {
    case CHANGE_UNREAD_MESSAGE_COUNT:
      return {
        ...state,
        chat:
          parseInt(data) == 0 || !data
            ? 0
            : parseInt(state.chat) + parseInt(data),
      };

    case CHANGE_PARTICIPANTS_COUNT:
      return { ...state, participants: data };

    case HYDRATE: {
      return { ...state, ...data.comps.comp };
    }

    case DELETE_ALL: {
      return intialState;
    }

    default: {
      return state;
    }
  }
};
