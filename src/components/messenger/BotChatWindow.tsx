import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type BotMsg = {
  id: number;
  from: "bot" | "user";
  type: "text" | "widget";
  text?: string;
  widget?: "tap" | "tasks" | "exchange" | "balance";
  time: string;
};

type Task = {
  id: number;
  title: string;
  reward: number;
  icon: string;
  cooldown: number;
  lastDone?: number;
};

type Props = {
  coins: number;
  stars: number;
  onEarnCoins: (n: number) => void;
  onBuyStars: (stars: number, coins: number) => boolean;
};

const TASKS: Task[] = [
  { id: 1, title: "Ежедневный вход", reward: 30, icon: "LogIn", cooldown: 86400 },
  { id: 2, title: "Отправить сообщение", reward: 50, icon: "MessageCircle", cooldown: 86400 },
  { id: 3, title: "Добавить контакт", reward: 40, icon: "UserPlus", cooldown: 86400 },
  { id: 4, title: "Испытание удачи 🎰", reward: 0, icon: "Zap", cooldown: 60 },
];

const now = () => Date.now();

const t = () =>
  new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

const BOT_WELCOME: BotMsg[] = [
  {
    id: 1, from: "bot", type: "text",
    text: "👋 Привет! Я МонетаБот — твой личный помощник по заработку монет!\n\n🪙 Тапай монету, выполняй задания и обменивай монеты на ⭐ звёзды.\n\nЧто хочешь сделать?",
    time: "сейчас",
  },
];

const QUICK_REPLIES = ["🪙 Тапать монету", "📋 Задания", "🔄 Обменять", "💰 Баланс"];

