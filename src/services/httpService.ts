import { AddMessagePayload } from '../slices/chatsSlice';
const API_URL = import.meta.env.VITE_API_URL;

export function auth(username: string): Promise<{ token: string; username: string } | null> {
  return fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
    }),
  }).then((res: Response) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });
}

export type SendMessageResponse = {
  clientId: string;
} & AddMessagePayload;

export function sendMessage(
  to: string,
  message: string,
  token: string
): Promise<SendMessageResponse> {
  return fetch(`${API_URL}/chats/${encodeURIComponent(to)}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      message,
    }),
  }).then((res: Response) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });
}
