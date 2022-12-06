import { combineReducers } from "redux";
import { CollapsibleCompsReducer } from "./CollapsibleComps";
import { DataCompsReducer } from "./DataComps";

export const CompsReducer = combineReducers({
  comp: CollapsibleCompsReducer,
  dataComp: DataCompsReducer,
});
