import Icon from "@/components/ui/icon";
import { TabType, Chat } from "@/pages/Index";

type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  chats: Chat[];
};

const tabs: { id: TabType; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "contacts", icon: "Users", label: "Контакты" },
  { id: "notifications", icon: "Bell", label: "Уведомления" },
  { id: "settings", icon: "Settings", label: "Настройки" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function Sidebar({ activeTab, onTabChange, chats }: Props) {
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">⚡</div>
        <span className="logo-text">Вспышка</span>
      </div>

      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <div className="tab-icon-wrap">
              <Icon name={tab.icon} size={22} />
              {tab.id === "chats" && totalUnread > 0 && (
                <span className="tab-badge">{totalUnread > 99 ? "99+" : totalUnread}</span>
              )}
            </div>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="my-avatar">
          <span>ИП</span>
          <div className="my-status-dot" />
        </div>
      </div>
    </div>
  );
}
