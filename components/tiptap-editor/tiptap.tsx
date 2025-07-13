'use client';

/**
 * @module Tiptap
 *
 * This module provides the main Tiptap editor React component.
 * It supports rich text editing, multi-language UI, local storage persistence, and advanced features such as bubble menus, table menus, and drag handles.
 *
 * @remarks
 * - Uses Tiptap extensions for formatting, tables, images, and more.
 * - Supports multi-language UI via the i18n system and LanguageSelector.
 * - Automatically saves and loads editor content from localStorage.
 * - Displays word count, save status, and allows clearing localStorage.
 * - Bubble menus and table menus are shown conditionally via props.
 * - SSR-safe: waits for client-side mount before initializing the editor.
 *
 * @example
 * ```tsx
 * <Tiptap
 *   initialValue={myContent}
 *   onChange={(json) => console.log(json)}
 *   editable={true}
 *   showBubbleMenu={true}
 *   showTableMenu={true}
 * />
 * ```
 *
 * @property initialValue - Initial editor content as JSON.
 * @property onChange - Callback fired when editor content changes.
 * @property editable - Whether the editor is editable.
 * @property className - Custom CSS class for the editor container.
 * @property showBubbleMenu - Whether to show the bubble menu.
 * @property showTableMenu - Whether to show the table menu.
 * @property showFooMenu - Whether to show the foo menu.
 */

import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor, JSONContent, Editor } from '@tiptap/react';
import { SlashCommand, slashCommandSuggestion } from './extensions/slash-command';
import { defaultExtensions } from './extensions';
import { cn } from './tiptap-utils';
import { BubbleMenuSelector, FooMenuSelector, TableBubbleMenu } from './menu';
import { useDebouncedCallback } from 'use-debounce';
import hljs from 'highlight.js';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { GripVertical, Loader } from 'lucide-react';
import { i18n, LanguageSelector } from './i18n';

export interface Props {
   /**
    * Initial editor content as JSON.
    */
   initialValue?: JSONContent | null;
   /**
    * Callback fired when editor content changes.
    */
   onChange?: (value: JSONContent) => void;
   /**
    * Whether the editor is editable.
    */
   editable?: boolean;
   /**
    * Custom CSS class for the editor container.
    */
   className?: string;
   /**
    * Whether to show the bubble menu.
    */
   showBubbleMenu?: boolean;
   /**
    * Whether to show the table menu.
    */
   showTableMenu?: boolean;
   /**
    * Whether to show the foo menu.
    */
   showFooMenu?: boolean;
   /**
    * Whether to show the image URL dialog.
    */
   showImageUrl?: boolean;
   /**
    * Whether to show the image upload dialog.
    */
   showImageUpload?: boolean;
   /**
    * Whether to show the image gallery.
    */
   showImageGallery?: boolean;
   /**
    * Whether to show the import data option.
    */
   showImportData?: boolean;
   /**
    * Whether to show the export data option.
    */
   showExportData?: boolean;
}

/**
 * Tiptap editor React component.
 *
 * @param initialValue - Initial editor content as JSON.
 * @param onChange - Callback fired when editor content changes.
 * @param editable - Whether the editor is editable.
 * @param className - Custom CSS class for the editor container.
 * @param showBubbleMenu - Whether to show the bubble menu.
 * @param showTableMenu - Whether to show the table menu.
 * @param showFooMenu - Whether to show the foo menu.
 * @param showImageUrl - Whether to show the image URL dialog.
 * @param showImageUpload - Whether to show the image upload dialog.
 * @param showImageGallery - Whether to show the image gallery.
 * @param importData - Whether to show the import data option.
 * @param exportData - Whether to show the export data option.
 */

