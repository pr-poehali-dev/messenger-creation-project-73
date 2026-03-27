import { useState } from "react";
import Icon from "@/components/ui/icon";

const CONTACTS = [
  { id: 1, name: "Алина Смирнова", nickname: "@alina_s", status: "online", avatar: "АС", mutual: 12 },
  { id: 2, name: "Максим Орлов", nickname: "@max_orlov", status: "away", avatar: "МО", mutual: 5 },
  { id: 3, name: "Екатерина Лебедева", nickname: "@kate_leb", status: "busy", avatar: "ЕЛ", mutual: 8 },
  { id: 4, name: "Дмитрий Козлов", nickname: "@dima_k", status: "offline", avatar: "ДК", mutual: 3 },
  { id: 5, name: "Ольга Воронова", nickname: "@olga_v", status: "online", avatar: "ОВ", mutual: 15 },
  { id: 6, name: "Сергей Новиков", nickname: "@serg_n", status: "offline", avatar: "СН", mutual: 2 },
];

const statusColors: Record<string, string> = {
  online: "#22d67a", away: "#f59e0b", busy: "#ef4444", offline: "#6b7280",
};
const statusLabels: Record<string, string> = {
  online: "онлайн", away: "отошёл", busy: "занят", offline: "не в сети",
};

export default function ContactsView() {
  const [search, setSearch] = useState("");
  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel-view animate-fade-in">
      <div className="panel-view-header">
        <h2 className="panel-title">Контакты</h2>
        <button className="icon-btn">
          <Icon name="UserPlus" size={18} />
        </button>
      </div>

      <div className="search-wrap" style={{ margin: "0 20px 16px" }}>
        <Icon name="Search" size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Найти контакт..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="contacts-list">
        {filtered.map((c) => (
          <div key={c.id} className="contact-item">
            <div className="chat-avatar">
              <span>{c.avatar}</span>
              <div className="status-dot" style={{ background: statusColors[c.status] }} />
            </div>
            <div className="contact-info">
              <div className="contact-name">{c.name}</div>
              <div className="contact-sub">
                <span className="contact-nick">{c.nickname}</span>
                <span className="contact-status" style={{ color: statusColors[c.status] }}>
                  {statusLabels[c.status]}
                </span>
              </div>
              <div className="contact-mutual">
                <Icon name="Users" size={11} /> {c.mutual} общих контактов
              </div>
            </div>
            <div className="contact-actions">
              <button className="icon-btn small" title="Написать">
                <Icon name="MessageCircle" size={16} />
              </button>
              <button className="icon-btn small" title="Позвонить">
                <Icon name="Phone" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
