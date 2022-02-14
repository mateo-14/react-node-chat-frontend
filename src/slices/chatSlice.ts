import { createAsyncThunk, createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { ChatWebSockets, sendMessage as sendMessageService } from '../services/chatService';
import { RootState } from '../store';
import type { SendMessageResponse } from '../services/chatService';
import { authWithUsername } from './authSlice';

type Message = {
  requestId?: string;
  id?: string;
  message: string;
  author: string;
  timestamp?: number;
  pending: boolean;
  hasError: boolean;
};

export type Chat = {
  user: string;
  messages: Message[];
  draftMessage: string;
  online: boolean;
};

type ChatState = {
  chats: Chat[];
};

type WriteMessagePayload = {
  user: string;
  text: string;
};

type SendMessagePayload = {
  to: string;
  message: string;
  author: string;
};

export type AddMessagePayload = {
  author: string;
  message: string;
  timestamp: number;
  to: string;
  id: string;
};

const initialState: ChatState = {
  chats: [],
};

const sendMessage = createAsyncThunk<SendMessageResponse, SendMessagePayload, { state: RootState }>(
  'chats/sendMessage',
  async (payload, thunkAPI) => {
    const message = await sendMessageService(
      payload.to,
      payload.message,
      thunkAPI.getState().auth.token || ''
    );
    return message;
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatDraftMessage: (state, { payload }: PayloadAction<WriteMessagePayload>) => {
      const chat: Chat | undefined = state.chats.find((chat) => chat.user === payload.user);
      if (chat) chat.draftMessage = payload.text;
    },
    createChat: (state, { payload }: PayloadAction<string>) => {
      if (!state.chats.some((chat) => chat.user === payload))
        state.chats.push({ user: payload, draftMessage: '', messages: [], online: true });
    },
    deleteChat: (state, { payload }: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.user !== payload);
    },
    addMessage: (state, { payload }: PayloadAction<AddMessagePayload>) => {
      let chat: Chat | undefined = state.chats.find((chat) => chat.user === payload.author);
      if (!chat) {
        const length = state.chats.push({
          user: payload.author,
          messages: [],
          draftMessage: '',
          online: true,
        });
        chat = state.chats[length - 1];
      }

      chat.messages.push({ ...payload, hasError: false, pending: false });
    },
    setOffline: (state, { payload }: PayloadAction<string>) => {
      const chat: Chat | undefined = state.chats.find((chat) => chat.user === payload);
      if (chat) chat.online = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.pending, (state, { meta }) => {
      const chat: Chat | undefined = state.chats.find((chat) => chat.user === meta.arg.to);
      if (chat) {
        chat.draftMessage = '';
        chat.messages.push({
          author: meta.arg.author,
          pending: true,
          hasError: false,
          message: meta.arg.message,
          requestId: meta.requestId,
        });
      }
    });
    builder.addCase(sendMessage.fulfilled, (state, { payload, meta }) => {
      const chat: Chat | undefined = state.chats.find((chat) => chat.user === payload.to);
      if (chat) {
        const message = chat.messages.find((message) => message.requestId === meta.requestId);
        if (message) {
          message.pending = false;
          message.timestamp = payload.timestamp;
          message.id = payload.id;
        }
      }
    });
    builder.addCase(sendMessage.rejected, (state, { meta }) => {
      const chat: Chat | undefined = state.chats.find((chat) => chat.user === meta.arg.to);
      if (chat) {
        const message = chat.messages.find((message) => message.requestId === meta.requestId);
        if (message) {
          message.pending = false;
          message.hasError = true;
        }
      }
    });
  },
});

export const chatMiddleware: Middleware<{}, RootState> = (storeApi) => {
  let chatWebSockets: ChatWebSockets;
  return (next) => (action) => {
    if (action.type === authWithUsername.fulfilled.type) {
      chatWebSockets?.close();
      chatWebSockets = new ChatWebSockets(action.payload.token);
      chatWebSockets.subscribe((msg) => {
        if (msg.type === 'new_message') {
          storeApi.dispatch(chatSlice.actions.addMessage(msg.payload));
        } else if (msg.type === 'user_disconnect') {
          storeApi.dispatch(chatSlice.actions.setOffline(msg.payload.user));
        }
      });
    }
    return next(action);
  };
};

export const { setChatDraftMessage, createChat, deleteChat } = chatSlice.actions;
export { sendMessage };
export default chatSlice.reducer;
