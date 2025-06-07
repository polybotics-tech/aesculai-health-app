import { combineReducers } from "redux";
import appSlice from "./slice/app.slice";
import chatSlice from "./slice/chat.slice";

const reducer = combineReducers({
  app: appSlice.reducer,
  chat: chatSlice.reducer,
});

export default reducer;
