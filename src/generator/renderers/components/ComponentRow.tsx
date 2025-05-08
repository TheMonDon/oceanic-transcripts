import React from 'react';
import { DiscordActionRow } from '@derockdev/discord-components-react';
import type { MessageComponent, MessageActionRowComponent } from 'oceanic.js';
import { ComponentTypes } from 'oceanic.js';
import type { RenderMessageContext } from '../../';
import { Component } from './Component';

interface ComponentRowProps {
  row: MessageComponent | MessageActionRowComponent;
  id: number;
  context: RenderMessageContext;
}

const ComponentRow: React.FC<ComponentRowProps> = ({ row, id, context }) => {
  // Handle ACTION_ROW type
  if (row.type === ComponentTypes.ACTION_ROW) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {row.components.map((component, idx) => (
          <ComponentRow key={idx} row={component} id={idx} context={context} />
        ))}
      </div>
    );
  }

  // Handle CONTAINER type
  if (row.type === ComponentTypes.CONTAINER) {
    return (
      <div
        key={id}
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
        {row.components.map((component, idx) => (
          <ComponentRow key={idx} id={idx} row={component} context={context} />
        ))}
      </div>
    );
  }

  // Handle all other component types
  return (
    <DiscordActionRow key={id}>
      <Component component={row as MessageActionRowComponent} id={id} context={context} />
    </DiscordActionRow>
  );
};

export default ComponentRow;
