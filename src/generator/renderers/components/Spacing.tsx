import React from "react";
import { SeparatorSpacingSize } from "discord.js";

const DiscordSeperator: React.FC<{ divider: boolean; spacing: SeparatorSpacingSize; }> = ({ divider, spacing }) => {
  return (
    <div
      style={{
        width: '100%',
        height: divider ? '1px' : '0px',
        backgroundColor: '#4f5359',
        margin: spacing === SeparatorSpacingSize.Large ? '8px 0' : '0',
      }}
    />
  );
}

export default DiscordSeperator;