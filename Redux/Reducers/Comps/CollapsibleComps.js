import { HYDRATE } from "next-redux-wrapper";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import { TOGGLE_CHAT, TOGGLE_PARTICIPANTS } from "../../Types/Users/CompsType";

const intialState = {
  participants: false,
  chat: false,
};

export const CollapsibleCompsReducer = (state = intialState, action) => {
  const data = action.data || action.payload;
  switch (action.type) {
    case TOGGLE_PARTICIPANTS:
      return {
        ...state,
        participants: !state.participants,
        chat: !state.participants ? false : state.chat,
      };

    case TOGGLE_CHAT: {
      return {
        ...state,
        chat: !state.chat,
        participants: !state.chat ? false : state.participants,
      };
    }
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
