import type { AddMessagePayload } from '../slices/chatsSlice';

type AuthMsg = {
  type: 'auth';
  payload: { users: string[] };
};

type NewMessageMsg = {
  type: 'new_message';
  payload: AddMessagePayload;
};

type UserDisconnectedMsg = {
  type: 'user_disconnected';
  payload: { user: string };
};

type UserConnectedMsg = {
  type: 'user_connected';
  payload: { user: string };
};

type PingMsg = {
  type: 'pong';
};

type WebSocketMessage = AuthMsg | NewMessageMsg | UserDisconnectedMsg | PingMsg | UserConnectedMsg;

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
          console.log('Authenticated successful');
          this.#isTokenValid = true;
          this.#ping();
        }

        if (data.type === 'pong') {
          this.#ping();
        }

        this.#subscribers.forEach((subscriber) => subscriber(data));
      } catch {}
    };
  }

  #ping() {
    // Avoid heroku timeout
    setTimeout(() => {
      if (this.#ws?.readyState === WebSocket.OPEN) this.#ws?.send(JSON.stringify({ type: 'ping' }));
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
