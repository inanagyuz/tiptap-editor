import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import { Twitter } from './extensions/twitter';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Mathematics from '@tiptap/extension-mathematics';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { CharacterCount } from '@tiptap/extensions';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle, Color, FontFamily, FontSize, LineHeight } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { ImageUpload } from './image-upload/image-upload-extension';
import { MAX_FILE_SIZE, handleImageUpload } from './tiptap-utils';
// ✅ Lowlight instance oluştur
const lowlight = createLowlight(common);

// ✅ AI Highlight Extension'ı oluştur
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

export const defaultExtensions = [
   AIHighlight,
   // ✅ Base Editor Extensions
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
      codeBlock: false, // CodeBlockLowlight ile kullanacağız
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
      // Options for the KaTeX renderer. See here: https://katex.org/docs/options.html
      katexOptions: {
         throwOnError: false, // don't throw an error if the LaTeX code is invalid
         macros: {
            '\\R': '\\mathbb{R}', // add a macro for the real numbers
            '\\N': '\\mathbb{N}', // add a macro for the natural numbers
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
   // ✅ Custom Extensions
   Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https'],
      HTMLAttributes: {
         class: 'text-blue-600 underline hover:text-blue-800 transition-colors',
         rel: 'noopener noreferrer',
      },

      // Güvenlik kontrolleri - link-selector ile tutarlı
      isAllowedUri: (url, ctx) => {
         try {
            // URL'yi parse et
            const parsedUrl = url.includes(':')
               ? new URL(url)
               : new URL(`${ctx.defaultProtocol}://${url}`);

            // Temel validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
               return false;
            }

            // Protocol kontrolü
            const disallowedProtocols = ['ftp', 'file', 'mailto'];
            const protocol = parsedUrl.protocol.replace(':', '');

            if (disallowedProtocols.includes(protocol)) {
               return false;
            }

            // İzin verilen protokoller
            const allowedProtocols = ctx.protocols.map((p) =>
               typeof p === 'string' ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
               return false;
            }

            // Zararlı domain kontrolü
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

            // Şüpheli pattern kontrolü
            if (domain.includes('phishing') || domain.includes('malware')) {
               return false;
            }

            // IP adresi kontrolü
            const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipRegex.test(domain)) {
               return false;
            }

            return true;
         } catch {
            return false;
         }
      },

      // Auto-link kontrolleri
      shouldAutoLink: (url) => {
         try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`);

            // Auto-link için yasaklı domainler
            const disallowedDomains = [
               'example-no-autolink.com',
               'another-no-autolink.com',
               'example-phishing.com',
               'malicious-site.net',
            ];
            const domain = parsedUrl.hostname.toLowerCase();

            // Şüpheli patternlar auto-link'e dahil etme
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
   // Link end extension
   // ✅ Image Extensions
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
].filter(Boolean); // Filter out any falsy values
