import { combineReducers } from "redux";
import { CollapsibleCompsReducer } from "./CollapsibleComps";

export const CompsReducer = combineReducers({
  comp: CollapsibleCompsReducer,
});