const Tiptap: React.FC<Props> = ({
   initialValue,
   onChange,
   editable = true,
   className,
   showBubbleMenu = true,
   showTableMenu = true,
   showFooMenu = false,
   showImageUrl = false,
   showImageUpload = false,
   showImageGallery = true,
   showImportData = true,
   showExportData = true,
}) => {
   const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
   const [saveStatus, setSaveStatus] = useState('Saved');
   const [charsCount, setCharsCount] = useState<number | undefined>();
   const [isMounted, setIsMounted] = useState(false);

   // Ensure client-side mounting before initializing the editor
   useEffect(() => {
      setIsMounted(true);
   }, []);

   /**
    * Highlights code blocks in the editor HTML using highlight.js.
    *
    * @param content - HTML content from the editor.
    * @returns Highlighted HTML string.
    */
   const highlightCodeblocks = (content: string) => {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      doc.querySelectorAll('pre code').forEach((el) => {
         hljs.highlightElement(el as HTMLElement);
      });
      return new XMLSerializer().serializeToString(doc);
   };

   /**
    * Debounced callback for saving editor content and updating word count.
    *
    * @param editor - The Tiptap editor instance.
    */
   const debouncedUpdates = useDebouncedCallback(async (editor: Editor) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem('inan-html-content', highlightCodeblocks(editor.getHTML()));
      window.localStorage.setItem('inan-json-content', JSON.stringify(json));
      setSaveStatus(i18n.t('SAVED'));
   }, 500);

   /**
    * Clears editor content from localStorage and resets the editor.
    */
   const clearLocalStorage = () => {
      window.localStorage.removeItem('inan-html-content');
      window.localStorage.removeItem('inan-json-content');
      setInitialContent(null);
      if (editor) {
         editor.commands.clearContent();
      }
      setSaveStatus(i18n.t('CLEARED'));
   };

   // Load initial content from localStorage or props
   useEffect(() => {
      if (!isMounted) return;
      const content = window.localStorage.getItem('inan-json-content');
      if (content) setInitialContent(JSON.parse(content));
      else setInitialContent(initialValue ?? null);
   }, [initialValue, isMounted]);

   const editor = useEditor(
      {
         shouldRerenderOnTransaction: true,
         extensions: [
            SlashCommand.configure({
               suggestion: slashCommandSuggestion,
               showImageUrl,
               showImageUpload,
               showImageGallery,
               showImportData,
               showExportData,
            }),
            ...defaultExtensions,
         ],
         content: isMounted
            ? initialValue || initialValue !== null
               ? initialValue
               : initialContent
            : initialContent,
         editable,
         immediatelyRender: false,
         onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            onChange?.(json);
            debouncedUpdates(editor);
            setSaveStatus(i18n.t('UNSAVED'));
         },
         editorProps: {
            attributes: {
               class: cn(
                  'tiptap prose prose-sm  focus:outline-none',
                  'p-4  w-full md:min-w-[600px]',
                  'relative min-h-[300px]  border-muted bg-background',
                  editable
                     ? ' border-2 border hover:border-primary p-6 pt-10 rounded-md'
                     : ' border-0',
                  className
               ),
            },
         },
         autofocus: true,
      },
      [isMounted]
   );

   // Set initial content if provided
   useEffect(() => {
      if (!isMounted || !editor || !initialContent) return;
      if (
         initialValue === null &&
         JSON.stringify(initialContent) !== JSON.stringify(editor.getJSON())
      ) {
         editor.commands.setContent(initialContent);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [editor, initialContent, isMounted]);

   useEffect(() => {
      if (editor) {
         editor.setEditable(editable);
      }
   }, [editor, editable]);

   if (!editor) {
      return (
         <div className={cn('editor-loading flex items-center justify-center h-full ')}>
            <Loader className="animate-spin" />
            <span className="text-xs">{i18n.t('LOADING_EDITOR')}</span>
         </div>
      );
   }

   return (
      <div className={cn('relative w-full max-w-screen-lg')}>
         <div className="flex absolute right-2 top-2 z-10 mb-5 gap-2">
            <button
               onClick={clearLocalStorage}
               className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm"
               title="localStorage'ı temizle"
            >
               {i18n.t('CLEAR')}
            </button>
            <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
               {saveStatus}
            </div>
            <div
               className={
                  charsCount
                     ? 'rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground block whitespace-nowrap'
                     : 'hidden'
               }
            >
               {charsCount} {charsCount === 1 ? i18n.t('WORD') : i18n.t('WORDS')}
            </div>
            <LanguageSelector />
         </div>
         {showBubbleMenu && (
            <BubbleMenuSelector
               editor={editor}
               showImageUrl={showImageUrl}
               showImageUpload={showImageUpload}
               showImageGallery={showImageGallery}
               showImportData={showImportData}
               showExportData={showExportData}
            />
         )}
         {showTableMenu && <TableBubbleMenu editor={editor} />}
         {showFooMenu && <FooMenuSelector editor={editor} />}
         <DragHandle editor={editor}>
            <GripVertical />
         </DragHandle>
         <EditorContent editor={editor} />
      </div>
   );
};

export { Tiptap };
