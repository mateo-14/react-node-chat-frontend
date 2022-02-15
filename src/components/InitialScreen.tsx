import React, { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { authWithUsername } from '../slices/authSlice';
import classNames from 'classnames';
import './InitialScreen.css';

type InitialScreenProps = {
  onLogged: () => void;
};

function InitialScreen({ onLogged }: InitialScreenProps) {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isChangingScreen, setIsChangingScreen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setUsername(e.currentTarget.value.trim());
  };

  useEffect(() => {
    setIsValid(username.length > 2);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setIsLoading(true);
    dispatch(authWithUsername(username))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          setIsChangingScreen(true);
          setTimeout(onLogged, 1000);
        }, 1000);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  };

  return (
    <div className="initial-screen">
      <form onSubmit={handleSubmit}>
        <input
          className={`username-input ${isChangingScreen ? 'transition' : ''}`}
          type="text"
          placeholder="Enter your username"
          ref={inputRef}
          onBlur={handleBlur}
          onChange={handleChange}
          value={username}
          maxLength={14}
          disabled={isChangingScreen}
        />
      </form>
      <p
        className={classNames('info-text', {
          hidden: !isValid,
          error: hasError,
          loading: isLoading,
          transition: isChangingScreen,
        })}
      >
        {isLoading
          ? 'Loading...'
          : hasError
          ? 'An error has occurred :('
          : 'Press enter to continue'}
      </p>
    </div>
  );
}

export default InitialScreen;
