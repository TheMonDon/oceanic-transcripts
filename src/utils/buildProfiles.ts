import { type Member, type Message, type User, UserFlags } from 'oceanic.js';

export type Profile = {
  author: string; // author of the message
  avatar?: string; // avatar of the author
  roleColor?: string; // role color of the author
  roleIcon?: string; // role color of the author
  roleName?: string; // role name of the author

  bot?: boolean; // is the author a bot
  verified?: boolean; // is the author verified
};

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};

  // loop through messages
  for (const message of messages) {
    // add all users
    const author = message.author;
    if (!profiles[author.id]) {
      // add profile
      profiles[author.id] = await buildProfile(message.member, author);
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
