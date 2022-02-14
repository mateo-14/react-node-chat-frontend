import { useState } from 'react';
import ChatScreen from './components/ChatScreen';
import InitialScreen from './components/InitialScreen';
import './App.css';

function App() {
  const [isLogged, setIsLogged] = useState(false);

  const changeScreen = () => {
    setIsLogged(true);
  };

  return isLogged ? <ChatScreen /> : <InitialScreen onLogged={changeScreen} />;
}

export default App;
