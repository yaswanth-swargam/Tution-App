import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,

  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },

    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },


    setLoggingIn: (state, action) => {
      state.isLoggingIn = action.payload;
    },

    setUpdatingProfile: (state, action) => {
      state.isUpdatingProfile = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setCheckingAuth,
  setLoggingIn,
  setUpdatingProfile,
} = authSlice.actions;

export default authSlice.reducer;