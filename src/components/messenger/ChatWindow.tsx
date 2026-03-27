import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Chat } from "@/pages/Index";

type Props = {
  chat: Chat;
  onSend: (text: string) => void;
};

const statusColors: Record<string, string> = {
  online: "#22d67a",
  away: "#f59e0b",
  busy: "#ef4444",
  offline: "#6b7280",
};

const statusLabels: Record<string, string> = {
  online: "онлайн",
  away: "отошёл",
  busy: "занят",
  offline: "не в сети",
};

export default function ChatWindow({ chat, onSend }: Props) {
  const [input, setInput] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="cw-avatar">
          <span>{chat.avatar}</span>
          <div className="status-dot" style={{ background: statusColors[chat.status] }} />
        </div>
        <div className="cw-info">
          <div className="cw-name-row">
            <span className="cw-name">{chat.name}</span>
            {chat.isGroup && <span className="cw-badge group">Группа</span>}
            {chat.isEncrypted && <span className="cw-badge encrypted">🔒 Зашифровано</span>}
          </div>
          <span className="cw-status" style={{ color: statusColors[chat.status] }}>
            {statusLabels[chat.status]}
          </span>
        </div>
        <div className="cw-actions">
          <button
            className={`icon-btn ${voiceActive ? "voice-active" : ""}`}
            title="Голосовой чат"
            onClick={() => setVoiceActive(!voiceActive)}
          >
            <Icon name="Mic" size={18} />
          </button>
          <button className="icon-btn" title="Медиафайлы">
            <Icon name="Image" size={18} />
          </button>
          <button className="icon-btn" title="Информация">
            <Icon name="Info" size={18} />
          </button>
        </div>
      </div>

      {voiceActive && (
        <div className="voice-bar">
          <div className="voice-waves">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="voice-wave" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <span>Голосовой чат активен</span>
          <button className="voice-end" onClick={() => setVoiceActive(false)}>
            <Icon name="PhoneOff" size={16} />
          </button>
        </div>
      )}

      <div className="messages-area">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`msg-wrap ${msg.isMe ? "me" : "them"}`}>
            {!msg.isMe && (
              <div className="msg-avatar-small">
                <span>{chat.avatar.charAt(0)}</span>
              </div>
            )}
            <div className={`bubble ${msg.isMe ? "bubble-me" : "bubble-them"}`}>
              <span className="bubble-text">{msg.text}</span>
              <div className="bubble-meta">
                <span className="bubble-time">{msg.time}</span>
                {msg.isMe && (
                  <span className="msg-status">
                    {msg.status === "read" ? (
                      <Icon name="CheckCheck" size={12} className="status-read" />
                    ) : msg.status === "delivered" ? (
                      <Icon name="CheckCheck" size={12} />
                    ) : (
                      <Icon name="Check" size={12} />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-bar">
        <button className="icon-btn" title="Прикрепить файл">
          <Icon name="Paperclip" size={18} />
        </button>
        <button className="icon-btn" title="Медиафайл">
          <Icon name="ImagePlus" size={18} />
        </button>
        <textarea
          className="msg-input"
          placeholder="Написать сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="icon-btn" title="Эмодзи">
          <Icon name="Smile" size={18} />
        </button>
        <button
          className={`send-btn ${input.trim() ? "active" : ""}`}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Icon name="Send" size={18} />
        </button>
      </div>
    </div>
  );
}
