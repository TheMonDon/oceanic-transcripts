import { GuildChannel, type Member, type Message, type User, UserFlags } from 'oceanic.js';
import { Profile } from '../types';

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};
  let members: Map<string, Member> | null = null;

  try {
    members = new Map(
      (await (messages[0].channel as GuildChannel).guild.fetchMembers()).map((member) => [member.id, member])
    );
  } catch (error) {
    console.error('Failed to fetch members in bulk, will fetch individually as needed.', error);
  }

  // loop through messages
  for (const message of messages) {
    async function getMember(userId: string): Promise<Member | null> {
      if (members) {
        return members.get(userId) || null;
      } else {
        return await (message.channel as GuildChannel).guild.getMember(userId).catch(() => null);
      }
    }

    // add all users
    const author = message.author;
    if (!profiles[author.id]) {
      const member = await getMember(author.id);
      profiles[author.id] = await buildProfile(member, author);
    }

    // add interaction users
    if (message.interactionMetadata) {
      const user = message.interactionMetadata.user;
      if (!profiles[user.id]) {
        const member = await getMember(user.id);
        profiles[user.id] = await buildProfile(member, user);
      }
    }

    // threads
    if (message.thread && message.thread.lastMessage) {
      const threadAuthor = message.thread.lastMessage.author;
      if (!profiles[threadAuthor.id]) {
        const member = await getMember(threadAuthor.id);
        profiles[threadAuthor.id] = await buildProfile(member, threadAuthor);
      }
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
