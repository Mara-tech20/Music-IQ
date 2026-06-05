import { useGame } from '../context/GameContext';

export default function SettingsView() {
  const { player, updateSetting, playSFX } = useGame();

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
      <button 
        onClick={() => { onChange(!checked); playSFX('click'); }}
        style={{
          width: '48px', height: '26px', borderRadius: 'var(--r-full)',
          background: checked ? 'var(--purple)' : 'var(--toggle-track-bg)',
          border: `1px solid ${checked ? 'var(--purple)' : 'var(--toggle-track-border)'}`,
          position: 'relative', transition: 'all 0.2s'
        }}
      >
        <div style={{
          position: 'absolute', top: '2px', left: checked ? '24px' : '2px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#fff', transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}></div>
      </button>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <div className="glass-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>⚙️</span> Preferences
        </h3>

        <Toggle 
          label="Dark Mode" 
          desc="Switch between light and dark themes"
          checked={player.settings.darkMode}
          onChange={(v) => updateSetting('darkMode', v)}
        />
        <Toggle 
          label="Sound Effects (SFX)" 
          desc="Play sounds for correct/wrong answers and button clicks"
          checked={player.settings.sfx}
          onChange={(v) => updateSetting('sfx', v)}
        />
        <Toggle 
          label="Background Animations" 
          desc="Enable or disable the floating particle background (Reduced Motion)"
          checked={!player.settings.reducedMotion}
          onChange={(v) => updateSetting('reducedMotion', !v)}
        />
        <Toggle 
          label="Daily Reminders" 
          desc="Get notified to keep your daily streak alive"
          checked={player.settings.dailyNotif}
          onChange={(v) => updateSetting('dailyNotif', v)}
        />
      </div>
    </div>
  );
}
