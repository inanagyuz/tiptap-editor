/**
 * @module UndoRedoSelector
 *
 * This module provides the UndoRedoSelector React component for undo and redo actions in the Tiptap editor.
 * It displays two buttons for undo and redo, enabling or disabling them based on the editor state.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor's undo and redo commands.
 * - Buttons are disabled if the corresponding action is not available.
 * - Uses Lucide icons for undo and redo.
 *
 * @example
 * ```tsx
 * <UndoRedoSelector editor={editor} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 */

import { Button } from '@/components/ui/button';
import { cn } from '../tiptap-utils';
import { Editor, useEditorState } from '@tiptap/react';
import { Undo, Redo } from 'lucide-react';

export const UndoRedoSelector = ({ editor }: { editor: Editor }) => {
   const editorState = useEditorState({
      editor,
      selector: (ctx) => {
         // Editör view'ı kontrol et
         if (!ctx.editor?.view) {
            return {
               canUndo: false,
               canRedo: false,
            };
         }

         return {
            canUndo: ctx.editor.can().undo(),
            canRedo: ctx.editor.can().redo(),
         };
      },
   });

   if (!editor) return null;

   return (
      <div className="flex flex-row items-center">
         <Button
            variant="ghost"
            size="sm"
            className="rounded-none"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editorState.canUndo}
         >
            <Undo
               className={cn('size-4', { 'text-blue-500': editor.isActive('math') })}
               strokeWidth={2.3}
            />
            <span className="sr-only">Undo</span>
         </Button>
         <Button
            variant="ghost"
            size="sm"
            className="rounded-none"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editorState.canRedo}
         >
            <Redo
               className={cn('size-4', { 'text-blue-500': editor.isActive('math') })}
               strokeWidth={2.3}
            />
            <span className="sr-only">Redo</span>
         </Button>
      </div>
   );
};
