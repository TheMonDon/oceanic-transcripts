# `oceanic-transcripts`

[![Discord](https://img.shields.io/discord/579742127676981269?label=discord)](https://discord.gg/XvHzUNZDdR)
[![npm](https://img.shields.io/npm/dw/oceanic-transcripts)](http://npmjs.org/package/oceanic-transcripts)
![GitHub package.json version](https://img.shields.io/github/package-json/v/TheMonDon/oceanic-transcripts)
![GitHub Repo stars](https://img.shields.io/github/stars/TheMonDon/oceanic-transcripts?style=social)

Oceanic Transcripts is a node.js module to generate nice looking HTML transcripts. Processes discord markdown like **bold**, _italics_, ~~strikethroughs~~, and more. Nicely formats attachments and embeds. Built in XSS protection, preventing users from inserting arbitrary html tags.

This module can format the following:

- Discord flavored markdown
  - Uses [discord-markdown-parser](https://github.com/ItzDerock/discord-markdown-parser)
  - Allows for complex markdown syntax to be parsed properly
- Embeds
- System messages
  - Join messages
  - Message Pins
  - Boost messages
- Slash commands
  - Will show the name of the command in the same style as Discord
- Buttons
- Reactions
- Attachments
  - Images, videos, audio, and generic files
- Replies
- Mentions
- Threads

**This module is designed to work with [Oceanic.js](https://oceanic.ws/) v1.11.0**

Styles from [@derockdev/discord-components](https://github.com/ItzDerock/discord-components).  
Behind the scenes, this package uses React SSR to generate a static site.

## 👋 Support

Please do not DM me requesting support with this package, I will not respond.  
Instead, please open a thread on [this](https://discord.gg/XvHzUNZDdR) server.

## 🖨️ Example Output

![output](https://derock.media/r/6G6FIl.gif)

## 📝 Usage

### Example usage using the built in message fetcher.

```js
const discordTranscripts = require('oceanic-transcripts');
// or (if using typescript) import * as discordTranscripts from 'oceanic-transcripts';

const channel = message.channel; // or however you get your TextChannel

// Must be awaited
const attachment = await discordTranscripts.createTranscript(channel);

channel.createMessage({
  files: [attachment],
});
```

### Or if you prefer, you can pass in your own messages.

```js
const discordTranscripts = require('oceanic-transcripts');
// or (if using typescript) import * as discordTranscripts from 'discord-html-transcripts';

const messages = someWayToGetMessages(); // Must be Collection<string, Message> or Message[]
const channel = someWayToGetChannel(); // Used for ticket name, guild icon, and guild name

// Must be awaited
const attachment = await discordTranscripts.generateFromMessages(messages, channel);

channel.createMessage({
  files: [attachment],
});
```

## ⚙️ Configuration

Both methods of generating a transcript allow for an option object as the last parameter.  
**All configuration options are optional!**

### Built in Message Fetcher

```js
const attachment = await discordTranscripts.createTranscript(channel, {
    limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
    filename: 'transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
    footerText: "Exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
    callbacks: {
      // register custom callbacks for the following:
      resolveChannel: (channelId: string) => Awaitable<Channel | null>,
      resolveUser: (userId: string) => Awaitable<User | null>,
      resolveRole: (roleId: string) => Awaitable<Role | null>
    },
    poweredBy: true, // Whether to include the "Powered by oceanic-transcripts" footer
    hydrate: true // Whether to hydrate the html server-side
});
```

### Providing your own messages

```js
const attachment = await discordTranscripts.generateFromMessages(messages, channel, {
  // Same as createTranscript, except no limit
});
```

## 🤝 Enjoy the package?

Give it a star ⭐
