import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sendMessage as sendMessageService } from '../services/httpService';
import { RootState } from '../redux/store';
import type { SendMessageResponse } from '../services/httpService';

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
};

type ChatState = Chat[];

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

const initialState: ChatState = [];
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

export const chatsSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatDraftMessage: (state, { payload }: PayloadAction<WriteMessagePayload>) => {
      const chat: Chat | undefined = state.find((chat) => chat.user === payload.user);
      if (chat) chat.draftMessage = payload.text;
    },
    createChat: (state, { payload }: PayloadAction<string>) => {
      if (!state.some((chat) => chat.user === payload))
        state.push({ user: payload, draftMessage: '', messages: [] });
    },
    deleteChat: (state, { payload }: PayloadAction<string>) =>
      state.filter((chat) => chat.user !== payload),
    addMessage: (state, { payload }: PayloadAction<AddMessagePayload>) => {
      const chat: Chat | undefined = state.find((chat) => chat.user === payload.author);
      if (chat) chat.messages.push({ ...payload, hasError: false, pending: false });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.pending, (state, { meta }) => {
      const chat: Chat | undefined = state.find((chat) => chat.user === meta.arg.to);
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
      const chat: Chat | undefined = state.find((chat) => chat.user === payload.to);
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
      const chat: Chat | undefined = state.find((chat) => chat.user === meta.arg.to);
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

export const { setChatDraftMessage, createChat, deleteChat, addMessage } = chatsSlice.actions;
export { sendMessage };
export default chatsSlice.reducer;
