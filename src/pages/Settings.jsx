import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

export default function Settings() {
  const { settings, updateSetting, clearHistory } = useSettings();
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    if (confirm('Hapus semua riwayat percakapan? Tindakan ini tidak bisa dibatalkan.')) {
      clearHistory();
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    }
  };

  return (
    <div className="page-container">
      <span className="eyebrow">Settings</span>
      <h1 style={{ fontSize: 26, marginTop: 10, marginBottom: 20 }}>Preferensi aplikasi</h1>

      <div className="glass-panel">
        <div className="settings-row">
          <div className="settings-row-label">
            <span>Tampilan</span>
            <span>Ganti antara mode gelap dan terang</span>
          </div>
          <div className="segmented">
            <button type="button" className={settings.theme === 'dark' ? 'active' : ''} onClick={() => updateSetting('theme', 'dark')}>Dark</button>
            <button type="button" className={settings.theme === 'light' ? 'active' : ''} onClick={() => updateSetting('theme', 'light')}>Light</button>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span>Animasi</span>
            <span>Galaxy, particle, dan efek hologram</span>
          </div>
          <Toggle checked={settings.animations} onChange={(v) => updateSetting('animations', v)} />
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span>Suara</span>
            <span>Respons suara pada Voice Assistant</span>
          </div>
          <Toggle checked={settings.sound} onChange={(v) => updateSetting('sound', v)} />
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span>Bahasa</span>
            <span>Bahasa antarmuka AzryAI</span>
          </div>
          <div className="segmented">
            <button type="button" className={settings.language === 'id' ? 'active' : ''} onClick={() => updateSetting('language', 'id')}>ID</button>
            <button type="button" className={settings.language === 'en' ? 'active' : ''} onClick={() => updateSetting('language', 'en')}>EN</button>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span>Hapus riwayat</span>
            <span>Bersihkan semua percakapan tersimpan</span>
          </div>
          <button className="btn btn-ghost" onClick={handleClear} type="button" style={{ color: '#ffb3b3' }}>
            <Trash2 size={15} /> {cleared ? 'Terhapus' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label="Toggle"
    >
      <span className="toggle-knob" />
    </button>
  );
}
