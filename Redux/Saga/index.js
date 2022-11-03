import { all } from "redux-saga/effects";

import { userDataSaga } from "./User/DataSaga";

export default function* rootSaga() {
  return yield all([userDataSaga]);
}
