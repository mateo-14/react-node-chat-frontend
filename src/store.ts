import { combineReducers, configureStore } from '@reduxjs/toolkit';
import chatReducer, { chatMiddleware } from './slices/chatSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({ chat: chatReducer, auth: authReducer });
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatMiddleware),
});

export type AppDispatch = typeof store.dispatch;
