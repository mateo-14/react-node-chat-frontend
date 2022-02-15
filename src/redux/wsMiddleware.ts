import { Middleware } from '@reduxjs/toolkit';
import { ChatWebSockets } from '../services/wsService';
import { authWithUsername } from '../slices/authSlice';
import { addMessage, createChat } from '../slices/chatsSlice';
import { addUser, removeUser, setUsers } from '../slices/usersSlice';
import { RootState } from './store';

export const wsMiddleware: Middleware<{}, RootState> = (storeApi) => {
  let chatWebSockets: ChatWebSockets;
  return (next) => (action) => {
    if (action.type === authWithUsername.fulfilled.type) {
      chatWebSockets?.close();
      chatWebSockets = new ChatWebSockets(action.payload.token);
      chatWebSockets.subscribe((msg) => {
        switch (msg.type) {
          case 'auth':
            console.log(msg);
            storeApi.dispatch(setUsers(msg.payload.users));
            break;
          case 'user_connected':
            storeApi.dispatch(addUser(msg.payload.user));
            break;
          case 'user_disconnected':
            storeApi.dispatch(removeUser(msg.payload.user));
            break;
          case 'new_message':
            const chat = storeApi.getState().chats.some((chat) => chat.user === msg.payload.author);
            if (!chat) storeApi.dispatch(createChat(msg.payload.author));
            
            storeApi.dispatch(addMessage(msg.payload));
            break;
          default:
            return;
        }
      });
    }
    return next(action);
  };
};
