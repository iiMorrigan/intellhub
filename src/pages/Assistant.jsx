import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';

const SUGGESTIONS = ['How many tasks are pending?', 'What is IntelliHub?', 'Give me a productivity tip', 'help'];

const INITIAL_MESSAGE = {
  sender: 'assistant',
  text: "Hi, I'm the IntelliHub assistant. I can answer basic questions for now — ask me about your tasks, or try the suggestions below.",
};

// This function is a stand-in for a real AI API call. It looks for
// keywords in the user's message and returns a matching canned reply.
// It's written as its own function — separate from the component —
// so that later, replacing it with `await callGeminiAPI(userText)`
// only requires changing this one function, not the whole page.
function getMockReply(userText, stats) {
  const text = userText.toLowerCase();

  if (text.includes('pending') || text.includes('how many task')) {
    return `You currently have ${stats.pending} pending task${stats.pending === 1 ? '' : 's'} and ${stats.completed} completed.`;
  }
  if (text.includes('high priority') || text.includes('urgent')) {
    return `You have ${stats.highPriority} high-priority task${stats.highPriority === 1 ? '' : 's'} that still need attention.`;
  }
  if (text.includes('what is intellihub') || text.includes('about')) {
    return 'IntelliHub is a personal productivity platform combining task management, documents, analytics, and AI assistance — this is the first frontend prototype.';
  }
  if (text.includes('tip') || text.includes('productivity')) {
    return "Try tackling your highest-priority task first thing — it's usually the one that unblocks everything else.";
  }
  if (text.includes('hello') || text.includes('hi')) {
    return 'Hello! Ask me about your tasks, or how IntelliHub works.';
  }
  if (text.includes('help')) {
    return 'You can ask things like "how many tasks are pending?", "what is IntelliHub?", or "give me a productivity tip".';
  }
  return "I'm still a mock assistant for now — once connected to a real LLM API, I'll be able to answer anything about your workspace.";
}

function Assistant({ stats }) {
  // Each chat message is one object in this array. Sending a message
  // means adding a new object to the array with setMessages — we never
  // mutate the array directly, we always create a new one (using the
  // spread operator, ...prev) so React knows to re-render.
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const logEndRef = useRef(null);

  // Runs after every render where `messages` changed, scrolling the
  // chat log down so the newest message is always visible.
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { sender: 'user', text: trimmed };
    const replyMsg = { sender: 'assistant', text: getMockReply(trimmed, stats) };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setInput('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">AI Assistant</div>
          <h1>Ask IntelliHub</h1>
          <div className="page-header__sub">Currently running on sample responses — a real LLM API connects here later.</div>
        </div>
      </div>

      <div className="card chat-shell">
        <div className="chat-log">
          {messages.map((m, i) => (
            <ChatMessage key={i} sender={m.sender} text={m.text} />
          ))}
          <div ref={logEndRef} />
        </div>

        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chat-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask something about your workspace..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn--primary">
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default Assistant;
