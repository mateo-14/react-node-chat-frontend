import { combineReducers, configureStore } from '@reduxjs/toolkit';
import chatsReducer from '../slices/chatsSlice';
import authReducer from '../slices/authSlice';
import { wsMiddleware } from './wsMiddleware';
import usersSlice from '../slices/usersSlice';

const rootReducer = combineReducers({ chats: chatsReducer, auth: authReducer, users: usersSlice });
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wsMiddleware),
});

export type AppDispatch = typeof store.dispatch;
