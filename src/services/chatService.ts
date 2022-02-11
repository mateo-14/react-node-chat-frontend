class ChatService {
  #token: string | null = null;
  #ws: WebSocket;

  constructor() {
    this.#ws = new WebSocket(`ws://localhost:8080`);

    this.#ws.onclose = (ev: CloseEvent) => {
      console.log(ev.code);
    };

    this.#ws.onerror = (ev) => {
      console.log(ev);
    };
  }

  auth(token: string) {
    this.#token = token;
    this.#auth();
  }

  #auth() {
    if (this.#ws.readyState === WebSocket.OPEN)
      this.#ws.send(JSON.stringify({ type: 'auth', payload: this.#token }));
  }

  reconnect() {}

  get state(): number {
    return this.#ws.readyState;
  }
}

export default ChatService;
