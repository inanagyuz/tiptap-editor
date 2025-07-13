/**
 * @module TableBubbleMenu
 *
 * This component provides the bubble menu for table actions in the Tiptap editor.
 * It displays the table selector when the user's selection is inside a table.
 *
 * @remarks
 * - Uses Tiptap's BubbleMenu extension for contextual table toolbars.
 * - Shows the TableSelector only when the selection is inside a table.
 * - Placement and offset can be customized via options.
 *
 * @example
 * ```tsx
 * <TableBubbleMenu editor={editor} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 */
import React from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { type Editor } from '@tiptap/react';
import { TableSelector } from '../selector/table-selector';
/**
 * TableBubbleMenu component renders the bubble menu for table actions.
 *
 * @param editor - The Tiptap editor instance.
 */
export const TableBubbleMenu = ({ editor }: { editor: Editor }) => {
   const [isTableSelectorOpen, setIsTableSelectorOpen] = React.useState(false);

   if (!editor) {
      return null;
   }

   return (
      <BubbleMenu
         editor={editor}
         options={{ placement: 'top', offset: 8, strategy: 'fixed' }}
         shouldShow={() => {
            return editor.isActive('table');
         }}
         className="flex w-fit overflow-hidden rounded-md border-none  bg-transparent"
      >
         <div className="flex items-center gap-1 p-0 h-8 border-none">
            <TableSelector
               editor={editor}
               open={isTableSelectorOpen}
               onOpenChange={setIsTableSelectorOpen}
            />
         </div>
      </BubbleMenu>
   );
};
