import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authToken: localStorage.getItem('authToken') || null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.authToken = token;
      state.user = user;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.authToken = null;
      state.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;