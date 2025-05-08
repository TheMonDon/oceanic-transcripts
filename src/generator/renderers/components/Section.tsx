import React from 'react';
import type { SectionComponent } from 'oceanic.js';
import type { RenderMessageContext } from '../../';
import { Component } from './Component';
import type { TextDisplayComponent, MessageActionRowComponent } from 'oceanic.js';

interface DiscordSectionProps {
  component: SectionComponent;
  id: number;
  context: RenderMessageContext;
}

const DiscordSection: React.FC<DiscordSectionProps> = ({ component, id, context }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {component.components.map((comp, idx) => (
          <Component key={idx} component={comp as TextDisplayComponent} id={idx} context={context} />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '500px',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {component.accessory && (
          <Component key={id} component={component.accessory as MessageActionRowComponent} id={id} context={context} />
        )}
      </div>
    </div>
  );
};

export default DiscordSection;
