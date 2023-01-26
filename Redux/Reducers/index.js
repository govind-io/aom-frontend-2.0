import { combineReducers } from "redux";
import { CompsReducer } from "./Comps";
import { RoomReducer } from "./Room/RoomDataReducer";
import { UserReducer } from "./User";

export const rootReducer = combineReducers({
  user: UserReducer,
  comps: CompsReducer,
  room: RoomReducer,
});
