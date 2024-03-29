import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Adjusted import statement
import rootReducer from "./reducer";
// import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  (applyMiddleware(...middleware))
);

export default store;
