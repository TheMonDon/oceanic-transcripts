import { DiscordActionRow, DiscordButton } from '@derockdev/discord-components-react';
import type { MessageComponent } from 'oceanic.js';
import { ButtonStyles, ComponentTypes, type ActionRowBase } from 'oceanic.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';

export default function ComponentRow({ row, id }: { row: ActionRowBase<MessageComponent>; id: number }) {
  return (
    <DiscordActionRow key={id}>
      {row.components.map((component, id) => (
        <Component component={component} id={id} key={id} />
      ))}
    </DiscordActionRow>
  );
}

const ButtonStyleMapping = {
  [ButtonStyles.PRIMARY]: 'primary',
  [ButtonStyles.SECONDARY]: 'secondary',
  [ButtonStyles.SUCCESS]: 'success',
  [ButtonStyles.DANGER]: 'destructive',
  [ButtonStyles.LINK]: 'secondary',
} as const;

export function Component({ component, id }: { component: MessageComponent; id: number }) {
  if (component.type === ComponentTypes.BUTTON) {
    return (
      <DiscordButton
        key={id}
        type={ButtonStyleMapping[component.style]}
        url={component.style === ButtonStyles.LINK ? component.url : undefined}
        emoji={component.emoji ? parseDiscordEmoji(component.emoji) : undefined}
      >
        {component.label}
      </DiscordButton>
    );
  }

  return undefined;
}
