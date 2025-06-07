import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  lastUpdated: null,
  maxCacheLimit: Number(2 * 24 * 60 * 60 * 1000), //2days limit
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    _Action_addMessage: (state, action) => {
      const { message } = action.payload;

      if (message && message.text) {
        state.messages.push(message); //add new message to the chat
        state.lastUpdated = Date.now();
      }
    },
    _Action_clearMessage: (state) => {
      state.messages = [];
      state.lastUpdated = Date.now();
    },
  },
});

export const { _Action_addMessage, _Action_clearMessage } = chatSlice.actions;
export default chatSlice;
