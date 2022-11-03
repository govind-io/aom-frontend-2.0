import { SAVE_USER_DATA } from "../../Types/Users/DataTypes";

export const SaveUserData = (data) => ({
  data,
  type: SAVE_USER_DATA,
});
