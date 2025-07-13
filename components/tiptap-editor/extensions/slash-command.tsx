/**
 * @module SlashCommand
 *
 * This file contains the Slash Command extension for the Tiptap editor.
 * It provides a command menu that appears when the user types "/" in the editor.
 *
 * - SlashCommandList: React component that displays available slash commands and allows selection.
 * - SlashCommand: Tiptap Extension that manages the "/" command menu logic.
 * - slashCommandSuggestion: Configuration for command suggestions and popup rendering.
 *
 * Multi-language support is provided via the i18n utility. Commands include formatting, tables, media, AI, and utility actions.
 *
 * Keyboard navigation is supported (up/down/enter).
 *
 * @example
 * ```tsx
 * editor.use(SlashCommand)
 * ```
 */
import React from 'react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import {
   Heading1,
   Heading2,
   Heading3,
   List,
   ListOrdered,
   CheckSquare,
   Type,
   Bold,
   Italic,
   Underline,
   Strikethrough,
   Code,
   Subscript,
   Superscript,
   TextQuote,
   Minus,
   Youtube,
   Table,
   Eraser,
   Upload,
   Link2,
   Images,
   Twitter,
   Sparkles,
   Download,
} from 'lucide-react';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import type { Editor, Range } from '@tiptap/core';
import {
   twitterCommand,
   youtubeCommand,
   imageCommand,
   imageGalleryCommand,
   imageUrlCommand,
   importCommand,
   exportCommand,
} from '../selector';
import { contextAICommand } from './context-ai';
import { i18n } from '../i18n';

/**
 * Represents a single slash command item.
 *
 * @property title - The command title (multi-language key)
 * @property description - The command description (optional, multi-language key)
 * @property searchTerms - Searchable keywords for the command
 * @property shortcut - Keyboard shortcut (optional)
 * @property icon - Icon component for the command
 * @property command - Function to execute when the command is selected
 */

interface SlashCommandItem {
   title: string;
   description?: string;
   searchTerms?: string[];
   shortcut?: string;
   icon?: React.ReactNode;
   command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

/**
 * Props for the SlashCommandList component.
 *
 * @property items - List of available slash commands
 * @property command - Function to execute when a command is selected
 */
interface SlashCommandListProps {
   items: SlashCommandItem[];
   command: (item: SlashCommandItem) => void;
}

/**
 * Ref interface for SlashCommandList, exposing keyboard event handling.
 *
 * @property onKeyDown - Function to handle keyboard events
 */

interface SlashCommandListRef {
   onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

/**
 * SlashCommandList component displays the list of slash commands and handles selection.
 * Supports keyboard navigation (up/down/enter).
 *
 * @param props - SlashCommandListProps, contains command list and selection handler
 * @param ref - Used for external keyboard event handling
 */
const SlashCommandList = React.forwardRef<SlashCommandListRef, SlashCommandListProps>(
   (props, ref) => {
      const [selectedIndex, setSelectedIndex] = React.useState(0);

      const selectItem = React.useCallback(
         (index: number) => {
            const item = props.items[index];
            if (item) {
               props.command(item);
            }
         },
         [props]
      );

      const upHandler = React.useCallback(() => {
         setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
      }, [selectedIndex, props.items.length]);

      const downHandler = React.useCallback(() => {
         setSelectedIndex((selectedIndex + 1) % props.items.length);
      }, [selectedIndex, props.items.length]);

      const enterHandler = React.useCallback(() => {
         selectItem(selectedIndex);
      }, [selectedIndex, selectItem]);

      React.useEffect(() => setSelectedIndex(0), [props.items]);

      React.useImperativeHandle(ref, () => ({
         onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
               upHandler();
               return true;
            }

            if (event.key === 'ArrowDown') {
               downHandler();
               return true;
            }

            if (event.key === 'Enter') {
               enterHandler();
               return true;
            }

            return false;
         },
      }));

