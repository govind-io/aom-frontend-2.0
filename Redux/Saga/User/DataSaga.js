import { all, call, put, takeLatest } from "redux-saga/effects";
import { SecureApiHandler } from "../../../Utils/ApiUtilities/SecureApiHandler";
import { Tokens } from "../../../Utils/Configs/ApiConfigs";
import { SaveUserData } from "../../Actions/User/DataAction";
import { GET_USER_DATA, LOG_IN_ANONYMOUS } from "../../Types/Users/DataTypes";

function* GetUserSaga({ data }) {
  let apiConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Tokens.refresh || data.data?.token}`,
    },
    url: "user",
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    true,
    "Khulke Login Success"
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
    SaveUserData({
      ...response.data,
      token: Tokens.refresh || data.data?.token,
    })
  );

  if (!data.onSuccess) return;

  return data.onSuccess();
}

function* LogInAnoynmous({ data }) {
  const ip_address =
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255);

  let apiConfig = {
    method: "POST",
    baseurl: `${process.env.KHULKE_USER_BASE_URL}/anonymous_user_entry/`,
    data: {
      deviceinfo: {
        device_name: navigator.userAgent,
        platform: navigator.platform,
        platform_version: "v1",
        app_version: "1",
        ip_address,
      },
    },
    headers: {
      Authorization: process.env.KHULKE_STATIC_TOKEN,
    },
  };

  let response = yield call(
    SecureApiHandler,
    apiConfig,
    true,
    "Guest Login Sucess"
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
    SaveUserData({
      ...response.data.data[0],
    })
  );

  if (!data.onSuccess) return;

  return data.onSuccess(response.data.data[0]);
}

export const userDataSaga = all([
  takeLatest(GET_USER_DATA, GetUserSaga),
  takeLatest(LOG_IN_ANONYMOUS, LogInAnoynmous),
]);
