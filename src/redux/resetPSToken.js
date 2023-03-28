import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rsToken: "",
  }

export const resetPSToken = createSlice({
  name: 'rsToken',
  initialState,
  reducers: {
    updateResetPSToken: (state, action) => {
      state.rsToken = action.payload;
    },
    exit: () => {
      return {};
    }
  }
})

export const {updateResetPSToken, exit} = resetPSToken.actions;
export const selectResetPSToken = (state) => state.rsToken;

export default resetPSToken.reducer;