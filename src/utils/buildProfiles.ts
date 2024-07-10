import { GuildChannel, type Member, type Message, type User, UserFlags } from 'oceanic.js';
import { Profile } from '../types';

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};

  // loop through messages
  for (const message of messages) {
    // add all users
    const author = message.author;
    if (!profiles[author.id]) {
      // add profile
      const member = (message.channel as GuildChannel).guild.members.get(author.id);
      profiles[author.id] = await buildProfile(member, author);
    }

    // add interaction users
    if (message.interactionMetadata) {
      const user = message.interactionMetadata.user;
      if (!profiles[user.id]) {
        profiles[user.id] = await buildProfile(null, user);
      }
    }

    // threads
    if (message.thread && message.thread.lastMessage) {
      profiles[message.thread.lastMessage.author.id] = await buildProfile(
        message.thread.lastMessage.member,
        message.thread.lastMessage.author
      );
    }
  }

  // return as a JSON
  return profiles;
}

async function buildProfile(member: Member | undefined | null, author: User) {
  const guild = member?.guild;
  const roles = await guild?.getRoles();
  const highestRoleColor = roles
    ?.sort((a, b) => b.position - a.position)
    .find((role) => member?.roles.includes(role.id) && role.color);
  const highestRoleIcon = roles
    ?.sort((a, b) => b.position - a.position)
    .find((role) => member?.roles.includes(role.id) && role.icon);
  const highestRoleName = roles
    ?.sort((a, b) => b.position - a.position)
    .find((role) => member?.roles.includes(role.id) && role.hoist);
  return {
    author: member?.nick ?? author.globalName ?? author.username,
    avatar: member?.avatarURL('jpg', 64) ?? author.avatarURL('jpg', 64),
    roleColor: '#' + highestRoleColor?.color.toString(16).padStart(6, '0') ?? undefined,
    roleIcon: highestRoleIcon?.icon ?? undefined,
    roleName: highestRoleName?.name ?? undefined,
    bot: author.bot,
    verified: (author.publicFlags & UserFlags.VERIFIED_BOT) !== 0,
  };
}
