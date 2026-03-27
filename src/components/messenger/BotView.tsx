import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Task = {
  id: number;
  title: string;
  desc: string;
  reward: number;
  icon: string;
  cooldown: number;
  lastDone?: number;
  done?: boolean;
};

const DAILY_TASKS: Task[] = [
  { id: 1, title: "Отправить 5 сообщений", desc: "Пообщайся с кем-нибудь", reward: 50, icon: "MessageCircle", cooldown: 86400 },
  { id: 2, title: "Войти в систему", desc: "Ежедневный вход", reward: 30, icon: "LogIn", cooldown: 86400 },
  { id: 3, title: "Добавить контакт", desc: "Найди нового друга", reward: 40, icon: "UserPlus", cooldown: 86400 },
  { id: 4, title: "Поставить статус", desc: "Обнови свой статус", reward: 20, icon: "Smile", cooldown: 86400 },
];

const MINI_TASKS: Task[] = [
  { id: 5, title: "Нажать кнопку удачи", desc: "Испытай судьбу!", reward: 0, icon: "Zap", cooldown: 30 },
  { id: 6, title: "Найти слово", desc: "Угадай слово за 3 попытки", reward: 35, icon: "Search", cooldown: 3600 },
];

type Props = {
  coins: number;
  onEarnCoins: (amount: number) => void;
};

