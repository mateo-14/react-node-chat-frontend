import './ChatScreen.css';

function ChatScreen() {
  return (
    <div className="chat">
      <div className="chat__sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Online users</h2>
        </div>
        <div className="sidebar__chats">
          {new Array(10).fill(15).map(() => (
            <div className="chat-card">
              <div className="chat-card__avatar"></div>
              <div className="chat-card__info">
                <span className="chat-card__username">Mateo</span>
                <p className="chat-card__lastmsg">
                  asfkasfk ksaf ksafk aksf kasfk askf kasfkasfkaksfkasfk askf kasfkasfk aksf kasfk
                  askf
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat__main"></div>
    </div>
  );
}

export default ChatScreen;
