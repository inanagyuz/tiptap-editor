/**
 * @module Twitter
 *
 * This module provides the Twitter extension for the Tiptap editor.
 * It enables embedding tweets from X (Twitter) by pasting tweet URLs or using commands.
 *
 * @remarks
 * - Supports both inline and block tweet nodes.
 * - Paste handler automatically detects and embeds tweets from URLs.
 * - ReactNodeView is used for rendering tweets with the `react-tweet` package.
 * - Tweet node is draggable and supports custom HTML attributes.
 * - Includes TypeDoc comments for all options and commands.
 *
 * @example
 * ```tsx
 * editor.commands.setTweet({ src: 'https://x.com/username/status/1234567890' })
 * ```
 *
 * @property addPasteHandler - Enables/disables paste handler for tweets.
 * @property HTMLAttributes - Custom HTML attributes for the tweet node.
 * @property inline - Whether the tweet node is inline or block.
 * @property origin - The origin of the tweet.
 */

import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core';
import {
   NodeViewWrapper,
   ReactNodeViewRenderer,
   type ReactNodeViewRendererOptions,
} from '@tiptap/react';
import { Tweet } from 'react-tweet';
import * as React from 'react';

/**
 * Global regex for matching Twitter (X) URLs in pasted content.
 */
export const TWITTER_REGEX_GLOBAL =
   /(https?:\/\/)?(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?/g;

/**
 * Regex for validating a single Twitter (X) URL.
 */
export const TWITTER_REGEX =
   /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/;

/**
 * Checks if a given URL is a valid Twitter (X) tweet URL.
 *
 * @param url - The URL to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidTwitterUrl = (url: string) => {
   return url.match(TWITTER_REGEX);
};

/**
 * React component for rendering a Tweet node.
 *
 * @param node - The node view renderer options.
 */
const TweetComponent = ({ node }: { node: Partial<ReactNodeViewRendererOptions> }) => {
   const url = (node?.attrs as Record<string, string>)?.src;
   const tweetId = url?.split('/').pop();

   if (!tweetId) {
      return null;
   }

   return (
      <NodeViewWrapper>
         <div data-twitter="">
            <Tweet id={tweetId} />
         </div>
      </NodeViewWrapper>
   );
};

/**
 * Options for the Twitter extension.
 */
export interface TwitterOptions {
   /**
    * Controls if the paste handler for tweets should be added.
    * @default true
    * @example false
    */
   addPasteHandler: boolean;

   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   HTMLAttributes: Record<string, any>;

   /**
    * Controls if the twitter node should be inline or not.
    * @default false
    * @example true
    */
   inline: boolean;

   /**
    * The origin of the tweet.
    * @default ''
    * @example 'https://tiptap.dev'
    */
   origin: string;
}

/**
 * The options for setting a tweet.
 */
type SetTweetOptions = { src: string };

declare module '@tiptap/core' {
   interface Commands<ReturnType> {
      twitter: {
         /**
          * Insert a tweet node into the editor.
          *
          * @param options - The tweet attributes.
          * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
          */
         setTweet: (options: SetTweetOptions) => ReturnType;
      };
   }
}

/**
 * Twitter extension for Tiptap editor.
 * Enables embedding tweets via paste or command.
 */
export const Twitter = Node.create<TwitterOptions>({
   name: 'twitter',

   addOptions() {
      return {
         addPasteHandler: true,
         HTMLAttributes: {},
         inline: false,
         origin: '',
      };
   },

   addNodeView() {
      return ReactNodeViewRenderer(TweetComponent, { attrs: this.options.HTMLAttributes });
   },

   inline() {
      return this.options.inline;
   },

   group() {
      return this.options.inline ? 'inline' : 'block';
   },

   draggable: true,

   addAttributes() {
      return {
         src: {
            default: null,
         },
      };
   },

   parseHTML() {
      return [
         {
            tag: 'div[data-twitter]',
         },
      ];
   },

   addCommands() {
      return {
         setTweet:
            (options: SetTweetOptions) =>
            ({ commands }) => {
               if (!isValidTwitterUrl(options.src)) {
                  return false;
               }

               return commands.insertContent({
                  type: this.name,
                  attrs: options,
               });
            },
      };
   },

   addPasteRules() {
      if (!this.options.addPasteHandler) {
         return [];
      }

      return [
         nodePasteRule({
            find: TWITTER_REGEX_GLOBAL,
            type: this.type,
            getAttributes: (match) => {
               return { src: match.input };
            },
         }),
      ];
   },

   renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes({ 'data-twitter': '' }, HTMLAttributes)];
   },
});