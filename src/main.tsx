import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ChatService from './services/chatService';
import { Provider } from 'react-redux';
import { store } from './store';
import { authWithUsername } from './slices/chatSlice';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
