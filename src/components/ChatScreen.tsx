import './ChatScreen.css';

function ChatScreen() {
  return (
    <div className="chat">
      <div className="chat__sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Online users</h2>
        </div>
        <div className="sidebar__chats">
          <div className="chat-card">
            <p>
              asfkasfk ksaf ksafk aksf kasfk askf kasfkasfkaksfkasfk askf kasfkasfk aksf kasfk askf
            </p>
          </div>
        </div>
      </div>
      <div className="chat__main"></div>
    </div>
  );
}

export default ChatScreen;
