import React, { useState } from 'react';
import { 
  FolderDown, 
  Keyboard, 
  Info, 
  Sliders, 
  Globe 
} from 'lucide-react';
import { openUrl } from '@tauri-apps/plugin-opener';

import { invoke } from '@tauri-apps/api/core';

type Tab = 'general' | 'destinations' | 'keybindings' | 'about';

const SettingsWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [autoSave, setAutoSave] = useState(true);
  const [copyToClipboard, setCopyToClipboard] = useState(true);
  const [saveFormat, setSaveFormat] = useState('png');
  const [saveLocation, setSaveLocation] = useState('~/Pictures/ClickShot');

  const [shortcuts] = useState([
    { id: 'full', label: 'Full Screenshot', keys: 'Ctrl + Shift + 1' },
    { id: 'region', label: 'Region Screenshot', keys: 'Ctrl + Shift + 2' },
    { id: 'edit', label: 'Toggle Editor', keys: 'Ctrl + Shift + E' },
  ]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        invoke('close_settings_window_command');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenFolder = () => {
    // Open destination folder using opener plugin or native path
  };

  return (
    <div className="window-container settings-window-card">
      {/* Top Header & Navigation Bar */}
      <div className="settings-topbar">
        <div className="settings-header-title">Settings</div>
        
        <div className="settings-nav-tabs">
          <button 
            className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Sliders size={15} />
            <span>General</span>
          </button>

          <button 
            className={`settings-nav-item ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <FolderDown size={15} />
            <span>Destinations</span>
          </button>

          <button 
            className={`settings-nav-item ${activeTab === 'keybindings' ? 'active' : ''}`}
            onClick={() => setActiveTab('keybindings')}
          >
            <Keyboard size={15} />
            <span>Keybindings</span>
          </button>

          <button 
            className={`settings-nav-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Info size={15} />
            <span>About</span>
          </button>
        </div>
      </div>

        {/* Settings Content Area */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <div>
              <div className="settings-section-title">
                <Sliders size={20} />
                <span>General Preferences</span>
              </div>

              <div className="settings-card">
                <div className="settings-card-header">Capture & Save Options</div>
                <div className="settings-card-desc">Configure image capture defaults and clipboard behavior</div>
                
                <div className="setting-row">
                  <div>
                    <div className="setting-label">Copy to Clipboard</div>
                    <div className="setting-sublabel">Automatically copy screenshots to clipboard upon capture</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={copyToClipboard} 
                    onChange={(e) => setCopyToClipboard(e.target.checked)} 
                  />
                </div>

                <div className="setting-row">
                  <div>
                    <div className="setting-label">Auto-save Screenshots</div>
                    <div className="setting-sublabel">Automatically save captures to local disk</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoSave} 
                    onChange={(e) => setAutoSave(e.target.checked)} 
                  />
                </div>

                <div className="setting-row">
                  <div>
                    <div className="setting-label">Default Image Format</div>
                    <div className="setting-sublabel">Format used when saving screenshots</div>
                  </div>
                  <select 
                    className="cs-select"
                    value={saveFormat} 
                    onChange={(e) => setSaveFormat(e.target.value)}
                  >
                    <option value="png">PNG (Lossless)</option>
                    <option value="jpeg">JPEG (Compressed)</option>
                    <option value="webp">WebP (Modern)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div>
              <div className="settings-section-title">
                <FolderDown size={20} />
                <span>Save Locations & Destinations</span>
              </div>

              <div className="settings-card">
                <div className="settings-card-header">Default Directory</div>
                <div className="settings-card-desc">Choose where ClickShot stores your captured images</div>
                
                <div className="setting-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '8px' }}>
                  <div className="setting-label">Output Path</div>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <input 
                      type="text" 
                      className="cs-input" 
                      style={{ flex: 1 }} 
                      value={saveLocation} 
                      onChange={(e) => setSaveLocation(e.target.value)}
                    />
                    <button className="cs-btn" onClick={handleOpenFolder}>
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keybindings' && (
            <div>
              <div className="settings-section-title">
                <Keyboard size={20} />
                <span>Keyboard Shortcuts</span>
              </div>

              <div className="settings-card">
                <div className="settings-card-header">Global Keybindings</div>
                <div className="settings-card-desc">Shortcuts to quickly trigger capture actions</div>

                {shortcuts.map((sc) => (
                  <div className="setting-row" key={sc.id}>
                    <div>
                      <div className="setting-label">{sc.label}</div>
                    </div>
                    <span className="shortcut-badge">{sc.keys}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ padding: '24px 0' }}>
              <div className="settings-card" style={{ textAlign: 'center', padding: '32px' }}>
                <div className="about-app-name">ClickShot</div>
                <div className="about-version">v0.0.1 (Beta)</div>
                <div className="about-description" style={{ margin: '0 auto 20px' }}>
                  Fast, intuitive, and modern cross-platform screenshotting application built with Tauri, Rust, and React.
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button className="cs-btn cs-btn-primary" onClick={() => openUrl('https://github.com/nishu-murmu/clickshot')}>
                    <Globe size={14} /> GitHub Repository
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default SettingsWindow;
