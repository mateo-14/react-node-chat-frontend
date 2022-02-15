import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UsersState = string[];
const initialState: UsersState = [];

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (_, { payload }: PayloadAction<string[]>) => payload,
    addUser: (state, { payload }: PayloadAction<string>) => {
      if (state.includes(payload)) return;
      state.push(payload);
    },
    removeUser: (state, { payload }: PayloadAction<string>) =>
      state.filter((user) => user !== payload),
  },
});

export const { setUsers, addUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;
