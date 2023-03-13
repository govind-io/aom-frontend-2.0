import {
  CREATE_ROOM,
  DELETE_ROOM,
  DELETE_ROOM_DATA,
  GET_ALL_ROOM,
  GET_ROOM_DETAILS,
  SAVE_ROOM_CONTROLS,
  SAVE_ROOM_DATA,
  SAVE_ROOM_LAYOUT,
  SAVE_ROOM_META_DATA,
  GET_ROOM_COUNT_FOR_MONTH,
  SEND_ROOM_MESSAGE,
  GET_ROOM_MESSAGES,
  MUTE_ALL_USERS,
} from "../../Types/Users/RoomTypes";

export const GetRoomDetails = (data) => ({ type: GET_ROOM_DETAILS, data });
export const CreateRoom = (data) => ({ type: CREATE_ROOM, data });
export const SaveRoomData = (data) => ({ type: SAVE_ROOM_DATA, data });
export const SaveRoomLayout = (data) => ({ data, type: SAVE_ROOM_LAYOUT });
export const SaveRoomControls = (data) => ({ data, type: SAVE_ROOM_CONTROLS });
export const SaveRoomMetaData = (data) => ({ data, type: SAVE_ROOM_META_DATA });
export const DeleteRoom = (data) => ({ data, type: DELETE_ROOM });
export const DeleteRoomData = () => ({ type: DELETE_ROOM_DATA });
export const GetAllRoom = (data) => ({ type: GET_ALL_ROOM, data });
export const GetRoomCountForMonth = (data) => ({
  data,
  type: GET_ROOM_COUNT_FOR_MONTH,
});
export const SendRoomMessage = (data) => ({ type: SEND_ROOM_MESSAGE, data });
export const GetRoomMessage = (data) => ({ data, type: GET_ROOM_MESSAGES });
export const MuteAllUsers = (data) => ({ data, type: MUTE_ALL_USERS });
