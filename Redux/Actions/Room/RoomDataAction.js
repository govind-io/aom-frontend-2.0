import {
  CREATE_ROOM,
  GET_ROOM_DETAILS,
  SAVE_ROOM_CONTROLS,
  SAVE_ROOM_DATA,
  SAVE_ROOM_LAYOUT,
  SAVE_ROOM_META_DATA,
} from "../../Types/Users/RoomTypes";

export const GetRoomDetails = (data) => ({ type: GET_ROOM_DETAILS, data });
export const CreateRoom = (data) => ({ type: CREATE_ROOM, data });
export const SaveRoomData = (data) => ({ type: SAVE_ROOM_DATA, data });
export const SaveRoomLayout = (data) => ({ data, type: SAVE_ROOM_LAYOUT });
export const SaveRoomControls = (data) => ({ data, type: SAVE_ROOM_CONTROLS });
export const SaveRoomMetaData = (data) => ({ data, type: SAVE_ROOM_META_DATA });
