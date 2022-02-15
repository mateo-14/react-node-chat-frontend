import './ChatScreen.css';
import TextareaAutosize from 'react-textarea-autosize';
import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Button from './Button';
import { createChat, deleteChat, sendMessage, setChatDraftMessage } from '../slices/chatsSlice';
import classNames from 'classnames';
import UserList from './UserList';
import UserCard from './UserCard';
import { CSSTransition } from 'react-transition-group';
import { Chat } from '../slices/chatsSlice';

function ChatScreen() {
  const username = useAppSelector((state) => state.auth.username);
  const [inProp, setInProp] = useState(true);

  return (
    <>
      <MainChat />
      <CSSTransition
        timeout={{ enter: 1500, exit: 2500 }}
        in={inProp}
        appear={true}
        onEntered={() => setInProp(false)}
        unmountOnExit={true}
      >
        <div className="animating-screen">
          <p className="hello-text">👋🏻 Hello {username}</p>
        </div>
      </CSSTransition>
    </>
  );
}

function MainChat() {
  const dispatch = useAppDispatch();
  const [username, tag] = (useAppSelector((state) => state.auth.username) || '').split('#');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isUserListShowing, setIsUserListShowing] = useState<boolean>(false);
  const chats = useAppSelector((state) => state.chats);
  const selectedChat = chats.find((chat) => chat.user === selectedUser);

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
  };

  const handleAddUser = (user: string) => {
    if (user === selectedChat?.user) return;
    if (selectedChat && !selectedChat.messages.length) dispatch(deleteChat(selectedChat.user));
    
    if (!chats.some(chat => chat.user === user)) 
      dispatch(createChat(user));

    setSelectedUser(user);
  };

  const showUserList = () => {
    setIsUserListShowing(true);
  };

  const handleUserListClose = () => {
    setIsUserListShowing(false);
  };

  return (
    <div className="chat">
      <div className="chat__sidebar">
        <div className="sidebar__header">
          <div className="sidebar__username">
            {username}
            <span className="sidebar__username-tag">#{tag}</span>
          </div>
          <button
            className="icon-btn"
            aria-label="New chat"
            title="New chat"
            onClick={showUserList}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
        <div className="sidebar__chats">
          {chats?.map(({ messages, user }) => {
            const lastMsg = messages[messages.length - 1];
            return (
              <UserCard
                className={classNames({ selected: user === selectedChat?.user })}
                name={user}
                lastMessage={lastMsg?.message}
                onClick={() => handleUserSelect(user)}
                key={user}
              />
            );
          })}
          {isUserListShowing && <UserList onAdd={handleAddUser} onClose={handleUserListClose} />}
        </div>
      </div>
      <div className="chat__main">
        {selectedChat ? (
          <SelectedChat selectedChat={selectedChat} />
        ) : (
          <div className="chat__info">
            <Button onClick={showUserList}>Select a user</Button>
          </div>
        )}
      </div>
    </div>
  );
}

type SelectedChatProps = {
  selectedChat: Chat;
};

function SelectedChat({ selectedChat }: SelectedChatProps) {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.auth.username);
  const online = useAppSelector((state) => state.users).some((user) => user === selectedChat.user);
  const messages = selectedChat?.messages;
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setChatDraftMessage({ user: selectedChat.user, text: e.currentTarget.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat.draftMessage.trim().length) return;

    dispatch(
      sendMessage({
        author: loggedUser!,
        message: selectedChat.draftMessage,
        to: selectedChat.user,
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    if (e.ctrlKey || e.altKey) return;

    e.preventDefault();

    if (e.shiftKey)
      dispatch(
        setChatDraftMessage({
          user: selectedChat.user,
          text: `${e.currentTarget.value}\n`,
        })
      );
    else formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  return (
    <>
      <div className="selected-chat__main">
        <div className="selected-chat__header">
          <div className="avatar"></div>
          <div className="selected-chat__info">
            <span className="selected-chat_username">{selectedChat.user}</span>
            <span className="selected-chat__status">{online ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className="selected-chat__messages">
          {messages?.map((msg) => {
            const date = new Date(msg.timestamp || 0);
            return (
              <div
                className={classNames('message', { self: msg.author === loggedUser })}
                key={msg.requestId || msg.id}
              >
                <div
                  className={classNames('message__bubble', {
                    pending: msg.pending,
                    error: msg.hasError,
                  })}
                >
                  <span className="message__bubble-text">{msg.message}</span>
                  <span className="message__date">
                    {msg.timestamp && (
                      <time dateTime={date.toLocaleString()} title={date.toLocaleString()}>
                        {date.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    )}
                  </span>
                </div>
                {msg.hasError && (
                  <button className="message__retry-btn">
                    An error has ocurred. Click to retry
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <form className="selected-chat__form" onSubmit={handleSubmit} ref={formRef}>
        <TextareaAutosize
          className="selected-chat__input"
          placeholder="Enter a message"
          maxRows={4}
          onChange={handleChange}
          value={selectedChat.draftMessage}
          disabled={!online}
          onKeyPress={handleKeyPress}
        ></TextareaAutosize>
        <Button disabled={!online}>Send</Button>
      </form>
    </>
  );
}

export default ChatScreen;
