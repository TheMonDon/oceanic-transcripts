import React from 'react';

const DiscordThumbnail: React.FC<{ url: string }> = ({ url }) => {
  return (
    <img
      src={url}
      alt="Thumbnail"
      style={{
        width: '85px',
        height: '85px',
        objectFit: 'cover',
        borderRadius: '8px',
      }}
    />
  );
};

export default DiscordThumbnail;
