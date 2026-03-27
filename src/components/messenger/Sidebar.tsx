import Icon from "@/components/ui/icon";
import { TabType, Chat } from "@/pages/Index";

type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  chats: Chat[];
  coins: number;
  stars: number;
  isPremium: boolean;
};

const topTabs: { id: TabType; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "contacts", icon: "Users", label: "Контакты" },
  { id: "notifications", icon: "Bell", label: "Уведом." },
  { id: "bot", icon: "Bot", label: "Бот" },
  { id: "store", icon: "ShoppingBag", label: "Магазин" },
];

const bottomTabs: { id: TabType; icon: string; label: string }[] = [
  { id: "settings", icon: "Settings", label: "Настройки" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function Sidebar({ activeTab, onTabChange, chats, coins, stars, isPremium }: Props) {
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">⚡</div>
        <span className="logo-text">Вспышка</span>
      </div>

      <nav className="sidebar-nav">
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? "active" : ""} ${tab.id === "bot" ? "bot-tab" : ""} ${tab.id === "store" ? "store-tab" : ""}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <div className="tab-icon-wrap">
              <Icon name={tab.icon} size={22} fallback="Circle" />
              {tab.id === "chats" && totalUnread > 0 && (
                <span className="tab-badge">{totalUnread > 99 ? "99+" : totalUnread}</span>
              )}
            </div>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-coins-info">
        <div className="sidebar-stat">
          <span>🪙</span>
          <span>{coins >= 1000 ? `${(coins / 1000).toFixed(1)}k` : coins}</span>
        </div>
        <div className="sidebar-stat">
          <span>⭐</span>
          <span>{stars}</span>
        </div>
      </div>

      <div className="sidebar-nav sidebar-nav-bottom">
        {bottomTabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <div className="tab-icon-wrap">
              <Icon name={tab.icon} size={22} fallback="Circle" />
            </div>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="my-avatar" onClick={() => onTabChange("profile")}>
          <span>ИП</span>
          <div className="my-status-dot" />
          {isPremium && <span className="avatar-premium">👑</span>}
        </div>
      </div>
    </div>
  );
}
