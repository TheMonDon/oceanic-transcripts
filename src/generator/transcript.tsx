import { DiscordHeader, DiscordMessages as DiscordMessagesComponent } from '@derockdev/discord-components-react';
import { ChannelTypes } from 'oceanic.js';
import React, { Suspense } from 'react';
import type { RenderMessageContext } from '.';
import MessageContent, { RenderType } from './renderers/content';
import DiscordMessage from './renderers/message';

/**
 * The core transcript component.
 * Expects window.$discordMessage.profiles to be set for profile information.
 *
 * @param props Messages, channel details, callbacks, etc.
 * @returns
 */
export default async function DiscordMessages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  return (
    <DiscordMessagesComponent style={{ minHeight: '100vh' }}>
      {/* header */}
      <DiscordHeader
        guild={channel.type === ChannelTypes.DM ? 'Direct Messages' : channel.guild.name}
        channel={channel.type === ChannelTypes.DM ? channel.recipient?.tag ?? 'Unknown Recipient' : channel.name}
        icon={channel.type === ChannelTypes.DM ? undefined : channel.guild.iconURL('png', 128) ?? undefined}
      >
        {channel.type === ChannelTypes.PUBLIC_THREAD || channel.type === ChannelTypes.PRIVATE_THREAD ? (
          `Thread channel in ${channel.parent?.name ?? 'Unknown Channel'}`
        ) : channel.type === ChannelTypes.DM ? (
          `Direct Messages`
        ) : channel.type === ChannelTypes.GUILD_VOICE ? (
          `Voice Text Channel for ${channel.name}`
        ) : // channel.type === ChannelType.GuildCategory ? (
        //   `Category Channel`
        // ) :
        'topic' in channel && channel.topic ? (
          <MessageContent
            content={channel.topic}
            context={{ messages, channel, callbacks, type: RenderType.REPLY, ...options }}
          />
        ) : (
          `This is the start of #${channel.name} channel.`
        )}
      </DiscordHeader>

      {/* body */}
      <Suspense>
        {messages.map((message) => (
          <DiscordMessage message={message} context={{ messages, channel, callbacks, ...options }} key={message.id} />
        ))}
      </Suspense>

      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        {options.footerText
          ? options.footerText
              .replaceAll('{number}', messages.length.toString())
              .replace('{s}', messages.length > 1 ? 's' : '')
          : `Exported ${messages.length} message${messages.length > 1 ? 's' : ''}.`}{' '}
        {options.poweredBy ? (
          <span style={{ textAlign: 'center' }}>
            Powered by{' '}
            <a href="https://github.com/TheMonDon/oceanic-transcripts" style={{ color: 'lightblue' }}>
              oceanic-transcripts
            </a>
            .
          </span>
        ) : null}
      </div>
    </DiscordMessagesComponent>
  );
}
