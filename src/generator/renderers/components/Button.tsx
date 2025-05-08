import React from 'react';
import { getButtonStyle } from './styles';

interface DiscordButtonProps {
  type: string;
  url?: string;
  emoji?: string;
  children: React.ReactNode;
}

export const DiscordButton: React.FC<DiscordButtonProps> = ({ type, url, emoji, children }) => {
  return (
    <a href={url} target="_blank" style={getButtonStyle(type)}>
      {emoji && <span style={{ display: 'flex', alignItems: 'center' }}>{emoji}</span>}
      <span style={{ display: 'flex', alignItems: 'center' }}>{children}</span>
      {url && (
        <span style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V4.41l-4.3 4.3a1 1 0 1 1-1.4-1.42L19.58 3H16a1 1 0 0 1-1-1Z"
            />
            <path
              fill="currentColor"
              d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 1 0-2 0v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 1 0 0-2H5Z"
            />
          </svg>
        </span>
      )}
    </a>
  );
};

export default DiscordButton;
