import type {
  AnyTextableChannel,
  TextableChannel} from 'oceanic.js';
import {
  ChannelTypes,
  Collection,
  TextableChannelTypes,
  type Message,
} from 'oceanic.js';
import DiscordMessages from './generator';
import {
  ExportReturnType,
  type CreateTranscriptOptions,
  type GenerateFromMessagesOptions,
  type ObjectType,
} from './types';

// re-export component for custom rendering
export { default as DiscordMessages } from './generator/transcript';

/**
 *
 * @param messages The messages to generate a transcript from
 * @param channel  The channel the messages are from (used for header and guild name)
 * @param options  The options to use when generating the transcript
 * @returns        The generated transcript
 */
export async function generateFromMessages<T extends ExportReturnType = ExportReturnType.Attachment>(
  messages: Message[] | Collection<string, Message>,
  channel: TextableChannel | AnyTextableChannel,
  options: GenerateFromMessagesOptions<T> = {}
): Promise<ObjectType<T>> {
  // turn messages into an array
  const transformedMessages = messages instanceof Collection ? Array.from(messages.values()) : messages;

  // const startTime = process.hrtime();

  // render the messages
  const html = await DiscordMessages({
    messages: transformedMessages,
    channel,
    saveImages: options.saveImages ?? false,
    callbacks: {
      resolveChannel: async (id) =>
        channel.client.rest.channels.get(id).catch(() => null) as Promise<TextableChannel | AnyTextableChannel | null>,
      resolveUser: async (id) => channel.client.rest.users.get(id).catch(() => null),
      resolveRole:
        channel.type === ChannelTypes.DM ? async () => null : async (id) => channel.guild?.roles.get(id) ?? null,

      ...(options.callbacks ?? {}),
    },
    poweredBy: options.poweredBy ?? true,
    footerText: options.footerText ?? 'Exported {number} message{s}.',
    favicon: options.favicon ?? 'guild',
    hydrate: options.hydrate ?? false,
  });

  // get the time it took to render the messages
  // const renderTime = process.hrtime(startTime);
  // console.log(
  //   `[discord-html-transcripts] Rendered ${transformedMessages.length} messages in ${renderTime[0]}s ${
  //     renderTime[1] / 1000000
  //   }ms`
  // );

  // return the html in the specified format
  if (options.returnType === ExportReturnType.Buffer) {
    return Buffer.from(html) as unknown as ObjectType<T>;
  }

  if (options.returnType === ExportReturnType.String) {
    return html as unknown as ObjectType<T>;
  }

  return {
    contents: Buffer.from(html),
    name: options.filename ?? `transcript-${channel.id}.html`,
  } as unknown as ObjectType<T>;
}

/**
 *
 * @param channel The channel to create a transcript from
 * @param options The options to use when creating the transcript
 * @returns       The generated transcript
 */
export async function createTranscript<T extends ExportReturnType = ExportReturnType.Attachment>(
  channel: TextableChannel | AnyTextableChannel,
  options: CreateTranscriptOptions<T> = {}
): Promise<ObjectType<T>> {
  // validate type
  if (!TextableChannelTypes.includes(channel.type)) {
    throw new TypeError(`Provided channel must be text-based, received ${channel.type}`);
  }

  // fetch messages
  let allMessages: Message[] = [];
  let lastMessageId: string | undefined;
  const { limit, filter } = options;
  const resolvedLimit = typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

  // until there are no more messages, keep fetching
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // create fetch options
    const fetchLimitOptions = { limit: 100, before: lastMessageId };
    if (!lastMessageId) delete fetchLimitOptions.before;

    // fetch messages
    const messages = await channel.getMessages(fetchLimitOptions);
    const filteredMessages = typeof filter === 'function' ? messages.filter(filter) : messages;

    // add the messages to the array
    allMessages.push(...filteredMessages.values());
    // Get the last key of 'messages', not 'filteredMessages' because you will be refetching the same messages
    lastMessageId =
      messages[messages.length - 1]?.id ??
      filteredMessages[filteredMessages.length - 1]?.id ??
      messages.values().next().value?.id ??
      filteredMessages.values().next().value?.id;

    // if there are no more messages, break
    if (messages.length < 100) break;

    // if the limit has been reached, break
    if (allMessages.length >= resolvedLimit) break;
  }

  if (resolvedLimit < allMessages.length) allMessages = allMessages.slice(0, limit);

  // generate the transcript
  return generateFromMessages<T>(allMessages.reverse(), channel, options);
}

export default {
  createTranscript,
  generateFromMessages,
};
export * from './types';
