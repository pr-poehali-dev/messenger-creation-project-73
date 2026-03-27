import { useState } from "react";
import Icon from "@/components/ui/icon";

type Props = {
  coins: number;
  stars: number;
  isPremium: boolean;
  onBuyStars: (starsCount: number, coinsPrice: number) => boolean;
  onBuyPremium: () => boolean;
  onBuyGift: (gift: string, starsPrice: number) => boolean;
};

const STAR_PACKS = [
  { id: 1, stars: 1, coins: 1000, label: "Стартовый" },
  { id: 2, stars: 5, coins: 4500, label: "Популярный", badge: "🔥" },
  { id: 3, stars: 10, coins: 8000, label: "Выгодный", badge: "💎" },
  { id: 4, stars: 25, coins: 18000, label: "Максимум", badge: "👑" },
];

const GIFTS = [
  { id: 1, emoji: "🌹", name: "Роза", price: 1, desc: "Романтичный подарок" },
  { id: 2, emoji: "🎂", name: "Торт", price: 2, desc: "На день рождения" },
  { id: 3, emoji: "💎", name: "Алмаз", price: 5, desc: "Роскошный подарок" },
  { id: 4, emoji: "🚀", name: "Ракета", price: 3, desc: "Для настоящих космонавтов" },
  { id: 5, emoji: "🏆", name: "Кубок", price: 4, desc: "Для чемпиона" },
  { id: 6, emoji: "🎁", name: "Сюрприз", price: 2, desc: "Загадочный подарок" },
];

export default function StoreView({ coins, stars, isPremium, onBuyStars, onBuyPremium, onBuyGift }: Props) {
  const [tab, setTab] = useState<"stars" | "premium" | "gifts">("stars");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [giftTarget, setGiftTarget] = useState<string>("Алина");

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuyStars = (pack: typeof STAR_PACKS[0]) => {
    const ok = onBuyStars(pack.stars, pack.coins);
    if (ok) showToast(`⭐ +${pack.stars} звёзд добавлено!`, true);
    else showToast("Недостаточно монет 🪙", false);
  };

  const handleBuyPremium = () => {
    if (isPremium) { showToast("У тебя уже есть Премиум 👑", false); return; }
    const ok = onBuyPremium();
    if (ok) showToast("👑 Премиум активирован!", true);
    else showToast("Нужно 30 звёзд для Премиума", false);
  };

  const handleBuyGift = (gift: typeof GIFTS[0]) => {
    const ok = onBuyGift(gift.name, gift.price);
    if (ok) showToast(`${gift.emoji} Подарок «${gift.name}» отправлен ${giftTarget}!`, true);
    else showToast("Недостаточно звёзд ⭐", false);
  };

  return (
    <div className="panel-view animate-fade-in" style={{ position: "relative" }}>
      {toast && (
        <div className={`store-toast ${toast.ok ? "ok" : "err"} animate-fade-in`}>
          {toast.msg}
        </div>
      )}

      <div className="panel-view-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 className="panel-title" style={{ fontSize: 18 }}>Магазин</h2>
          {isPremium && <span className="premium-chip">👑 Premium</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="coins-display small">
            <span>🪙</span>
            <span>{coins.toLocaleString("ru-RU")}</span>
          </div>
          <div className="coins-display small stars">
            <span>⭐</span>
            <span>{stars}</span>
          </div>
        </div>
      </div>

      <div className="store-tabs">
        {(["stars", "premium", "gifts"] as const).map((t) => (
          <button
            key={t}
            className={`store-tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "stars" && "⭐ Звёзды"}
            {t === "premium" && "👑 Премиум"}
            {t === "gifts" && "🎁 Подарки"}
          </button>
        ))}
      </div>

      <div className="store-content">
        {tab === "stars" && (
          <div className="store-section animate-fade-in">
            <p className="store-desc">Звёзды — валюта для покупок. Обменивай монеты на звёзды.</p>
            <div className="star-packs">
              {STAR_PACKS.map((pack) => (
                <div key={pack.id} className={`star-pack ${pack.badge ? "featured" : ""}`}>
                  {pack.badge && <span className="pack-badge">{pack.badge} {pack.label}</span>}
                  <div className="pack-stars">
                    {[...Array(Math.min(pack.stars, 5))].map((_, i) => (
                      <span key={i} style={{ fontSize: pack.stars > 10 ? 20 : 24 }}>⭐</span>
                    ))}
                    {pack.stars > 5 && <span className="pack-extra">+{pack.stars - 5}</span>}
                  </div>
                  <div className="pack-count">{pack.stars} {pack.stars === 1 ? "звезда" : pack.stars < 5 ? "звезды" : "звёзд"}</div>
                  <div className="pack-price">
                    <span>🪙 {pack.coins}</span>
                  </div>
                  <button
                    className={`pack-buy-btn ${coins >= pack.coins ? "active" : ""}`}
                    disabled={coins < pack.coins}
                    onClick={() => handleBuyStars(pack)}
                  >
                    {coins >= pack.coins ? "Купить" : "Не хватает монет"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "premium" && (
          <div className="store-section animate-fade-in">
            <div className="premium-hero">
              <div className="premium-crown">👑</div>
              <h3 className="premium-title">Вспышка Premium</h3>
              <p className="premium-sub">Разблокируй эксклюзивные возможности</p>
            </div>
            <div className="premium-features">
              {[
                { icon: "Star", text: "Значок ⭐ рядом с именем" },
                { icon: "Zap", text: "Приоритетная доставка сообщений" },
                { icon: "Shield", text: "Расширенное шифрование" },
                { icon: "Palette", text: "Эксклюзивные темы оформления" },
                { icon: "Gift", text: "Скидка 20% на подарки" },
                { icon: "Crown", text: "Значок 👑 в профиле" },
              ].map((f, i) => (
                <div key={i} className="premium-feat">
                  <div className="feat-check">
                    <Icon name={f.icon} size={15} fallback="Check" />
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <div className="premium-price-block">
              <div className="premium-price">⭐ 30 звёзд</div>
              <div className="premium-period">— навсегда</div>
            </div>
            <button
              className={`premium-buy-btn ${isPremium ? "owned" : stars >= 30 ? "active" : ""}`}
              onClick={handleBuyPremium}
              disabled={isPremium}
            >
              {isPremium ? "👑 Уже активен" : stars >= 30 ? "Активировать Премиум" : `Нужно ещё ${30 - stars} ⭐`}
            </button>
          </div>
        )}

        {tab === "gifts" && (
          <div className="store-section animate-fade-in">
            <div className="gift-target-row">
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Отправить:</span>
              <select
                className="gift-target-select"
                value={giftTarget}
                onChange={(e) => setGiftTarget(e.target.value)}
              >
                {["Алина", "Максим", "Екатерина", "Дмитрий", "Ольга"].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="gifts-grid">
              {GIFTS.map((gift) => (
                <div key={gift.id} className="gift-card">
                  <div className="gift-emoji">{gift.emoji}</div>
                  <div className="gift-name">{gift.name}</div>
                  <div className="gift-desc">{gift.desc}</div>
                  <div className="gift-price">⭐ {gift.price}</div>
                  <button
                    className={`gift-buy-btn ${stars >= gift.price ? "active" : ""}`}
                    disabled={stars < gift.price}
                    onClick={() => handleBuyGift(gift)}
                  >
                    {stars >= gift.price ? "Подарить" : `⭐ ${gift.price}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}