import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { getUsers } from '../services/chatService';
import { CSSTransition } from 'react-transition-group';
import useSWR from 'swr';
import UserCard from './UserCard';
import './UserList.css';

type UserListProps = {
  onAdd: (user: string) => void;
  onClose: () => void;
};

export default function UserList({ onAdd, onClose }: UserListProps) {
  const token = useAppSelector((state) => state.auth.token);
  const [inProp, setInProp] = useState(true);
  const ref = useRef(null);

  const { data: users } = useSWR(token ? ['users/online', token] : null, (_, token) =>
    getUsers(token)
  );

  const handleClose = () => {
    setInProp(false);
  };

  const handleAdd = (user: string) => {
    setInProp(false);
    onAdd(user);
  };

  return (
    <CSSTransition timeout={300} appear={true} in={inProp} onExited={onClose} nodeRef={ref}>
      <div className="users-list" ref={ref}>
        <div className="users-list__header">
          <h2 className="users-list__title">Online users</h2>
          <button
            className="icon-btn"
            aria-label="Close"
            title="Close"
            onClick={handleClose}
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
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
          </button>
        </div>
        <div className="users-list__list">
          {users?.map((user) => (
            <UserCard name={user} onClick={() => handleAdd(user)} key={user} />
          ))}
        </div>
      </div>
    </CSSTransition>
  );
}
