import { HYDRATE } from "next-redux-wrapper";
import { VIEWSTATUS } from "../../../Utils/Contants/Conditional";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import {
  DELETE_ROOM_DATA,
  SAVE_ROOM_CONTROLS,
  SAVE_ROOM_DATA,
  SAVE_ROOM_LAYOUT,
  SAVE_ROOM_META_DATA,
} from "../../Types/Users/RoomTypes";

const initialState = {
  data: {
    name: "",
    meetingId: "",
    participants: "",
    messages: "",
    moderator: "",
  },
  layout: {
    view: VIEWSTATUS.GALLERY,
    chat: false,
    particpants: false,
  },
  controls: {
    screen: false,
    audio: false,
    video: false,
  },
  metaData: {
    existingPresenter: false,
    volumes: {},
  },
};

export const RoomReducer = (state = initialState, action) => {
  const data = action.payload || action.data;

  switch (action.type) {
    case SAVE_ROOM_DATA:
      return { ...state, data: data };

    case SAVE_ROOM_CONTROLS:
      return { ...state, controls: { ...state.controls, ...data } };

    case SAVE_ROOM_LAYOUT:
      return { ...state, layout: { ...state.layout, ...data } };

    case SAVE_ROOM_META_DATA:
      return { ...state, metaData: { ...state.metaData, ...data } };

    case DELETE_ROOM_DATA:
      return initialState;

    case DELETE_ALL: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
