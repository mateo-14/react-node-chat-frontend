import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';
import './InitialScreen.css';

function InitialScreen() {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value.trim());
  };

  useEffect(() => {
    setIsValid(username.length > 2);
  }, [username]);

  return (
    <div className="initial-screen">
      <form>
        <input
          className="username-input"
          type="text"
          placeholder="Enter your username"
          ref={inputRef}
          onBlur={handleBlur}
          onChange={handleChange}
          value={username}
          maxLength={14}
        />
      </form>
      <p className={`help-text ${!isValid ? 'hidden' : ''}`}>Press enter to continue</p>
    </div>
  );
}

export default InitialScreen;
