import { HYDRATE } from "next-redux-wrapper";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import { SAVE_USER_DATA } from "../../Types/Users/DataTypes";

const intialState = {};

export const DataReducer = (state = intialState, action) => {
  const data = action.data || action.payload;

  switch (action.type) {
    case SAVE_USER_DATA: {
      return { ...state, ...data };
    }
    case HYDRATE: {
      return { ...state, ...data.user.data };
    }

    case DELETE_ALL: {
      return intialState;
    }

    default: {
      return state;
    }
  }
};
