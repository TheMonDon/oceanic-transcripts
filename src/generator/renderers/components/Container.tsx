import React from 'react';

const DiscordContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '500px',
        flexDirection: 'column',
        backgroundColor: '#3f4248',
        padding: '16px',
        border: '1px solid #4f5359',
        marginTop: '2px',
        marginBottom: '2px',
        borderRadius: '10px',
        gap: '8px',
      }}
    >
      {children}
    </div>
  );
};

export default DiscordContainer;