      return (
         <div className="z-50 h-auto max-h-[330px] max-w-56 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            {props.items.length ? (
               props.items.map((item, index) => (
                  <button
                     className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent ${
                        index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
                     }`}
                     key={index}
                     onClick={() => selectItem(index)}
                  >
                     <div className="flex h-6 w-6 items-center justify-center rounded-md border border-muted bg-background">
                        {item.icon || <span className="text-lg">📝</span>}
                     </div>
                     <div className="flex-1 max-w-40">
                        <p className="font-medium text-xs">{i18n.t(item.title)}</p>
                        {/* {item.description && (
                           <p className="text-xs text-muted-foreground">
                              {i18n.t(item.description)}
                           </p>
                        )} */}
                     </div>
                  </button>
               ))
            ) : (
               <div className="item">No result</div>
            )}
         </div>
      );
   }
);

SlashCommandList.displayName = 'SlashCommandList';

/**
 * SlashCommand Tiptap Extension.
 * Manages the "/" command menu in the editor.
 *
 * @remarks
 * - Uses Suggestion plugin for command triggering.
 * - Handles command execution and menu rendering.
 */
export const SlashCommand = Extension.create({
   name: 'slashCommand',

   addOptions() {
      return {
         suggestion: {
            char: '/',
            command: ({
               editor,
               range,
               props,
            }: {
               editor: Editor;
               range: Range;
               props: SlashCommandItem;
            }) => {
               props.command({ editor, range });
            },
         },
      };
   },

   addProseMirrorPlugins() {
      return [
         Suggestion({
            editor: this.editor,
            ...this.options.suggestion,
         }),
      ];
   },
});

/**
 * Configuration for slash command suggestions and popup rendering.
 *
 * @remarks
 * - Commands include formatting, headings, lists, media, AI, and utilities.
 * - Multi-language support via i18n.t.
 * - The render function manages the popup lifecycle.
 *
 * @param query - User search query
 * @returns Filtered command list and popup render logic
 */
export const slashCommandSuggestion = {
   items: ({
      query,
      showImageUrl,
      showImageUpload,
      showImageGallery,
      showImportData,
      showExportData,
   }: {
      query: string;
      showImageUrl?: boolean;
      showImageUpload?: boolean;
      showImageGallery?: boolean;
      showImportData?: boolean;
      showExportData?: boolean;
   }) => {
      let items: SlashCommandItem[] = [
         {
            title: 'CONTEXT_AI',
            description: 'AI_CONTENT_GENERATION',
            searchTerms: ['ai', 'artificial', 'intelligence', 'generate', 'context', 'assistant'],
            icon: <Sparkles className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               contextAICommand({ editor });
            },
         },
         {
            title: 'TEXT',
            description: 'START_TYPING',
            searchTerms: ['p', 'paragraph', 'text', 'plain'],
            icon: <Type className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).clearNodes().run();
            },
         },
         {
            title: 'BOLD',
            description: 'BOLD_TEXT',
            searchTerms: ['bold', 'strong', 'b'],
            shortcut: 'Ctrl+B',
            icon: <Bold className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleBold().run();
            },
         },
         {
            title: 'ITALIC',
            description: 'ITALIC_TEXT',
            searchTerms: ['italic', 'i', 'em'],
            shortcut: 'Ctrl+I',
            icon: <Italic className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleItalic().run();
            },
         },
         {
            title: 'UNDERLINE',
            description: 'UNDERLINE_TEXT',
            searchTerms: ['underline', 'u'],
            shortcut: 'Ctrl+U',
            icon: <Underline className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleUnderline().run();
            },
         },
         {
            title: 'STRIKETHROUGH',
            description: 'STRIKETHROUGH_TEXT',
            searchTerms: ['strikethrough', 'strike', 's'],
            shortcut: 'Ctrl+Shift+S',
            icon: <Strikethrough className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleStrike().run();
            },
         },
         {
            title: 'CODE',
            description: 'INLINE_CODE',
            searchTerms: ['code', 'inline', 'c'],
            shortcut: 'Ctrl+E',
            icon: <Code className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleCode().run();
            },
         },
         {
            title: 'SUBSCRIPT',
            description: 'SUBSCRIPT_TEXT',
            searchTerms: ['subscript', 'sub'],
            shortcut: 'Ctrl+,',
            icon: <Subscript className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleSubscript().run();
            },
         },
         {
            title: 'SUPERSCRIPT',
            description: 'SUPERSCRIPT_TEXT',
            searchTerms: ['superscript', 'super', 'sup'],
            shortcut: 'Ctrl+.',
            icon: <Superscript className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleSuperscript().run();
            },
         },
         // Heading commands
         {
            title: 'HEADING',
            description: 'BIG_SECTION_HEADING',
            searchTerms: ['h1', 'heading1', 'title', 'big'],
            icon: <Heading1 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
            },
         },
         {
            title: 'HEADING',
            description: 'MEDIUM_SECTION_HEADING',
            searchTerms: ['h2', 'heading2', 'subtitle'],
            icon: <Heading2 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
            },
         },
         {
            title: 'HEADING',
            description: 'SMALL_SECTION_HEADING',
            searchTerms: ['h3', 'heading3', 'subheading'],
            icon: <Heading3 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
            },
         },
         // List commands
         {
            title: 'BULLET_LIST',
            description: 'UNORDERED_LIST_BULLETS',
            searchTerms: ['bullet', 'list', 'ul', 'unordered'],
            icon: <List className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
         },
         {
            title: 'NUMBERED_LIST',
            description: 'ORDERED_LIST_NUMBERS',
            searchTerms: ['numbered', 'ordered', 'ol', '1', 'list'],
            icon: <ListOrdered className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
         },
         {
            title: 'TASK_LIST',
            description: 'INTERACTIVE_TASK_LIST',
            searchTerms: ['task', 'todo', 'checkbox', 'check'],
            icon: <CheckSquare className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
         },
         // Block elements
         {
            title: 'BLOCK_QUOTE',
            description: 'INSERT_BLOCK_QUOTE',
            searchTerms: ['quote', 'blockquote', 'citation'],
            shortcut: 'Ctrl+Shift+Q',
            icon: <TextQuote className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).toggleBlockquote().run();
            },
         },
         {
            title: 'CODE_BLOCK',
            description: 'INSERT_CODE_BLOCK',
            searchTerms: ['code', 'codeblock', 'pre', 'programming'],
            shortcut: 'Ctrl+Shift+C',
            icon: <Code className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).setCodeBlock().run();
            },
         },
         {
            title: 'HORIZONTAL_RULE',
            description: 'INSERT_HORIZONTAL_RULE',
            searchTerms: ['hr', 'horizontal', 'rule', 'divider', 'separator'],
            shortcut: 'Ctrl+Shift+H',
            icon: <Minus className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).setHorizontalRule().run();
            },
         },

         // Media and advanced elements
         {
            title: 'UPLOAD_IMAGE',
            description: 'UPLOAD_IMAGE_FROM_DEVICE',
            searchTerms: ['upload', 'image', 'file', 'photo', 'picture', 'resim', 'yükle'],
            icon: <Upload className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               imageCommand({ editor });
            },
         },
         {
            title: 'IMAGE_URL',
            description: 'ADD_IMAGE_FROM_URL',
            searchTerms: ['image', 'url', 'link', 'web', 'resim', 'bağlantı'],
            icon: <Link2 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               imageUrlCommand({ editor });
            },
         },
         {
            title: 'IMAGE_GALLERY',
            description: 'SELECT_FROM_GALLERY',
            searchTerms: ['gallery', 'library', 'stored', 'saved', 'collection', 'galeri'],
            icon: <Images className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               imageGalleryCommand({ editor });
            },
         },
         {
            title: 'YOUTUBE',
            description: 'EMBED_YOUTUBE_VIDEO',
            searchTerms: ['youtube', 'video', 'embed'],
            icon: <Youtube className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               youtubeCommand({ editor });
            },
         },
         {
            title: 'TWITTER',
            description: 'EMBED_TWITTER_POST',
            searchTerms: ['twitter', 'x', 'tweet', 'social'],
            icon: <Twitter className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               twitterCommand({ editor });
            },
         },
         {
            title: 'TABLE',
            description: 'CREATE_TABLE',
            searchTerms: ['table', 'grid', 'rows', 'columns'],
            icon: <Table className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run();
            },
         },
         {
            title: 'IMPORT_CONTENT',
            description: 'IMPORT_FROM_FILE_URL_TEXT',
            searchTerms: ['import', 'içe', 'aktar', 'yükle', 'dosya', 'file', 'upload'],
            icon: <Upload className="w-4 h-4 text-blue-500" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               importCommand({ editor });
            },
         },
         {
            title: 'EXPORT_CONTENT',
            description: 'EXPORT_TO_DOCX_HTML_MARKDOWN',
            searchTerms: ['export', 'dışa', 'aktar', 'kaydet', 'indir', 'download', 'save'],
            icon: <Download className="w-4 h-4 text-green-500" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).run();
               exportCommand({ editor });
            },
         },

         // Utility commands
         {
            title: 'CLEAR_FORMATTING',
            description: 'CLEAR_ALL_FORMATTING',
            searchTerms: ['clear', 'remove', 'formatting', 'reset'],
            shortcut: 'Ctrl+Shift+X',
            icon: <Eraser className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
               editor.chain().focus().deleteRange(range).clearNodes().unsetAllMarks().run();
            },
         },
      ];

      items = items.filter((item) => {
         if (item.title === 'IMAGE_URL' && !showImageUrl) return false;
         if (item.title === 'UPLOAD_IMAGE' && !showImageUpload) return false;
         if (item.title === 'IMAGE_GALLERY' && !showImageGallery) return false;
         if (item.title === 'IMPORT_CONTENT' && !showImportData) return false;
         if (item.title === 'EXPORT_CONTENT' && !showExportData) return false;
         return true;
      });

      console.log('Slash command items:', showImageUrl);

      return items.filter(
         (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.searchTerms?.some((term) => term.toLowerCase().includes(query.toLowerCase()))
      );
   },
   render: () => {
      let component: ReactRenderer | null = null;
      let popup: HTMLDivElement | null = null;
      let cleanup: (() => void) | undefined;

      return {
         onStart: (props: {
            editor: Editor;
            clientRect: () => DOMRect;
            items: SlashCommandItem[];
            command: (item: SlashCommandItem) => void;
            range: Range;
         }) => {
            try {
               component = new ReactRenderer(SlashCommandList, {
                  props: {
                     items: props.items,
                     command: props.command,
                  },
                  editor: props.editor,
               });

               if (!props.clientRect) {
                  return;
               }

               popup = document.createElement('div');
               popup.style.position = 'absolute';
               popup.style.zIndex = '1000';
               popup.appendChild(component.element);
               document.body.appendChild(popup);

               const virtualElement = {
                  getBoundingClientRect: () => props.clientRect(),
               };

               const updatePosition = () => {
                  if (!popup) return;

                  computePosition(virtualElement, popup, {
                     placement: 'bottom-start',
                     middleware: [offset(8), flip(), shift({ padding: 8 })],
                  }).then(({ x, y }) => {
                     if (popup) {
                        popup.style.left = `${x}px`;
                        popup.style.top = `${y}px`;
                     }
                  });
               };

               updatePosition();

               cleanup = autoUpdate(virtualElement, popup, updatePosition);
            } catch (error) {
               console.error('Slash command render error:', error);
            }
         },

         onUpdate(props: {
            editor: Editor;
            clientRect: () => DOMRect;
            items: SlashCommandItem[];
            command: (item: SlashCommandItem) => void;
            range: Range;
         }) {
            if (!component) return;

            component.updateProps({
               items: props.items,
               command: props.command,
            });

            if (!props.clientRect || !popup) {
               return;
            }

            const virtualElement = {
               getBoundingClientRect: () => props.clientRect(),
            };

            computePosition(virtualElement, popup, {
               placement: 'bottom-start',
               middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
               if (popup) {
                  popup.style.left = `${x}px`;
                  popup.style.top = `${y}px`;
               }
            });
         },

         onKeyDown(props: { event: KeyboardEvent }) {
            if (props.event.key === 'Escape') {
               cleanup?.();
               popup?.remove();
               return true;
            }

            return (component?.ref as SlashCommandListRef)?.onKeyDown?.(props);
         },

         onExit() {
            try {
               cleanup?.();
               popup?.remove();

               if (component) {
                  component.destroy();
               }
            } catch (error) {
               console.error('Slash command exit error:', error);
            } finally {
               component = null;
               popup = null;
               cleanup = undefined;
            }
         },
      };
   },
};
