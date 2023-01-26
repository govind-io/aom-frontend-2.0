import { all, call, put, takeLatest } from "redux-saga/effects";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { DeleteAll } from "../../Actions/DeleteAll";
import { SaveRoomData } from "../../Actions/Room/RoomDataAction";
import { SaveUserData } from "../../Actions/User/DataAction";
import { CREATE_ROOM, GET_ROOM_DETAILS } from "../../Types/Users/RoomTypes";

function* GetRoomDetailsSaga({ data }) {
  let apiConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data?.token}`,
    },
    url: `room/${data.data.meetingId}/generate-token`,
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

function* CreateRoomSaga({ data }) {
  console.log("room saga called");
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

  yield put(
    SaveRoomData({
      ...response.data.data,
    })
  );

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data);
}

export const roomDataSaga = all([
  takeLatest(GET_ROOM_DETAILS, GetRoomDetailsSaga),
  takeLatest(CREATE_ROOM, CreateRoomSaga),
]);
