import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
};

const passwordReq = createSlice({
  name: "passwordReq",
  initialState,
  reducers: {
    userFound: (state, action) => {
      console.log("action: ", action);
      state.status = action.payload.status;
    },
  },
});

export const { userFound } = passwordReq.actions;

export default passwordReq.reducer;
