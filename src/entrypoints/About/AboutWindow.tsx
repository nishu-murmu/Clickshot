import React from 'react';
import { Camera, Globe, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { openUrl } from '@tauri-apps/plugin-opener';
import { invoke } from '@tauri-apps/api/core';

const AboutWindow: React.FC = () => {
  const handleOpenGithub = () => {
    openUrl('https://github.com/nishu-murmu/clickshot');
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        invoke('close_about_window_command');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="about-container">
      <div className="about-logo-wrapper">
        <Camera size={42} color="#ffffff" />
      </div>

      <h1 className="about-app-name">ClickShot</h1>
      <span className="about-version">Version 0.0.1</span>

      <p className="about-description">
        A sleek, high-performance desktop screenshot tool designed for seamless captures, annotations, and quick editing.
      </p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--cs-text-secondary)' }}>
          <Sparkles size={14} color="#60a5fa" /> High Speed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--cs-text-secondary)' }}>
          <ShieldCheck size={14} color="#34d399" /> Private & Secure
        </div>
      </div>

      <div className="about-actions">
        <button className="cs-btn cs-btn-primary" onClick={handleOpenGithub}>
          <Globe size={15} /> GitHub Repo
        </button>
        <button className="cs-btn" onClick={() => openUrl('https://github.com/nishu-murmu/clickshot/blob/main/LICENSE')}>
          License (MIT)
        </button>
      </div>

      <div style={{ marginTop: 'auto', fontSize: '11px', color: 'var(--cs-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Made with <Heart size={12} color="#f43f5e" fill="#f43f5e" /> for Linux, Windows & macOS
      </div>
    </div>
  );
};

export default AboutWindow;