export default function BotView({ coins, onEarnCoins }: Props) {
  const [tasks, setTasks] = useState<Task[]>([...DAILY_TASKS, ...MINI_TASKS]);
  const [luckyResult, setLuckyResult] = useState<string | null>(null);
  const [wordGame, setWordGame] = useState<{ active: boolean; word: string; guesses: string[]; input: string; solved: boolean }>({
    active: false, word: "МОНЕТА", guesses: [], input: "", solved: false,
  });
  const [tapping, setTapping] = useState(false);
  const [tapCoins, setTapCoins] = useState<{ id: number; x: number; y: number; val: number }[]>([]);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const WORDS = ["МОНЕТА", "ЗВЕЗДА", "ЧЕМПИОН", "ПОБЕДА", "СЕКРЕТ"];

  const now = () => Date.now();

  const canDo = (task: Task) => {
    if (!task.lastDone) return true;
    return now() - task.lastDone > task.cooldown * 1000;
  };

  const completeTask = (task: Task) => {
    if (!canDo(task)) return;
    if (task.id === 5) {
      handleLucky(task);
      return;
    }
    if (task.id === 6) {
      const w = WORDS[Math.floor(Math.random() * WORDS.length)];
      setWordGame({ active: true, word: w, guesses: [], input: "", solved: false });
      return;
    }
    onEarnCoins(task.reward);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, lastDone: now() } : t));
  };

  const handleLucky = (task: Task) => {
    const roll = Math.random();
    let earned = 0;
    let msg = "";
    if (roll < 0.05) { earned = 500; msg = "🎰 ДЖЕКПОТ! +500 монет!"; }
    else if (roll < 0.2) { earned = 100; msg = "🎉 Отлично! +100 монет!"; }
    else if (roll < 0.5) { earned = 25; msg = "✨ Удача! +25 монет"; }
    else { earned = 5; msg = "😅 Мало, но всё же +5 монет"; }
    setLuckyResult(msg);
    onEarnCoins(earned);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, lastDone: now() } : t));
    setTimeout(() => setLuckyResult(null), 3000);
  };

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    tapCount.current += 1;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coinId = Date.now() + Math.random();
    const val = Math.random() < 0.1 ? 3 : 1;
    setTapCoins((prev) => [...prev, { id: coinId, x, y, val }]);
    setTimeout(() => setTapCoins((prev) => prev.filter((c) => c.id !== coinId)), 900);
    setTapping(true);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      onEarnCoins(tapCount.current);
      tapCount.current = 0;
      setTapping(false);
    }, 800);
  };

  const submitWord = () => {
    const guess = wordGame.input.toUpperCase().trim();
    if (!guess || wordGame.guesses.length >= 3) return;
    const newGuesses = [...wordGame.guesses, guess];
    if (guess === wordGame.word) {
      const bonus = (3 - wordGame.guesses.length) * 15 + 20;
      onEarnCoins(bonus + 35);
      setWordGame((g) => ({ ...g, guesses: newGuesses, input: "", solved: true }));
      setTasks((prev) => prev.map((t) => t.id === 6 ? { ...t, lastDone: now() } : t));
    } else {
      setWordGame((g) => ({ ...g, guesses: newGuesses, input: "" }));
      if (newGuesses.length >= 3) {
        setTasks((prev) => prev.map((t) => t.id === 6 ? { ...t, lastDone: now() } : t));
      }
    }
  };

  const formatCooldown = (task: Task) => {
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

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel-view animate-fade-in">
      <div className="panel-view-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="bot-logo">🤖</div>
          <div>
            <h2 className="panel-title" style={{ fontSize: 18 }}>МонетаБот</h2>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Зарабатывай монеты и обменивай на звёзды</p>
          </div>
        </div>
        <div className="coins-display">
          <span className="coins-icon">🪙</span>
          <span className="coins-amount">{coins.toLocaleString("ru-RU")}</span>
        </div>
      </div>

      <div className="bot-content">
        {/* TAP ZONE */}
        <div className="tap-section">
          <p className="tap-hint">Тапай по монете — зарабатывай!</p>
          <div className="tap-wrap">
            <button
              className={`tap-coin-btn ${tapping ? "tapping" : ""}`}
              onClick={handleTap}
            >
              <span className="tap-coin-inner">🪙</span>
              {tapCoins.map((c) => (
                <span
                  key={c.id}
                  className="tap-float"
                  style={{ left: c.x, top: c.y }}
                >
                  +{c.val}
                </span>
              ))}
            </button>
          </div>
          {luckyResult && (
            <div className="lucky-result animate-fade-in">{luckyResult}</div>
          )}
        </div>

        {/* WORD GAME */}
        {wordGame.active && (
          <div className="word-game animate-fade-in">
            <div className="word-game-header">
              <span>🔤 Угадай слово ({wordGame.word.length} букв)</span>
              <button className="icon-btn small" onClick={() => setWordGame((g) => ({ ...g, active: false }))}>
                <Icon name="X" size={14} />
              </button>
            </div>
            <div className="word-guesses">
              {wordGame.guesses.map((g, i) => (
                <div key={i} className="word-guess-row">
                  {g.split("").map((ch, j) => (
                    <span
                      key={j}
                      className={`word-letter ${ch === wordGame.word[j] ? "correct" : wordGame.word.includes(ch) ? "partial" : "wrong"}`}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              ))}
              {[...Array(Math.max(0, 3 - wordGame.guesses.length))].map((_, i) => (
                <div key={i} className="word-guess-row empty">
                  {[...Array(wordGame.word.length)].map((_, j) => (
                    <span key={j} className="word-letter empty" />
                  ))}
                </div>
              ))}
            </div>
            {wordGame.solved ? (
              <div className="word-solved">🎉 Угадал! Монеты начислены</div>
            ) : wordGame.guesses.length >= 3 ? (
              <div className="word-failed">😔 Слово было: <b>{wordGame.word}</b></div>
            ) : (
              <div className="word-input-row">
                <input
                  className="word-input"
                  placeholder="Введи слово..."
                  value={wordGame.input}
                  onChange={(e) => setWordGame((g) => ({ ...g, input: e.target.value.toUpperCase() }))}
                  onKeyDown={(e) => e.key === "Enter" && submitWord()}
                  maxLength={wordGame.word.length}
                />
                <button className="word-submit" onClick={submitWord}>
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* DAILY TASKS */}
        <div className="tasks-section">
          <div className="tasks-title">
            <Icon name="ListChecks" size={15} />
            Ежедневные задания
          </div>
          <div className="tasks-list">
            {tasks.map((task) => {
              const cd = formatCooldown(task);
              const available = canDo(task);
              return (
                <div key={task.id} className={`task-item ${!available ? "done" : ""}`}>
                  <div className="task-icon">
                    <Icon name={task.icon} size={18} fallback="Star" />
                  </div>
                  <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    <span className="task-desc">{cd ? `Снова через ${cd}` : task.desc}</span>
                  </div>
                  <div className="task-right">
                    <span className="task-reward">🪙 {task.id === 5 ? "?" : `+${task.reward}`}</span>
                    <button
                      className={`task-btn ${available ? "active" : "disabled"}`}
                      onClick={() => available && completeTask(task)}
                      disabled={!available}
                    >
                      {available ? <Icon name="Play" size={14} /> : <Icon name="Check" size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXCHANGE */}
        <div className="exchange-section">
          <div className="tasks-title">
            <Icon name="ArrowLeftRight" size={15} />
            Обмен монет на звёзды
          </div>
          <div className="exchange-rates">
            {[
              { coins: 1000, stars: 1 },
              { coins: 4500, stars: 5 },
              { coins: 8000, stars: 10 },
            ].map((r) => (
              <div key={r.stars} className="exchange-row">
                <span className="ex-coins">🪙 {r.coins}</span>
                <div className="ex-arrow">
                  <Icon name="ArrowRight" size={14} />
                </div>
                <span className="ex-stars">⭐ {r.stars}</span>
                <button
                  className={`ex-btn ${coins >= r.coins ? "active" : ""}`}
                  disabled={coins < r.coins}
                  onClick={() => {
                    if (coins >= r.coins) {
                      onEarnCoins(-r.coins);
                    }
                  }}
                >
                  Обменять
                </button>
              </div>
            ))}
          </div>
          <p className="ex-hint">Перейди в <b>Магазин</b> для покупки звёзд, премиума и подарков</p>
        </div>
      </div>
    </div>
  );
}