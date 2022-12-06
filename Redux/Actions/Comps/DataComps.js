import {
  CHANGE_PARTICIPANTS_COUNT,
  CHANGE_UNREAD_MESSAGE_COUNT,
} from "../../Types/Users/CompsType";

export const ChangeParticipantCounts = (data) => ({
  type: CHANGE_PARTICIPANTS_COUNT,
  data,
});

export const ChangeUnreadMessageCount = (data) => ({
  type: CHANGE_UNREAD_MESSAGE_COUNT,
  data,
});
