import { createWrapper } from "next-redux-wrapper";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "../Reducers";
import rootSaga from "../Saga";

function saveToLocalStorage(state) {
  try {
    const serialState = JSON.stringify(state);
    localStorage.setItem("persistState", serialState);
  } catch (e) {
    console.warn(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serialState = localStorage.getItem("persistState");

    if (serialState === null) return undefined;

    const state = JSON.parse(serialState);

    state.room.controls = { video: false, audio: false, screen: false };

    return state;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];

  if (!process.env.PROD) {
    middlewares.push(logger);
  }

  const store = createStore(
    rootReducer,
    loadFromLocalStorage(),
    applyMiddleware(...middlewares)
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  try {
    store.subscribe(() => saveToLocalStorage(store.getState()));
  } catch (e) {}

  return store;
};

export const wrapper = createWrapper(makeStore);
