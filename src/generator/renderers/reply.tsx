import { DiscordReply } from '@derockdev/discord-components-react';
import { type Message, UserFlags, ChannelTypes } from 'oceanic.js';
import type { RenderMessageContext } from '..';
import React from 'react';
import MessageContent, { RenderType } from './content';

export default async function MessageReply({ message, context }: { message: Message; context: RenderMessageContext }) {
  if (!message.messageReference) return null;
  if (message.messageReference.guildID !== message.guildID) return null;
  
  const referencedMessage = context.messages.find((m) => m.id === message.referencedMessage!.id);
  
  if (!referencedMessage) return <DiscordReply slot="reply">Message could not be loaded.</DiscordReply>;
  const isCrosspost =
    referencedMessage.referencedMessage && 
    referencedMessage.referencedMessage.guildID && 
    message.guildID && 
    referencedMessage.referencedMessage.guildID !== message.guildID;
  const isCommand = referencedMessage.interactionMetadata !== undefined;
  const roles = await message.guild?.getRoles();
  const highestRoleColor = roles
    ?.sort((a, b) => b.position - a.position)
    .find((role) => message.member?.roles.includes(role.id) && role.color);

  return (
    <DiscordReply
      slot="reply"
      edited={!isCommand && referencedMessage.editedTimestamp !== null}
      attachment={referencedMessage.attachments.size > 0}
      author={
        referencedMessage.member?.nick ?? referencedMessage.author.globalName ?? referencedMessage.author.username
      }
      avatar={referencedMessage.author.avatarURL('png', 32) ?? undefined}
      roleColor={'#' + highestRoleColor?.color.toString(16).padStart(6, '0') ?? undefined}
      bot={!isCrosspost && referencedMessage.author.bot}
      verified={(referencedMessage.author.publicFlags & UserFlags.VERIFIED_BOT) !== 0}
      op={
        message?.channel?.type === ChannelTypes.PRIVATE_THREAD ||
        (message?.channel?.type === ChannelTypes.PUBLIC_THREAD &&
          referencedMessage.author.id === message?.channel?.ownerID)
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
