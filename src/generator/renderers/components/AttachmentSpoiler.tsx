import React from 'react';

interface DiscordAttachmentSpoilerProps {
  children: React.ReactNode;
}

const DiscordAttachmentSpoiler: React.FC<DiscordAttachmentSpoilerProps> = ({ children }) => {
  const spoilerId = `spoiler-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div
      className="spoiler-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%' }}>{children}</div>

      <div className="spoiler-control">
        <input
          type="checkbox"
          id={spoilerId}
          className="spoiler-checkbox"
          style={{
            position: 'absolute',
            opacity: 0,
            width: '1px',
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
            zIndex: -1,
          }}
        />

        <label
          htmlFor={spoilerId}
          className="spoiler-label"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#4f5359',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            zIndex: 2,
            userSelect: 'none',
          }}
        >
          SPOILER
        </label>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .spoiler-checkbox:checked + .spoiler-label {
            display: none !important;
          }
        `,
        }}
      />
    </div>
  );
};

export default DiscordAttachmentSpoiler;
