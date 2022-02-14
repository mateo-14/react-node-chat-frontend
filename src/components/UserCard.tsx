import classNames from 'classnames';
import './UserCard.css';

type UserCardProps = {
  name: string;
  lastMessage?: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

export default function UserCard({ name, lastMessage, onClick, className }: UserCardProps) {
  return (
    <div className={classNames('user-card', className)} onClick={onClick}>
      <div className="avatar"></div>
      <div className="user-card__info">
        <span className="user-card__username">{name}</span>
        {lastMessage && <p className="user-card__lastmsg">{lastMessage}</p>}
      </div>
    </div>
  );
}
