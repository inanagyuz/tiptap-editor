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

// ✅ Lowlight instance oluştur
const lowlight = createLowlight(common);

export const defaultExtensions = [
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
  
].filter(Boolean); // Filter out any falsy values
