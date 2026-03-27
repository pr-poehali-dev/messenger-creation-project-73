import { useState } from "react";
import Icon from "@/components/ui/icon";

type Props = {
  coins: number;
  stars: number;
  isPremium: boolean;
};

export default function ProfileView({ coins, stars, isPremium }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Иван Петров");
  const [bio, setBio] = useState("Привет, я использую Вспышку!");
  const [status, setStatus] = useState<"online" | "away" | "busy" | "offline">("online");

  const statusOptions = [
    { value: "online", label: "Онлайн", color: "#22d67a" },
    { value: "away", label: "Отошёл", color: "#f59e0b" },
    { value: "busy", label: "Занят", color: "#ef4444" },
    { value: "offline", label: "Невидимка", color: "#6b7280" },
  ] as const;

  const currentStatus = statusOptions.find((s) => s.value === status)!;

  const renderStars = () => {
    if (stars === 0) return null;
    return (
      <div className="profile-stars-row">
        {[...Array(Math.min(stars, 10))].map((_, i) => (
          <span key={i} className="profile-star">⭐</span>
        ))}
        {stars > 10 && <span className="profile-star-extra">+{stars - 10}</span>}
      </div>
    );
  };

  return (
    <div className="panel-view animate-fade-in">
      <div className="panel-view-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2 className="panel-title">Профиль</h2>
          {isPremium && <span className="premium-chip">👑 Premium</span>}
        </div>
        <button className="icon-btn" onClick={() => setEditing(!editing)}>
          <Icon name={editing ? "Check" : "Pencil"} size={18} />
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-big" style={isPremium ? { boxShadow: "0 0 40px rgba(250,204,21,0.35)" } : {}}>
          <span>ИП</span>
          <div className="profile-status-dot" style={{ background: currentStatus.color }} />
          {isPremium && <span className="avatar-premium-big">👑</span>}
        </div>

        {editing ? (
          <input
            className="profile-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h3 className="profile-name">
            {name}
            {isPremium && <span style={{ marginLeft: 6 }}>✨</span>}
          </h3>
        )}
        <p className="profile-nick">@ivan_petrov</p>

        {renderStars()}

        <div className="profile-economy-row">
          <div className="econ-chip coins">
            <span>🪙</span>
            <span>{coins.toLocaleString("ru-RU")}</span>
            <span className="econ-label">монет</span>
          </div>
          <div className="econ-chip stars">
            <span>⭐</span>
            <span>{stars}</span>
            <span className="econ-label">звёзд</span>
          </div>
          {isPremium && (
            <div className="econ-chip premium">
              <span>👑</span>
              <span>Premium</span>
            </div>
          )}
        </div>

        <div className="profile-status-select">
          {statusOptions.map((s) => (
            <button
              key={s.value}
              className={`status-opt ${status === s.value ? "active" : ""}`}
              style={status === s.value ? { borderColor: s.color, color: s.color } : {}}
              onClick={() => setStatus(s.value)}
            >
              <span className="status-dot-sm" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="profile-section">
          <div className="profile-field">
            <label>О себе</label>
            {editing ? (
              <textarea
                className="profile-bio-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            ) : (
              <p className="profile-bio">{bio}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Телефон</label>
            <p className="profile-bio">+7 (999) 123-45-67</p>
          </div>
          <div className="profile-field">
            <label>Почта</label>
            <p className="profile-bio">ivan@example.com</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-num">142</span>
            <span className="stat-lbl">Контакты</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">28</span>
            <span className="stat-lbl">Группы</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">5</span>
            <span className="stat-lbl">Медиа</span>
          </div>
        </div>
      </div>
    </div>
  );
}
