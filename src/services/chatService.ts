import type { AddMessagePayload } from '../slices/chatSlice';
const API_URL = import.meta.env.VITE_API_URL;

type AuthMsg = {
  type: 'auth';
  payload: { authenticated: boolean };
};

type NewMessageMsg = {
  type: 'new_message';
  payload: AddMessagePayload;
};

type UserDisconnectMsg = {
  type: 'user_disconnect';
  payload: { user: string };
};

type PingMsg = {
  type: 'pong';
};

type WebSocketMessage = AuthMsg | NewMessageMsg | UserDisconnectMsg | PingMsg;

type WebSocketSubscriber = (msg: WebSocketMessage) => void;

export class ChatWebSockets {
  #token: string | null;
  #ws: WebSocket | undefined;
  #isTokenValid: boolean | undefined;
  #subscribers: Set<WebSocketSubscriber>;

  constructor(token: string) {
    this.#token = token;
    this.#connect();
    this.#subscribers = new Set();
  }

  #connect() {
    console.log('Connecting to socket');
    this.#ws = new WebSocket(import.meta.env.VITE_WS_URL);
    this.#ws.onopen = () => {
      console.log('On socket open');
      this.#auth();
    };

    this.#ws.onclose = () => {
      if ((this.#isTokenValid || this.#isTokenValid === undefined) && this.#token) {
        setTimeout(this.#connect.bind(this), 2000);
      }
    };

    this.#ws.onerror = () => {
      this.#ws?.close();
    };

    this.#ws.onmessage = (e) => {
      try {
        const data: WebSocketMessage = JSON.parse(e.data);
        if (data.type === 'auth') {
          console.log('Authenticated successful', data.payload.authenticated);
          this.#isTokenValid = data.payload.authenticated;
          this.#ping();
        }

        if (data.type === 'pong') {
          this.#ping();
        }

        this.#subscribers.forEach((subscriber) => subscriber(data));
      } catch {}
    };
  }

  #ping() { // Avoid heroku timeout
    setTimeout(() => {
      if (this.#ws?.readyState === WebSocket.OPEN) this.#ws?.send('ping');
    }, 30000);
  }

  #auth() {
    if (this.#ws?.readyState === WebSocket.OPEN)
      this.#ws.send(JSON.stringify({ type: 'auth', payload: this.#token }));
  }

  subscribe(subscriber: WebSocketSubscriber) {
    this.#subscribers.add(subscriber);
  }

  unsubscribe(subscriber: WebSocketSubscriber) {
    this.#subscribers.delete(subscriber);
  }

  close() {
    this.#token = null;
    this.#ws?.close();
  }
}

export function getUsers(token: string): Promise<string[]> {
  return fetch(`${API_URL}/chats/users`, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  }).then((res: Response) => (res.ok ? res.json() : null));
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
