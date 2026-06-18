import { useGame } from '../context/GameContext';
import { useIsMobile } from '../hooks/useIsMobile';

export default function SettingsView() {
  const { player, updateSetting, playSFX } = useGame();
  const isMobile = useIsMobile();

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => { onChange(!checked); playSFX('click'); }}
        style={{
          flexShrink: 0,
          width: '52px', height: '30px', borderRadius: 'var(--r-full)',
          background: checked ? 'var(--purple)' : 'var(--toggle-track-bg)',
          border: `1px solid ${checked ? 'var(--purple)' : 'var(--toggle-track-border)'}`,
          position: 'relative', transition: 'all 0.2s', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: '3px', left: checked ? '25px' : '3px',
          width: '22px', height: '22px', borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
          pointerEvents: 'none',
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? '16px' : '24px', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <div className="glass-card" style={{ padding: isMobile ? '20px 18px' : '32px' }}>
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
        <Toggle
          label="Background Music"
          desc="Play music during gameplay and on the home screen"
          checked={!!player.settings.music}
          onChange={(v) => updateSetting('music', v)}
        />
      </div>
    </div>
  );
}