export default function BotChatWindow({ coins, stars, onEarnCoins, onBuyStars }: Props) {
  const [messages, setMessages] = useState<BotMsg[]>(BOT_WELCOME);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [input, setInput] = useState("");
  const [tapCoins, setTapCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const [tapping, setTapping] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const addBotMsg = (text: string, widget?: BotMsg["widget"]) => {
    const msg: BotMsg = {
      id: Date.now() + Math.random(),
      from: "bot",
      type: widget ? "widget" : "text",
      text,
      widget,
      time: t(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const addUserMsg = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", type: "text", text, time: t() },
    ]);
  };

  const handleQuickReply = (reply: string) => {
    addUserMsg(reply);
    setTimeout(() => {
      if (reply.includes("Тапать")) {
        addBotMsg("Тапай монету — каждый тап приносит монеты! Иногда выпадает x3 🎉", "tap");
      } else if (reply.includes("Задания")) {
        addBotMsg("Вот твои задания на сегодня:", "tasks");
      } else if (reply.includes("Обменять")) {
        addBotMsg("Обменяй монеты на звёзды по курсу:", "exchange");
      } else if (reply.includes("Баланс")) {
        addBotMsg("", "balance");
      }
    }, 350);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addUserMsg(text);
    setTimeout(() => {
      const lower = text.toLowerCase();
      if (lower.includes("монет") || lower.includes("баланс") || lower.includes("сколько")) {
        addBotMsg("", "balance");
      } else if (lower.includes("задани") || lower.includes("задач")) {
        addBotMsg("Вот твои задания:", "tasks");
      } else if (lower.includes("обмен") || lower.includes("звезд")) {
        addBotMsg("Курс обмена монет на звёзды:", "exchange");
      } else if (lower.includes("тап") || lower.includes("монет") || lower.includes("играть")) {
        addBotMsg("Лови монету! 🪙", "tap");
      } else {
        addBotMsg("Не понимаю 😅 Используй кнопки ниже или напиши: «задания», «баланс», «обменять».");
      }
    }, 400);
  };

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    tapCount.current += 1;
    const rect = e.currentTarget.getBoundingClientRect();
    const coinId = Date.now() + Math.random();
    setTapCoins((prev) => [
      ...prev,
      { id: coinId, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setTapCoins((prev) => prev.filter((c) => c.id !== coinId)), 800);
    setTapping(true);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      const earned = tapCount.current;
      onEarnCoins(earned);
      tapCount.current = 0;
      setTapping(false);
      addBotMsg(`Отлично! Ты заработал 🪙 +${earned} монет!`);
    }, 900);
  };

  const canDo = (task: Task) => !task.lastDone || now() - task.lastDone > task.cooldown * 1000;

  const doTask = (task: Task) => {
    if (!canDo(task)) return;
    let earned = task.reward;
    let resultText = "";
    if (task.id === 4) {
      const roll = Math.random();
      if (roll < 0.05) { earned = 500; resultText = "🎰 ДЖЕКПОТ! "; }
      else if (roll < 0.2) { earned = 100; resultText = "🎉 Повезло! "; }
      else if (roll < 0.5) { earned = 25; resultText = "✨ Удача! "; }
      else { earned = 5; resultText = "😅 Немного, но ничего! "; }
    }
    onEarnCoins(earned);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, lastDone: now() } : t));
    addBotMsg(`${resultText}Задание «${task.title}» выполнено! Начислено 🪙 +${earned} монет.`);
  };

  const formatCd = (task: Task) => {
    if (!task.lastDone) return null;
    const left = task.cooldown * 1000 - (now() - task.lastDone);
    if (left <= 0) return null;
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    if (h > 0) return `${h}ч ${m}м`;
    if (m > 0) return `${m}м ${s}с`;
    return `${s}с`;
  };

  const doExchange = (starsCount: number, coinsPrice: number) => {
    const ok = onBuyStars(starsCount, coinsPrice);
    if (ok) {
      addBotMsg(`✅ Обменял 🪙 ${coinsPrice} монет → ⭐ ${starsCount} звёзд!`);
    } else {
      addBotMsg(`❌ Не хватает монет. Нужно 🪙 ${coinsPrice}, у тебя 🪙 ${coins}.`);
    }
  };

  const renderWidget = (msg: BotMsg) => {
    switch (msg.widget) {
      case "tap":
        return (
          <div className="bc-widget">
            <div className="bc-tap-hint">Тапай быстрее! 👇</div>
            <div className="bc-tap-wrap">
              <button
                className={`bc-tap-btn ${tapping ? "tapping" : ""}`}
                onClick={handleTap}
              >
                🪙
                {tapCoins.map((c) => (
                  <span key={c.id} className="bc-tap-float" style={{ left: c.x, top: c.y }}>
                    +1
                  </span>
                ))}
              </button>
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="bc-widget">
            {tasks.map((task) => {
              const cd = formatCd(task);
              const available = canDo(task);
              return (
                <div key={task.id} className={`bc-task ${!available ? "done" : ""}`}>
                  <div className="bc-task-info">
                    <span className="bc-task-title">{task.title}</span>
                    <span className="bc-task-reward">
                      🪙 {task.id === 4 ? "?" : `+${task.reward}`}
                    </span>
                  </div>
                  <button
                    className={`bc-task-btn ${available ? "active" : ""}`}
                    disabled={!available}
                    onClick={() => doTask(task)}
                  >
                    {available ? "Выполнить" : cd ? `⏱ ${cd}` : "✓"}
                  </button>
                </div>
              );
            })}
          </div>
        );

      case "exchange":
        return (
          <div className="bc-widget">
            {[
              { coins: 100, stars: 1 },
              { coins: 450, stars: 5 },
              { coins: 800, stars: 10 },
            ].map((r) => (
              <div key={r.stars} className="bc-exchange-row">
                <span className="bc-ex-label">🪙 {r.coins} → ⭐ {r.stars}</span>
                <button
                  className={`bc-ex-btn ${coins >= r.coins ? "active" : ""}`}
                  disabled={coins < r.coins}
                  onClick={() => doExchange(r.stars, r.coins)}
                >
                  {coins >= r.coins ? "Обменять" : "Мало монет"}
                </button>
              </div>
            ))}
          </div>
        );

      case "balance":
        return (
          <div className="bc-widget bc-balance">
            <div className="bc-bal-row">
              <span className="bc-bal-icon">🪙</span>
              <div>
                <div className="bc-bal-val">{coins.toLocaleString("ru-RU")}</div>
                <div className="bc-bal-lbl">монет</div>
              </div>
            </div>
            <div className="bc-bal-divider" />
            <div className="bc-bal-row">
              <span className="bc-bal-icon">⭐</span>
              <div>
                <div className="bc-bal-val">{stars}</div>
                <div className="bc-bal-lbl">звёзд</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <div className="cw-avatar" style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}>
          <span style={{ fontSize: 20 }}>🤖</span>
        </div>
        <div className="cw-info">
          <div className="cw-name-row">
            <span className="cw-name">МонетаБот</span>
            <span className="cw-badge group">🤖 Бот</span>
            <span className="cw-badge encrypted">🪙 {coins}</span>
          </div>
          <span className="cw-status" style={{ color: "#22d67a" }}>всегда онлайн</span>
        </div>
        <div className="cw-actions">
          <button className="icon-btn" title="Баланс" onClick={() => handleQuickReply("💰 Баланс")}>
            <Icon name="Wallet" size={18} fallback="CreditCard" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-wrap ${msg.from === "user" ? "me" : "them"}`}>
            {msg.from === "bot" && (
              <div className="msg-avatar-small" style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", fontSize: 14 }}>
                🤖
              </div>
            )}
            <div className={`bubble ${msg.from === "user" ? "bubble-me" : "bubble-them"}`} style={{ maxWidth: "75%" }}>
              {msg.text && (
                <span className="bubble-text" style={{ whiteSpace: "pre-line" }}>{msg.text}</span>
              )}
              {msg.widget && renderWidget(msg)}
              <div className="bubble-meta">
                <span className="bubble-time">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="bc-quick-replies">
        {QUICK_REPLIES.map((r) => (
          <button key={r} className="bc-quick-btn" onClick={() => handleQuickReply(r)}>
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="input-bar">
        <textarea
          className="msg-input"
          placeholder="Напиши боту..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={1}
        />
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
