import React from 'react';
import type {
  MessageComponent,
  MessageActionRowComponent,
  SelectMenuComponent,
  MediaGalleryComponent,
  SectionComponent,
  ThumbnailComponent} from 'oceanic.js';
import {
  ButtonStyles,
  ComponentTypes,
  SeparatorSpacingSize
} from 'oceanic.js';
import type { RenderMessageContext } from '../../';
import { DiscordAttachment } from '@derockdev/discord-components-react';
import { parseDiscordEmoji } from '../../../utils/utils';
import MessageContent, { RenderType } from '../content';
import { ButtonStyleMapping } from './styles';
import DiscordButton from './Button';
import DiscordSelectMenu from './SelectMenu';
import DiscordMediaGallery from './MediaGallery';
import DiscordSection from './Section';
import DiscordAttachmentSpoiler from './AttachmentSpoiler';

interface ComponentProps {
  component: MessageComponent | MessageActionRowComponent | ThumbnailComponent;
  id: number;
  context: RenderMessageContext;
}

export const Component: React.FC<ComponentProps> = ({ component, id, context }) => {
  if (component.type === ComponentTypes.BUTTON && 'style' in component && component.style !== ButtonStyles.PREMIUM) {
    return (
      <DiscordButton
        key={id}
        type={ButtonStyleMapping[component.style as keyof typeof ButtonStyleMapping]}
        url={component.style === ButtonStyles.LINK ? component.url : undefined}
        emoji={component.emoji ? parseDiscordEmoji(component.emoji) : undefined}
      >
        {component.label}
      </DiscordButton>
    );
  } else if (
    component.type === ComponentTypes.STRING_SELECT ||
    component.type === ComponentTypes.USER_SELECT ||
    component.type === ComponentTypes.ROLE_SELECT ||
    component.type === ComponentTypes.MENTIONABLE_SELECT ||
    component.type === ComponentTypes.CHANNEL_SELECT
  ) {
    return <DiscordSelectMenu component={component as SelectMenuComponent} id={id} />;
  } else if (component.type === ComponentTypes.MEDIA_GALLERY) {
    return <DiscordMediaGallery component={component as MediaGalleryComponent} id={id} />;
  } else if (component.type === ComponentTypes.SECTION) {
    return <DiscordSection component={component as SectionComponent} id={id} context={context} />;
  } else if (component.type === ComponentTypes.TEXT_DISPLAY) {
    return <MessageContent content={component.content} context={{ ...context, type: RenderType.NORMAL }} />;
  } else if (component.type === ComponentTypes.THUMBNAIL) {
    return (
      <img
        src={component.media.url}
        alt="Thumbnail"
        style={{
          width: '85px',
          height: '85px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
    );
  } else if (component.type === ComponentTypes.SEPARATOR) {
    return (
      <div
        key={id}
        style={{
          width: '100%',
          height: component.divider ? '1px' : '0px',
          backgroundColor: '#4f5359',
          margin: component.spacing === SeparatorSpacingSize.LARGE ? '8px 0' : '0',
        }}
      />
    );
  } else if (component.type === ComponentTypes.FILE) {
    const name = component.file.url.split('/').pop()?.split('?')[0];

    return (
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {component.spoiler ? (
          <DiscordAttachmentSpoiler>
            <DiscordAttachment type="file" key={component.id} alt={name} slot="attachment" url={component.file.url} />
          </DiscordAttachmentSpoiler>
        ) : (
          <DiscordAttachment type="file" key={component.id} slot="attachment" alt={name} url={component.file.url} />
        )}
      </div>
    );
  }

  return null;
};
