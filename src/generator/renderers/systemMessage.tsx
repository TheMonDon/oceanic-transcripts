import { DiscordReaction, DiscordReactions, DiscordSystemMessage } from '@derockdev/discord-components-react';
import { MessageTypes, type Member, type Message, type User } from 'oceanic.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';

export default async function SystemMessage({ message }: { message: Message }) {
  const roles = await message.guild?.getRoles();
  const highestRoleColor = roles
    ?.sort((a, b) => b.position - a.position)
    .find((role) => message.member?.roles.includes(role.id) && role.color);

  switch (message.type) {
    case MessageTypes.RECIPIENT_ADD:
    case MessageTypes.USER_JOIN:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="join">
          <JoinMessage
            member={message.member}
            color={'#' + highestRoleColor?.color.toString(16).padStart(6, '0')}
            fallbackUser={message.author}
          />
        </DiscordSystemMessage>
      );

    case MessageTypes.CHANNEL_PINNED_MESSAGE:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="pin">
          <Highlight color={'#' + highestRoleColor?.color.toString(16).padStart(6, '0')}>
            {message.author.globalName ?? message.author.username}
          </Highlight>{' '}
          pinned <i data-goto={message.referencedMessage?.id}>a message</i> to this channel.
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
        </DiscordSystemMessage>
      );

    case MessageTypes.GUILD_BOOST:
    case MessageTypes.GUILD_BOOST_TIER_1:
    case MessageTypes.GUILD_BOOST_TIER_2:
    case MessageTypes.GUILD_BOOST_TIER_3:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="boost">
          <Highlight color={'#' + highestRoleColor?.color.toString(16).padStart(6, '0')}>
            {message.author.globalName ?? message.author.username}
          </Highlight>{' '}
          boosted the server!
        </DiscordSystemMessage>
      );

    case MessageTypes.THREAD_STARTER_MESSAGE:
      return (
        <DiscordSystemMessage id={`ms-${message.id}`} key={message.id} type="thread">
          <Highlight color={'#' + highestRoleColor?.color.toString(16).padStart(6, '0')}>
            {message.author.globalName ?? message.author.username}
          </Highlight>{' '}
          started a thread: <i data-goto={message.referencedMessage?.id}>{message.content}</i>
        </DiscordSystemMessage>
      );

    default:
      return undefined;
  }
}

export function Highlight({ children, color }: { children: React.ReactNode; color?: string }) {
  return <i style={{ color: color ?? 'white' }}>{children}</i>;
}

const allJoinMessages = [
  '{user} just joined the server - glhf!',
  '{user} just joined. Everyone, look busy!',
  '{user} just joined. Can I get a heal?',
  '{user} joined your party.',
  '{user} joined. You must construct additional pylons.',
  'Ermagherd. {user} is here.',
  'Welcome, {user}. Stay awhile and listen.',
  'Welcome, {user}. We were expecting you ( ͡° ͜ʖ ͡°)',
  'Welcome, {user}. We hope you brought pizza.',
  'Welcome {user}. Leave your weapons by the door.',
  'A wild {user} appeared.',
  'Swoooosh. {user} just landed.',
  'Brace yourselves {user} just joined the server.',
  '{user} just joined. Hide your bananas.',
  '{user} just arrived. Seems OP - please nerf.',
  '{user} just slid into the server.',
  'A {user} has spawned in the server.',
  'Big {user} showed up!',
  "Where's {user}? In the server!",
  '{user} hopped into the server. Kangaroo!!',
  '{user} just showed up. Hold my beer.',
  'Challenger approaching - {user} has appeared!',
  "It's a bird! It's a plane! Nevermind, it's just {user}.",
  "It's {user}! Praise the sun! \\\\[T]/",
  'Never gonna give {user} up. Never gonna let {user} down.',
  'Ha! {user} has joined! You activated my trap card!',
  'Cheers, love! {user} is here!',
  'Hey! Listen! {user} has joined!',
  "We've been expecting you {user}",
  "It's dangerous to go alone, take {user}!",
  "{user} has joined the server! It's super effective!",
  'Cheers, love! {user} is here!',
  '{user} is here, as the prophecy foretold.',
  "{user} has arrived. Party's over.",
  'Ready player {user}',
  '{user} is here to kick butt and chew bubblegum. And {user} is all out of gum.',
  "Hello. Is it {user} you're looking for?",
];

export function JoinMessage({
  member,
  color,
  fallbackUser,
}: {
  member: Member | null | undefined;
  color: string;
  fallbackUser: User;
}) {
  const randomMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];

  return randomMessage
    .split('{user}')
    .flatMap((item, i) => [
      item,
      <Highlight color={color} key={i}>
        {member?.nick ?? fallbackUser.globalName ?? fallbackUser.username}
      </Highlight>,
    ])
    .slice(0, -1);
}
