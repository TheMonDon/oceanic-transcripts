import {
  DiscordAttachments,
  DiscordCommand,
  DiscordMessage as DiscordMessageComponent,
  DiscordReaction,
  DiscordReactions,
  DiscordThread,
  DiscordThreadMessage,
} from '@derockdev/discord-components-react';
import type { GuildChannel, Message as MessageType } from 'oceanic.js';
import { MessageTypes } from 'oceanic.js';
import React from 'react';
import type { RenderMessageContext } from '..';
import { parseDiscordEmoji } from '../../utils/utils';
import { Attachments } from './attachment';
import ComponentRow from './components';
import MessageContent, { RenderType } from './content';
import { DiscordEmbed } from './embed';
import MessageReply from './reply';
import DiscordSystemMessage from './systemMessage';

export default async function DiscordMessage({
  message,
  context,
}: {
  message: MessageType;
  context: RenderMessageContext;
}) {
  if (
    ![
      MessageTypes.DEFAULT,
      MessageTypes.REPLY,
      MessageTypes.CHAT_INPUT_COMMAND,
      MessageTypes.CONTEXT_MENU_COMMAND,
    ].includes(message.type)
  )
    return <DiscordSystemMessage message={message} context={context} />;

  const isCrosspost =
    message.referencedMessage &&
    (message.referencedMessage.channel as GuildChannel).guildID &&
    message.guildID &&
    (message.referencedMessage.channel as GuildChannel).guildID != (message.channel as GuildChannel).guildID;
  return (
    <DiscordMessageComponent
      id={`m-${message.id}`}
      timestamp={message.createdAt.toISOString()}
      key={message.id}
      edited={message.editedTimestamp !== null}
      server={!!isCrosspost}
      highlight={message.mentions.everyone}
      profile={message.author.id}
    >
      {/* reply */}
      <MessageReply message={message} context={context} />

      {/* slash command */}
      {message.interactionMetadata && (
        <DiscordCommand
          slot="reply"
          profile={message.interactionMetadata.user.id}
          command={'/' + message.interactionMetadata.name}
        />
      )}

      {/* message content */}
      {message.content && (
        <MessageContent
          content={message.content}
          context={{ ...context, type: message.webhookID ? RenderType.WEBHOOK : RenderType.NORMAL }}
        />
      )}

      {/* attachments */}
      <Attachments message={message} context={context} />

      {/* message embeds */}
      {message.embeds.map((embed, id) => (
        <DiscordEmbed embed={embed} context={{ ...context, index: id, message }} key={id} />
      ))}

      {/* components */}
      {message.components.length > 0 && (
        <DiscordAttachments slot="components">
          {message.components.map((component, id) => (
            <ComponentRow key={id} id={id} row={component} />
          ))}
        </DiscordAttachments>
      )}

      {/* reactions */}
      {message.reactions.length > 0 && (
        <DiscordReactions slot="reactions">
          {message.reactions.map((reaction, id) => (
            <DiscordReaction
              key={`${message.id}r${id}`}
              name={reaction.emoji.name!}
              emoji={parseDiscordEmoji(reaction.emoji)}
              count={reaction.count}
            />
          ))}
        </DiscordReactions>
      )}

      {/* threads */}
      {message.thread && (
        <DiscordThread
          slot="thread"
          name={message.thread.name}
          cta={
            message.thread.messageCount
              ? `${message.thread.messageCount} Message${message.thread.messageCount > 1 ? 's' : ''}`
              : 'View Thread'
          }
        >
          {message.thread.lastMessage ? (
            <DiscordThreadMessage profile={message.thread.lastMessage.author.id}>
              <MessageContent
                content={
                  message.thread.lastMessage.content.length > 128
                    ? message.thread.lastMessage.content.substring(0, 125) + '...'
                    : message.thread.lastMessage.content
                }
                context={{ ...context, type: RenderType.REPLY }}
              />
            </DiscordThreadMessage>
          ) : (
            `Thread messages not saved.`
          )}
        </DiscordThread>
      )}
    </DiscordMessageComponent>
  );
}
