import { DiscordReply } from '@derockdev/discord-components-react';
import { type Message, UserFlags, ChannelTypes, GuildChannel } from 'oceanic.js';
import type { RenderMessageContext } from '..';
import React from 'react';
import MessageContent, { RenderType } from './content';

export default async function MessageReply({ message, context }: { message: Message; context: RenderMessageContext }) {
  if (!message.referencedMessage) return null;
  if ((message.referencedMessage.channel as GuildChannel).guildID !== (message.channel as GuildChannel).guildID) return null;
  const referencedMessage = context.messages.find((m) => m.id === message.referencedMessage!.id);
  
  if (!referencedMessage) return <DiscordReply slot="reply">Message could not be loaded.</DiscordReply>;
  const referencedMember = context.profiles[referencedMessage.author.id];
  const isCrosspost =
    message.referencedMessage &&
    (message.referencedMessage.channel as GuildChannel).guildID &&
    message.guildID &&
    (message.referencedMessage.channel as GuildChannel).guildID != (message.channel as GuildChannel).guildID;
  const isCommand = referencedMessage.interactionMetadata !== undefined;
  return (
    <DiscordReply
      slot="reply"
      edited={!isCommand && referencedMessage.editedTimestamp !== null}
      attachment={referencedMessage.attachments.size > 0}
      author={
        referencedMember?.author ?? referencedMessage.author.globalName ?? referencedMessage.author.username
      }
      avatar={referencedMessage.author.avatarURL('png', 32) ?? undefined}
      roleColor={referencedMember?.roleColor}
      bot={!isCrosspost && referencedMessage.author.bot}
      verified={(referencedMessage.author.publicFlags & UserFlags.VERIFIED_BOT) !== 0}
      op={
        (message?.channel?.type === ChannelTypes.PRIVATE_THREAD ||
        message?.channel?.type === ChannelTypes.PUBLIC_THREAD) &&
          referencedMessage.author.id === message?.channel?.ownerID
      }
      server={!!isCrosspost}
      command={isCommand}
    >
      {referencedMessage.content ? (
        <span data-goto={referencedMessage.id}>
          <MessageContent content={referencedMessage.content} context={{ ...context, type: RenderType.REPLY }} />
        </span>
      ) : isCommand ? (
        <em data-goto={referencedMessage.id}>Click to see command.</em>
      ) : (
        <em data-goto={referencedMessage.id}>Click to see attachment.</em>
      )}
    </DiscordReply>
  );
}
