import { DiscordActionRow, DiscordAttachment, DiscordButton, DiscordSpoiler } from '@derockdev/discord-components-react';
import { ButtonStyle, ComponentType, type ThumbnailComponent, type MessageActionRowComponent, type TopLevelComponent } from 'discord.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';
import DiscordSelectMenu from './components/Select Menu';
import DiscordContainer from './components/Container';
import DiscordSection from './components/section/Section';
import DiscordMediaGallery from './components/Media Gallery';
import DiscordSeperator from './components/Spacing';
import MessageContent from './content';
import { RenderType } from './content';
import type { RenderMessageContext } from '..';

export default function ComponentRow({ component, id, context }: { component: TopLevelComponent; id: number; context: RenderMessageContext }) {
  if (component.type === ComponentType.ActionRow) {
    return (
      <DiscordActionRow key={id}>
        <>
          {component.components.map((nestedComponent, id) => (
            <Component component={nestedComponent} id={id} key={id} />
          ))}
        </>
      </DiscordActionRow>
    );
  }
  
  if (component.type === ComponentType.Container) {
    return (
      <DiscordContainer key={id}>
        <>
          {component.components.map((nestedComponent, id) => (
            <ComponentRow component={nestedComponent} id={id} key={id} context={context} />
          ))}
        </>
      </DiscordContainer>
    );
  }
  
  if (component.type === ComponentType.File) {
    return (
      <>
        {component.spoiler ?
          <DiscordSpoiler key={component.id} slot="attachment">
            <DiscordAttachment type='file' key={component.id} slot="attachment" url={component.file.url} />
          </DiscordSpoiler>
          :
          <DiscordAttachment type='file' key={component.id} slot="attachment" url={component.file.url} />
        }
      </>
    );
  }

  if (component.type === ComponentType.MediaGallery) {
    return (
      <DiscordMediaGallery component={component} key={id} />
    );
  }

  if (component.type === ComponentType.Section) {
    return (
      <DiscordSection key={id} accessory={component.accessory} id={id}>
        {component.components.map((nestedComponent, id) => (
          <ComponentRow component={nestedComponent} id={id} key={id} context={context} />
        ))}
      </DiscordSection>
    );
  }

  if (component.type === ComponentType.Separator) {
    return (
      <DiscordSeperator key={id} spacing={component.spacing} divider={component.divider} />
    );
  }

  if (component.type === ComponentType.TextDisplay) {
    return (
      <MessageContent
        key={id}
        content={component.content}
        context={{ ...context, type: RenderType.NORMAL }}
      />
    );
  }
}

const ButtonStyleMapping = {
  [ButtonStyle.Primary]: 'primary',
  [ButtonStyle.Secondary]: 'secondary',
  [ButtonStyle.Success]: 'success',
  [ButtonStyle.Danger]: 'destructive',
  [ButtonStyle.Link]: 'secondary',
} as const;

export function Component({ component, id }: { component: MessageActionRowComponent | ThumbnailComponent; id: number }) {
  if (component.type === ComponentType.Button) {
    return (
      <DiscordButton
        key={id}
        type={ButtonStyleMapping[component.style as keyof typeof ButtonStyleMapping]}
        url={component.url ?? undefined}
        emoji={component.emoji ? parseDiscordEmoji(component.emoji) : undefined}
      >
        {component.label}
      </DiscordButton>
    );
  }

  if (component.type === ComponentType.StringSelect ||
    component.type === ComponentType.UserSelect ||
    component.type === ComponentType.RoleSelect ||
    component.type === ComponentType.MentionableSelect ||
    component.type === ComponentType.ChannelSelect) {
    return (
      <DiscordSelectMenu
        key={id}
        component={component} />
    );
  }

  return undefined;
}
