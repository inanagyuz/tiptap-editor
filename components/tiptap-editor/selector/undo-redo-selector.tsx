import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import { Undo, Redo } from 'lucide-react';

export const UndoRedoSelector = ({ editor }: { editor: Editor }) => {
   const editorState = useEditorState({
      editor,
      selector: (ctx) => {
         return {
            canUndo: ctx.editor.can().chain().focus().undo().run(),
            canRedo: ctx.editor.can().chain().focus().redo().run(),
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
         </Button>
      </div>
   );
};
