import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "Aesculai Health App",
  theme: "light",
  color: {
    light: {
      primary: "#38B5E2",
      primaryFaded: "rgba(56, 181, 226, 0.08)",
      white: "#f7fbfc",
      gray50: "#f0f7fa",
      gray100: "#c1c7c9",
      gray200: "#757778",
      black: "#070808",
      success: "#81c784",
      successFaded: "rgba(28, 189, 74, 0.08)",
      error: "#e33241",
      errorFaded: "rgba(227, 50, 65, 0.08)",
    },
    dark: {
      primary: "#38B5E2",
      primaryFaded: "rgba(56, 181, 226, 0.07)",
      white: "#1e272e",
      gray50: "#2c3840",
      gray100: "#72828a",
      gray200: "#b0bec5",
      black: "#f5f5f5",
      success: "#81c784",
      successFaded: "rgba(28, 189, 74, 0.08)",
      error: "#e57373",
      errorFaded: "rgba(227, 50, 65, 0.08)",
    },
  },
  session: {},
  user: {},
  lastSignedIn: null,
  maxCacheLimit: Number(7 * 24 * 60 * 60 * 1000), //7days limit
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    _Action_toggleTheme: (state, action) => {
      const { theme } = action.payload;

      state.theme = theme;
    },
    _Action_updateSession: (state, action) => {
      const { session } = action.payload;

      state.session = session;

      if (session?.user && session?.user?.id) {
        state.lastSignedIn = Date.now(); //refresh last sign in date
      }
    },
    _Action_updateUser: (state, action) => {
      const { user } = action.payload;

      state.user = user;
    },
    _Action_clearSession: (state) => {
      if (state.session || state.session?.user) {
        state.session = {};
      }
      state.user = {};
      state.lastSignedIn = Date.now();
    },
  },
});

export const {
  _Action_toggleTheme,
  _Action_updateSession,
  _Action_updateUser,
  _Action_clearSession,
} = appSlice.actions;
export default appSlice;
