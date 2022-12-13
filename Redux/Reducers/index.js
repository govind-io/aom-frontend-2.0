import { combineReducers } from "redux";
import { CompsReducer } from "./Comps";
import { DeviceReducer } from "./Device";
import { UserReducer } from "./User";

export const rootReducer = combineReducers({
  user: UserReducer,
  comps: CompsReducer,
  device: DeviceReducer
});
