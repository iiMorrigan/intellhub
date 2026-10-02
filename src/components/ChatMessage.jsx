// Renders one chat bubble. `sender` is either 'user' or 'assistant',
// and we use it to pick a CSS class so the two message types look
// (and align) differently — user messages on the right, assistant on
// the left, like any chat app.
function ChatMessage({ sender, text }) {
  return <div className={`chat-msg chat-msg--${sender}`}>{text}</div>;
}

export default ChatMessage;
