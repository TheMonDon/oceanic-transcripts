import {
  ChannelTypes,
  type TextableChannel,
  type AnyTextableChannel,
  type Message,
  type Role,
  type User,
} from 'oceanic.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { revealSpoiler, scrollToMessage } from '../static/client';
import { readFileSync } from 'fs';
import path from 'path';
import { renderToString } from '@derockdev/discord-components-core/hydrate';
import { streamToString } from '../utils/utils';
import DiscordMessages from './transcript';
import { Profile } from '../types';

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = '^3.6.1';

try {
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
  const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
  discordComponentsVersion = packageJSON.dependencies['@derockdev/discord-components-core'] ?? discordComponentsVersion;
  // eslint-disable-next-line no-empty
} catch {} // ignore errors

export type RenderMessageContext = {
  messages: Message[];
  channel: TextableChannel | AnyTextableChannel;
  profiles: Record<string, Profile>;
  callbacks: {
    resolveChannel: (channelId: string) => Promise<TextableChannel | AnyTextableChannel | null>;
    resolveUser: (userId: string) => Promise<User | null>;
    resolveRole: (roleId: string) => Promise<Role | null>;
  };

  poweredBy?: boolean;
  footerText?: string;
  saveImages: boolean;
  favicon: 'guild' | string;
  hydrate: boolean;
};

export default async function render({ messages, profiles, channel, callbacks, ...options }: RenderMessageContext) {
  // NOTE: this renders a STATIC site with no interactivity
  // if interactivity is needed, switch to renderToPipeableStream and use hydrateRoot on client.
  const stream = ReactDOMServer.renderToStaticNodeStream(
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* favicon */}
        <link
          rel="icon"
          type="image/png"
          href={
            options.favicon === 'guild'
              ? channel.type === ChannelTypes.DM
                ? undefined
                : channel.guild.iconURL('png', 16) ?? undefined
              : options.favicon
          }
        />

        {/* title */}
        <title>{channel.type === ChannelTypes.DM ? 'Direct Messages' : channel.name}</title>

        {/* message reference handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: scrollToMessage,
          }}
        />

        {!options.hydrate && (
          <>
            {/* profiles */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.$discordMessage={profiles:${JSON.stringify(profiles)}}`,
              }}
            ></script>
            {/* component library */}
            <script
              type="module"
              src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}
            ></script>
          </>
        )}
      </head>

      <body
        style={{
          margin: 0,
          minHeight: '100vh',
        }}
      >
        <DiscordMessages messages={messages} channel={channel} profiles={profiles} callbacks={callbacks} {...options} />
      </body>

      {/* Make sure the script runs after the DOM has loaded */}
      {options.hydrate && <script dangerouslySetInnerHTML={{ __html: revealSpoiler }}></script>}
    </html>
  );

  const markup = await streamToString(stream);

  if (options.hydrate) {
    const result = await renderToString(markup, {
      beforeHydrate: async (document) => {
        document.defaultView.$discordMessage = {
          profiles: profiles,
        };
      },
    });

    return result.html;
  }

  return markup;
}
