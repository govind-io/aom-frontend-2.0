import { all, call, put, takeLatest } from "redux-saga/effects";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { DeleteAll } from "../../Actions/DeleteAll";
import {
  DeleteRoomData,
  SaveRoomData,
} from "../../Actions/Room/RoomDataAction";
import {
  CREATE_ROOM,
  DELETE_ROOM,
  GET_ALL_ROOM,
  GET_ROOM_COUNT_FOR_MONTH,
  GET_ROOM_DETAILS,
  GET_ROOM_MESSAGES,
  MUTE_ALL_USERS,
  SEND_ROOM_MESSAGE,
} from "../../Types/Users/RoomTypes";

function* GetRoomDetailsSaga({ data }) {
  let apiConfig = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data?.token}`,
    },
    url: `room/${data.data.meetingId}/generate-token`,
    data: data.data,
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Found room succefully"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed(response);
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed(response);
  }

  yield put(SaveRoomData(response.data.data));

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

function* DeleteRoomSaga({ data }) {
  let apiConfig = {
    method: "DELETE",
    url: `room/${data.data.meetingId}`,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Meeting Ended Successfully"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  yield put(DeleteRoomData());

  if (!data.onSuccess) return;

  return data.onSuccess(response.data);
}

function* CreateRoomSaga({ data }) {
  let apiConfig = {
    method: "POST",
    url: `room/create-room`,
    data: data.data,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "New Meeting Created Succefully"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  yield put(SaveRoomData(response.data.data));

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

function* GetAllRoom({ data }) {
  let apiConfig = {
    method: "GET",
    url: `room?startDate=${data.data.startDate}`,
    data: data.data,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Fetched Meetings"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

function* GetRoomCountForMonthSaga({ data }) {
  let apiConfig = {
    method: "GET",
    url: `room/rooms-count?month=${data.data.month}`,
    data: data.data,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Fetched meeting count for month"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

function* SendRoomMessageSaga({ data }) {
  let apiConfig = {
    method: "post",
    url: `room/${data.meetingId}/message`,
    data: data.data,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Sending Message"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

function* GetRoomMessageSaga({ data }) {
  let apiConfig = {
    method: "get",
    url: `room/${data.data.meetingId}/message?limit=${data.data.limit}&skip=${data.data.skip}`,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Fetching Messages"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

function* MuteAllSaga({ data }) {
  let apiConfig = {
    method: "get",
    url: `room/${data.data.meetingId}/mute-all`,
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data.token}`,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    false,
    "Muted all users"
  );

  if (response.logout) {
    yield put(DeleteAll());
    if (!data.onFailed) return;
    data.onFailed();
  }

  if (!response.res || !response.success) {
    if (!data.onFailed) return;
    return data.onFailed();
  }

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

export const roomDataSaga = all([
  takeLatest(GET_ROOM_DETAILS, GetRoomDetailsSaga),
  takeLatest(CREATE_ROOM, CreateRoomSaga),
  takeLatest(DELETE_ROOM, DeleteRoomSaga),
  takeLatest(GET_ALL_ROOM, GetAllRoom),
  takeLatest(GET_ROOM_COUNT_FOR_MONTH, GetRoomCountForMonthSaga),
  takeLatest(SEND_ROOM_MESSAGE, SendRoomMessageSaga),
  takeLatest(GET_ROOM_MESSAGES, GetRoomMessageSaga),
  takeLatest(MUTE_ALL_USERS, MuteAllSaga),
]);
