import { all } from "redux-saga/effects";
import { roomDataSaga } from "./Room/RoomDataSaga";

import { userDataSaga } from "./User/DataSaga";

export default function* rootSaga() {
  return yield all([userDataSaga, roomDataSaga]);
}
