import Icon from "@/components/ui/icon";

const NOTIFS = [
  { id: 1, type: "message", text: "Алина Смирнова: Окей, до вечера 👋", time: "14:32", read: false, icon: "MessageCircle" },
  { id: 2, type: "group", text: "Команда дизайна: 7 новых сообщений", time: "13:15", read: false, icon: "Users" },
  { id: 3, type: "contact", text: "Дмитрий Козлов добавил вас в контакты", time: "12:00", read: true, icon: "UserPlus" },
  { id: 4, type: "call", text: "Пропущенный вызов от Максима Орлова", time: "11:30", read: true, icon: "Phone" },
  { id: 5, type: "message", text: "Екатерина Лебедева: Спасибо за помощь!", time: "09:22", read: true, icon: "MessageCircle" },
  { id: 6, type: "security", text: "Новый вход в аккаунт с устройства iPhone 15", time: "Вчера", read: true, icon: "Shield" },
];

const typeColors: Record<string, string> = {
  message: "var(--accent-neon)",
  group: "var(--accent-violet)",
  contact: "#22d67a",
  call: "#f59e0b",
  security: "#ef4444",
};

export default function NotificationsView() {
  const unreadCount = NOTIFS.filter((n) => !n.read).length;

  return (
    <div className="panel-view animate-fade-in">
      <div className="panel-view-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 className="panel-title">Уведомления</h2>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
        <button className="icon-btn" title="Прочитать всё">
          <Icon name="CheckCheck" size={18} />
        </button>
      </div>

      <div className="notifs-list">
        {NOTIFS.map((n) => (
          <div key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`}>
            <div
              className="notif-icon"
              style={{ color: typeColors[n.type], background: typeColors[n.type] + "22" }}
            >
              <Icon name={n.icon} size={18} fallback="Bell" />
            </div>
            <div className="notif-content">
              <p className="notif-text">{n.text}</p>
              <span className="notif-time">{n.time}</span>
            </div>
            {!n.read && <div className="notif-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}
