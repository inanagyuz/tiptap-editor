'use client';

import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor, JSONContent, Editor } from '@tiptap/react';
import { defaultExtensions } from './extensions';
import { cn } from './cn';
import { BubbleMenuSelector, FooMenuSelector } from './';
import { useDebouncedCallback } from 'use-debounce';
import hljs from 'highlight.js';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { GripVertical } from 'lucide-react';

export interface Props {
   initialValue?: JSONContent | null;
   onChange?: (value: JSONContent) => void;
   editable?: boolean;
   className?: string;
   showBubbleMenu?: boolean;
   showTableMenu?: boolean;
}

const Tiptap: React.FC<Props> = ({
   initialValue,
   onChange,
   editable = true,
   className,
   showBubbleMenu = true,
   showTableMenu = true,
}) => {
   const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
   const [saveStatus, setSaveStatus] = useState('Saved');
   const [charsCount, setCharsCount] = useState<number | undefined>();
   const [isMounted, setIsMounted] = useState(false); // ✅ SSR kontrolü

   // ✅ Client-side mounting
   useEffect(() => {
      setIsMounted(true);
   }, []);

   //Apply Codeblock Highlighting on the HTML from editor.getHTML()
   const highlightCodeblocks = (content: string) => {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      doc.querySelectorAll('pre code').forEach((el) => {
         hljs.highlightElement(el as HTMLElement);
      });
      return new XMLSerializer().serializeToString(doc);
   };

   const debouncedUpdates = useDebouncedCallback(async (editor: Editor) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem('inan-html-content', highlightCodeblocks(editor.getHTML()));
      window.localStorage.setItem('inan-json-content', JSON.stringify(json));
      setSaveStatus('Saved');
   }, 500);

   const clearLocalStorage = () => {
      window.localStorage.removeItem('inan-html-content');
      window.localStorage.removeItem('inan-json-content');
      setInitialContent(null);
      if (editor) {
         editor.commands.clearContent();
      }
      setSaveStatus('Cleared');
   };

   useEffect(() => {
      if (!isMounted) return;
      const content = window.localStorage.getItem('inan-json-content');
      if (content) setInitialContent(JSON.parse(content));
      else setInitialContent(initialValue ?? null);
   }, [initialValue, isMounted]);

   const editor = useEditor(
      {
         shouldRerenderOnTransaction: true,
         extensions: [...defaultExtensions],
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
            setSaveStatus('Unsaved');
         },
         editorProps: {
            attributes: {
               class: cn(
                  'tiptap prose prose-sm prose-slate dark:prose-invert focus:outline-none',
                  'p-4  w-full md:min-w-[600px]',
                  'relative min-h-[300px]  border-muted bg-background',
                  editable ? ' border-2 border-dashed hover:border-primary p-6 pt-10' : ' border-0',
                  className
               ),
            },
         },
         autofocus: true,
         //injectCSS: false,
         // bubbleMenu: showBubbleMenu ? BubbleMenu : undefined,
      },
      [isMounted] // Sadece isMounted dependency'si
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

   // Set editable state
   // This allows toggling the editor between editable and read-only modes
   useEffect(() => {
      if (editor) {
         editor.setEditable(editable);
      }
   }, [editor, editable]);

   if (!editor) {
      return <div className={cn('editor-loading')}>Loading editor...</div>;
   }

   return (
      <div className={cn('relative w-full max-w-screen-lg')}>
         <div className="flex absolute right-2 top-2 z-10 mb-5 gap-2">
            <button
               onClick={clearLocalStorage}
               className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm"
               title="localStorage'ı temizle"
            >
               Clear
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
               {charsCount} Words
            </div>
         </div>
         {showBubbleMenu && <BubbleMenuSelector editor={editor} />}
         {showTableMenu && <FooMenuSelector editor={editor} />}
         <DragHandle editor={editor}>
            <GripVertical />
         </DragHandle>
         <EditorContent editor={editor} />
      </div>
   );
};

export { Tiptap };
