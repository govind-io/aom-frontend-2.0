import { TOGGLE_CHAT, TOGGLE_PARTICIPANTS } from "../../Types/Users/CompsType";

export const ToggleParticpantsList = (data) => ({
  data,
  type: TOGGLE_PARTICIPANTS,
});

export const TogglChatList = (data) => ({
  data,
  type: TOGGLE_CHAT,
});
