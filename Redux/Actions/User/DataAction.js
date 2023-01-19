import {
  GET_USER_DATA,
  LOG_IN_ANONYMOUS,
  SAVE_USER_DATA,
} from "../../Types/Users/DataTypes";

export const SaveUserData = (data) => ({
  data,
  type: SAVE_USER_DATA,
});

export const GetUserData = (data) => ({ type: GET_USER_DATA, data });

export const LogInAnoynmous = (data) => ({
  type: LOG_IN_ANONYMOUS,
  data,
});
