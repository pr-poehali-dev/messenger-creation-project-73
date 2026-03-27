import { useState } from "react";
import Sidebar from "@/components/messenger/Sidebar";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import ContactsView from "@/components/messenger/ContactsView";
import ProfileView from "@/components/messenger/ProfileView";
import SettingsView from "@/components/messenger/SettingsView";
import NotificationsView from "@/components/messenger/NotificationsView";
import BotView from "@/components/messenger/BotView";
import StoreView from "@/components/messenger/StoreView";

export type TabType = "chats" | "contacts" | "profile" | "settings" | "notifications" | "bot" | "store";

export type Message = {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  status?: "sent" | "delivered" | "read";
};

export type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  status: "online" | "offline" | "away" | "busy";
  isGroup?: boolean;
  isEncrypted?: boolean;
  messages: Message[];
};

const CHATS: Chat[] = [
  {
    id: 1,
    name: "Алина Смирнова",
    avatar: "АС",
    lastMessage: "Окей, до вечера 👋",
    time: "14:32",
    unread: 3,
    online: true,
    status: "online",
    isEncrypted: true,
    messages: [
      { id: 1, text: "Привет! Как дела?", time: "14:20", isMe: false, status: "read" },
      { id: 2, text: "Всё отлично, спасибо! А у тебя?", time: "14:21", isMe: true, status: "read" },
      { id: 3, text: "Тоже хорошо! Ты сегодня на встрече будешь?", time: "14:25", isMe: false, status: "read" },
      { id: 4, text: "Да, в 18:00", time: "14:28", isMe: true, status: "read" },
      { id: 5, text: "Окей, до вечера 👋", time: "14:32", isMe: false, status: "read" },
    ],
  },
  {
    id: 2,
    name: "Команда дизайна",
    avatar: "КД",
    lastMessage: "Макеты готовы, смотрите в Figma",
    time: "13:15",
    unread: 7,
    online: true,
    status: "online",
    isGroup: true,
    isEncrypted: false,
    messages: [
      { id: 1, text: "Всем привет! Обновил макеты", time: "12:50", isMe: false, status: "read" },
      { id: 2, text: "Огонь, смотрю сейчас", time: "12:55", isMe: true, status: "read" },
      { id: 3, text: "Добавил новый экран онбординга", time: "13:00", isMe: false, status: "read" },
      { id: 4, text: "Классно выглядит!", time: "13:05", isMe: false, status: "read" },
      { id: 5, text: "Макеты готовы, смотрите в Figma", time: "13:15", isMe: false, status: "read" },
    ],
  },
  {
    id: 3,
    name: "Максим Орлов",
    avatar: "МО",
    lastMessage: "Пришлю отчёт завтра утром",
    time: "11:48",
    unread: 0,
    online: false,
    status: "away",
    isEncrypted: true,
    messages: [
      { id: 1, text: "Максим, когда будет отчёт?", time: "11:40", isMe: true, status: "read" },
      { id: 2, text: "Работаю над ним", time: "11:43", isMe: false, status: "read" },
      { id: 3, text: "Пришлю отчёт завтра утром", time: "11:48", isMe: false, status: "read" },
    ],
  },
  {
    id: 4,
    name: "Екатерина Лебедева",
    avatar: "ЕЛ",
    lastMessage: "Спасибо за помощь!",
    time: "09:22",
    unread: 1,
    online: true,
    status: "busy",
    isEncrypted: false,
    messages: [
      { id: 1, text: "Помогла разобраться с задачей", time: "09:15", isMe: true, status: "read" },
      { id: 2, text: "Спасибо за помощь!", time: "09:22", isMe: false, status: "read" },
    ],
  },
  {
    id: 5,
    name: "Голосовой клуб",
    avatar: "ГК",
    lastMessage: "🎙 Созвон в 20:00",
    time: "Вчера",
    unread: 0,
    online: false,
    status: "offline",
    isGroup: true,
    isEncrypted: false,
    messages: [
      { id: 1, text: "🎙 Созвон в 20:00", time: "Вчера", isMe: false, status: "read" },
    ],
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(CHATS[0]);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [searchQuery, setSearchQuery] = useState("");

  // Economy state
  const [coins, setCoins] = useState(120);
  const [stars, setStars] = useState(2);
  const [isPremium, setIsPremium] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!activeChat || !text.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      status: "sent",
    };
    const updated = chats.map((c) =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, time: newMsg.time }
        : c
    );
    setChats(updated);
    setActiveChat({ ...activeChat, messages: [...activeChat.messages, newMsg], lastMessage: text });
  };

  const handleEarnCoins = (amount: number) => {
    setCoins((prev) => Math.max(0, prev + amount));
  };

  const handleBuyStars = (starsCount: number, coinsPrice: number): boolean => {
    if (coins < coinsPrice) return false;
    setCoins((prev) => prev - coinsPrice);
    setStars((prev) => prev + starsCount);
    return true;
  };

  const handleBuyPremium = (): boolean => {
    if (isPremium || stars < 30) return false;
    setStars((prev) => prev - 30);
    setIsPremium(true);
    return true;
  };

  const handleBuyGift = (_gift: string, starsPrice: number): boolean => {
    if (stars < starsPrice) return false;
    setStars((prev) => prev - starsPrice);
    return true;
  };

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messenger-app">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        chats={chats}
        coins={coins}
        stars={stars}
        isPremium={isPremium}
      />
      <div className="messenger-main">
        {activeTab === "chats" && (
          <>
            <ChatList
              chats={filteredChats}
              activeChat={activeChat}
              onSelectChat={(c) => setActiveChat(c)}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
            />
            {activeChat ? (
              <ChatWindow chat={activeChat} onSend={handleSendMessage} />
            ) : (
              <div className="chat-empty">
                <div className="chat-empty-icon">💬</div>
                <p>Выберите чат для начала общения</p>
              </div>
            )}
          </>
        )}
        {activeTab === "contacts" && <ContactsView />}
        {activeTab === "profile" && (
          <ProfileView coins={coins} stars={stars} isPremium={isPremium} />
        )}
        {activeTab === "settings" && <SettingsView />}
        {activeTab === "notifications" && <NotificationsView />}
        {activeTab === "bot" && (
          <BotView coins={coins} onEarnCoins={handleEarnCoins} />
        )}
        {activeTab === "store" && (
          <StoreView
            coins={coins}
            stars={stars}
            isPremium={isPremium}
            onBuyStars={handleBuyStars}
            onBuyPremium={handleBuyPremium}
            onBuyGift={handleBuyGift}
          />
        )}
      </div>
    </div>
  );
}
