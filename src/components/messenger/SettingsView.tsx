import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function SettingsView() {
  const [encryption, setEncryption] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      className={`toggle-btn ${value ? "on" : "off"}`}
      onClick={() => onChange(!value)}
    >
      <div className="toggle-thumb" />
    </button>
  );

  return (
    <div className="panel-view animate-fade-in">
      <div className="panel-view-header">
        <h2 className="panel-title">Настройки</h2>
      </div>

      <div className="settings-content">
        <div className="settings-group">
          <div className="settings-group-title">
            <Icon name="Shield" size={15} /> Безопасность
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Сквозное шифрование</span>
              <small>E2E для всех сообщений</small>
            </div>
            <Toggle value={encryption} onChange={setEncryption} />
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Двухфакторная аутентификация</span>
              <small>Дополнительная защита входа</small>
            </div>
            <Toggle value={twoFA} onChange={setTwoFA} />
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Уведомления о чтении</span>
              <small>Показывать галочки прочтения</small>
            </div>
            <Toggle value={readReceipts} onChange={setReadReceipts} />
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group-title">
            <Icon name="Bell" size={15} /> Уведомления
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Push-уведомления</span>
              <small>Получать уведомления о сообщениях</small>
            </div>
            <Toggle value={notifications} onChange={setNotifications} />
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Звуки</span>
              <small>Звуковые уведомления</small>
            </div>
            <Toggle value={sounds} onChange={setSounds} />
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group-title">
            <Icon name="Palette" size={15} /> Внешний вид
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Тема оформления</span>
              <small>Тёмная</small>
            </div>
            <Icon name="ChevronRight" size={16} className="settings-chevron" />
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <span>Язык</span>
              <small>Русский</small>
            </div>
            <Icon name="ChevronRight" size={16} className="settings-chevron" />
          </div>
        </div>

        <button className="logout-btn">
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
