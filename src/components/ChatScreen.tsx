import './ChatScreen.css';
import TextareaAutosize from 'react-textarea-autosize';

function ChatScreen() {
  return (
    <div className="chat">
      <div className="chat__sidebar">
        <div className="sidebar__header">
          <div className="sidebar__username">
            Mateo<span className="sidebar__username-tag">#1414</span>
          </div>
          <button className="new-chat__btn" title="New chat">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
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
      <div className="selected-chat">
        <div className="selected-chat__main">
          <div className="selected-chat__header">
            <div className="chat-card__avatar"></div>
            <span className="chat-card__username">Mateo</span>
          </div>
          <div className="selected-chat__messages">
            <div className="message self">
              <span className="message__text">Hello</span>
              <span className="message__date">
                <time>19:39</time>
              </span>
            </div>
            <div className="message">
              <span className="message__text">World</span>
              <span className="message__date">
                <time>19:40</time>
              </span>
            </div>
          </div>
        </div>
        <form className="selected-chat__form">
          <TextareaAutosize
            className="selected-chat__input"
            placeholder="Enter a message"
            maxRows={4}
          ></TextareaAutosize>
          <button className="selected-chat__send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatScreen;
