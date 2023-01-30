import {
  CREATE_ROOM,
  GET_ROOM_DETAILS,
  SAVE_ROOM_CONTROLS,
  SAVE_ROOM_DATA,
  SAVE_ROOM_LAYOUT,
} from "../../Types/Users/RoomTypes";

export const GetRoomDetails = (data) => ({ type: GET_ROOM_DETAILS, data });
export const CreateRoom = (data) => ({ type: CREATE_ROOM, data });
export const SaveRoomData = (data) => ({ type: SAVE_ROOM_DATA, data });
export const SaveRoomLayout = (data) => ({ data, type: SAVE_ROOM_LAYOUT });
export const SaveRoomControls = (data) => {
  console.log("room controls saved to ", data);

  return { data, type: SAVE_ROOM_CONTROLS };
};
