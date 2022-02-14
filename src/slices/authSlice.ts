import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth } from '../services/authService';

interface AuthState {
  token: string | null;
  username: string | null;
}

const initialState: AuthState = {
  username: null,
  token: null,
};

const authWithUsername = createAsyncThunk(
  'auth/authWithUsername',
  async (username: string) => {
    const response = await auth(username);
    return response;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authWithUsername.fulfilled, (state, action) => {
      if (action.payload) {
        state.username = action.payload.username;
        state.token = action.payload.token;
      }
    });
  },
});

export default authSlice.reducer;
export { authWithUsername };
