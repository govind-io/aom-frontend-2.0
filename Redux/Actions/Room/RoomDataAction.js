import {
  CREATE_ROOM,
  GET_ROOM_DETAILS,
  SAVE_ROOM_DATA,
} from "../../Types/Users/RoomTypes";

export const GetRoomDetails = (data) => ({ type: GET_ROOM_DETAILS, data });
export const CreateRoom = (data) => ({ type: CREATE_ROOM, data });
export const SaveRoomData = (data) => ({ type: SAVE_ROOM_DATA, data });
