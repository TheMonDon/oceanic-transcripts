import { createTranscript } from '../src';
import { Client } from 'oceanic.js';

const client = new Client({
  auth: `Bot (TOKEN)`,
  gateway: { intents: ['GUILDS', 'GUILD_MESSAGES', 'MESSAGE_CONTENT', 'GUILD_MEMBERS'] },
});

client.on('ready', async () => {
  console.log('Ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.channel) return;
  if (message.content === '!t') {
    console.log('Generating transcript');
    console.time('transcript');

    const startTyping = () => message.channel?.sendTyping();
    startTyping();
    const typingInterval = setInterval(startTyping, 7000);

    const attachment = await createTranscript(message.channel);

    clearInterval(typingInterval);

    console.timeEnd('transcript');
    console.log('Generated transcript');
    await message.channel?.createMessage({
      files: [attachment],
      content: 'Here is the transcript!',
    });
  }
});

client.connect();
