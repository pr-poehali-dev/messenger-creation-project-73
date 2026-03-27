import Icon from "@/components/ui/icon";
import { Chat } from "@/pages/Index";

type Props = {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (c: Chat) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
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

export default function ChatList({ chats, activeChat, onSelectChat, searchQuery, onSearch }: Props) {
  return (
    <div className="chat-list-panel">
      <div className="chat-list-header">
        <h2 className="panel-title">Сообщения</h2>
        <button className="icon-btn" title="Новый чат">
          <Icon name="PenSquare" size={18} />
        </button>
      </div>

      <div className="search-wrap">
        <Icon name="Search" size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Поиск по чатам..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearch("")}>
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      <div className="chat-items">
        {chats.length === 0 && (
          <div className="empty-search">Ничего не найдено</div>
        )}
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`chat-item ${activeChat?.id === chat.id ? "active" : ""} ${chat.isBot ? "chat-item-bot" : ""}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className={`chat-avatar ${chat.isBot ? "chat-avatar-bot" : ""}`}>
              <span>{chat.avatar}</span>
              {!chat.isBot && (
                <div
                  className="status-dot"
                  style={{ background: statusColors[chat.status] }}
                  title={statusLabels[chat.status]}
                />
              )}
              {chat.isBot && <div className="status-dot" style={{ background: "#22d67a" }} />}
            </div>
            <div className="chat-info">
              <div className="chat-name-row">
                <span className="chat-name">
                  {chat.isGroup && !chat.isBot && <Icon name="Users" size={13} className="group-icon" />}
                  {chat.name}
                  {chat.isBot && <span className="bot-label">БОТ</span>}
                </span>
                <div className="chat-meta-right">
                  {chat.isEncrypted && (
                    <Icon name="Lock" size={11} className="lock-icon" />
                  )}
                  <span className="chat-time">{chat.time}</span>
                </div>
              </div>
              <div className="chat-last-row">
                <span className="chat-last">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="unread-badge">{chat.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}