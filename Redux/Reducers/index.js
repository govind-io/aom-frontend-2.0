import { combineReducers } from "redux";
import { CompsReducer } from "./Comps";
import { UserReducer } from "./User";

export const rootReducer = combineReducers({
  user: UserReducer,
  comps: CompsReducer,
});
