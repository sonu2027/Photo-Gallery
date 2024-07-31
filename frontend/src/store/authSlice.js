import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: {
    userId: null,
    userProfilePhoto: "",
    fullName: "",
    email: "",
    username: "",
    password: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("action: ", action);
      state.status = true;
      state.userData.userId = action.payload.userId;
      state.userData.userProfilePhoto = action.payload.userProfilePhoto;
      state.userData.fullName = action.payload.fullName;
      state.userData.email = action.payload.email;
      state.userData.username = action.payload.username;
      state.userData.password = action.payload.password;
    },
    logout: (state) => {
      state.status = false;
      state.userData.userId = null;
      state.userData.userProfilePhoto = "";
      state.userData.fullName = "";
      state.userData.email = "";
      state.userData.username = "";
      state.userData.password = "";
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
