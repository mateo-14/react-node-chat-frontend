import './Button.css';

type ButtonType = {
  children: React.ReactNode;
  type?: 'primary' | 'secondary';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export default function Button({ children, type = 'primary', onClick, disabled }: ButtonType) {
  return (
    <button className={`button ${type}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
