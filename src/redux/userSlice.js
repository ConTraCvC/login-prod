import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  roles: [],
  refreshToken: "",
  token: ""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.username = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updateRole: (state, action) => {
      state.roles = action.payload;
    },
    updateRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    updateJwtToken: (state, action) => {
      state.token = action.payload;
    },
    logOut: () => {
      return {};
    }
  }
})

export const {updateUser, updateEmail, updateRole,
  updateRefreshToken, updateJwtToken, logOut} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;