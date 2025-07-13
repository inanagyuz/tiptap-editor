/**
 * @module Extensions
 *
 * This module defines the default Tiptap editor extensions used throughout the application.
 * It includes formatting, lists, tables, images, code blocks, placeholders, multi-language support, and more.
 *
 * @remarks
 * - Extensions are configured for advanced rich text editing features.
 * - Placeholder extension uses i18n for multi-language placeholder text.
 * - Custom AIHighlight extension for purple highlights.
 * - ImageUpload extension supports file size limits and error handling.
 * - TableKit extension enables resizable tables.
 * - All extensions are filtered to remove any falsy values before export.
 *
 * @example
 * ```tsx
 * import { defaultExtensions } from './extensions';
 * const editor = useEditor({ extensions: defaultExtensions });
 * ```
 *
 * @property defaultExtensions - Array of configured Tiptap extensions for the editor.
 */
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import { Twitter } from './extensions/twitter';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Mathematics from '@tiptap/extension-mathematics';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle, Color, FontFamily, FontSize, LineHeight } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { ImageUpload, ImageResizer } from './image-upload';
import { MAX_FILE_SIZE, handleImageUpload } from './tiptap-utils';
import { TableKit } from '@tiptap/extension-table';
import { i18n } from './i18n';

const lowlight = createLowlight(common);
/**
 * Custom extension for AI highlights (purple color).
 */
const AIHighlight = Highlight.extend({
   name: 'aiHighlight',

   addCommands() {
      return {
         setAIHighlight:
            () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ({ commands }: { commands: any }) => {
               return commands.setHighlight({ color: '#7c3aed' }); // Purple highlight
            },
         unsetAIHighlight:
            () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ({ commands }: { commands: any }) => {
               return commands.unsetHighlight();
            },
      };
   },
});

/**
 * The default set of Tiptap editor extensions.
 */
export const defaultExtensions = [
   Placeholder.configure({
      /**
       * Returns the placeholder text for a given node.
       * Uses i18n for multi-language support.
       *
       * @param node - The ProseMirror node.
       * @returns Placeholder string.
       */
      placeholder: ({ node }) => {
         if (
            node.type.name === 'tableCell' ||
            node.type.name === 'tableHeader' ||
            node.type.name === 'table'
         ) {
            return '';
         }
         if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
         }
         return i18n.t('PLACEHOLDER');
      },
      includeChildren: false,
   }),
   AIHighlight,

   StarterKit.configure({
      heading: {
         levels: [1, 2, 3, 4, 5, 6],
      },
      bulletList: {
         HTMLAttributes: {
            class: 'prose-bullet-list',
         },
         itemTypeName: 'listItem',
         keepMarks: true,
         keepAttributes: false,
      },
      listItem: {
         HTMLAttributes: {
            class: 'prose-list-item',
         },
      },
      orderedList: {
         HTMLAttributes: {
            class: 'ordered-list',
         },
      },
      blockquote: {
         HTMLAttributes: {
            class: 'blockquote border-l-4 border-gray-300 pl-4 italic',
         },
      },
      codeBlock: false,
      link: false,
   }),
   TextStyle,
   Color,
   FontFamily,
   FontSize,
   Typography,
   LineHeight,
   TextAlign.configure({
      types: ['heading', 'paragraph'],
   }),
   TaskList,
   TaskItem.configure({
      nested: true,
   }),
   CharacterCount.configure(),
   Youtube.configure({
      controls: true,
      nocookie: true,
      HTMLAttributes: {
         class: 'youtube-embed',
      },
   }),
   Twitter,
   Subscript,
   Superscript,
   Mathematics.configure({
      katexOptions: {
         throwOnError: false,
         macros: {
            '\\R': '\\mathbb{R}',
            '\\N': '\\mathbb{N}',
         },
      },
   }),
   CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
         class: 'code-block bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm',
      },
   }),
   Highlight.configure({ multicolor: true }),
   Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https'],
      HTMLAttributes: {
         class: 'text-blue-600 underline hover:text-blue-800 transition-colors',
         rel: 'noopener noreferrer',
      },

      isAllowedUri: (url, ctx) => {
         try {
            const parsedUrl = url.includes(':')
               ? new URL(url)
               : new URL(`${ctx.defaultProtocol}://${url}`);
            if (!ctx.defaultValidate(parsedUrl.href)) {
               return false;
            }
            const disallowedProtocols = ['ftp', 'file', 'mailto'];
            const protocol = parsedUrl.protocol.replace(':', '');

            if (disallowedProtocols.includes(protocol)) {
               return false;
            }
            const allowedProtocols = ctx.protocols.map((p) =>
               typeof p === 'string' ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
               return false;
            }
            const disallowedDomains = [
               'example-phishing.com',
               'malicious-site.net',
               'suspicious-site.com',
               'fake-bank.com',
            ];
            const domain = parsedUrl.hostname.toLowerCase();

            if (disallowedDomains.includes(domain)) {
               return false;
            }
            if (domain.includes('phishing') || domain.includes('malware')) {
               return false;
            }
            const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipRegex.test(domain)) {
               return false;
            }
            return true;
         } catch {
            return false;
         }
      },

      shouldAutoLink: (url) => {
         try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`);
            const disallowedDomains = [
               'example-no-autolink.com',
               'another-no-autolink.com',
               'example-phishing.com',
               'malicious-site.net',
            ];
            const domain = parsedUrl.hostname.toLowerCase();
            if (domain.includes('phishing') || domain.includes('malware')) {
               return false;
            }
            return !disallowedDomains.includes(domain);
         } catch {
            return false;
         }
      },
   }).extend({
      addAttributes() {
         return {
            ...(typeof this.parent === 'function' ? this.parent() : {}),
            target: {
               default: '_self',
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               parseHTML: (element: { getAttribute: (arg0: string) => any }) =>
                  element.getAttribute('target'),
               renderHTML: (attributes: { target: string }) => {
                  if (!attributes.target) return {};
                  return { target: attributes.target };
               },
            },
         };
      },
   }),

   Image.configure({
      HTMLAttributes: {
         class: 'editor-image',
      },
   }),
   ImageUpload.configure({
      accept: 'image/*',
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: handleImageUpload,
      onError: (error) => console.error('Image upload failed:', error),
   }),
   ImageResizer,
   TableKit.configure({
      table: { resizable: true },
   }),
].filter(Boolean); // Filter out any falsy values
