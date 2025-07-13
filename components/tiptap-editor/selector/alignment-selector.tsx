/**
 * @module AlignmentSelector
 *
 * This module provides the AlignmentSelector React component for selecting text alignment in the Tiptap editor.
 * It displays alignment options (left, center, right, justify) with icons and executes the corresponding editor command.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor's setTextAlign command.
 * - Highlights the active alignment option.
 * - Uses BaseSelector for rendering the selector UI.
 *
 * @example
 * ```tsx
 * <AlignmentSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { type Editor } from '@tiptap/react';
import { BaseSelector, type SelectorItem } from './base-selector';

const alignmentItems: SelectorItem[] = [
   {
      name: 'ALIGN_LEFT',
      icon: AlignLeft,
      command: (editor) => editor?.chain().focus().setTextAlign('left').run(),
      isActive: (editor) => {
         if (!editor) return false;
         return (
            editor.isActive({ textAlign: 'left' }) ||
            (!editor.isActive({ textAlign: 'center' }) &&
               !editor.isActive({ textAlign: 'right' }) &&
               !editor.isActive({ textAlign: 'justify' }))
         );
      },
   },
   {
      name: 'ALIGN_CENTER',
      icon: AlignCenter,
      command: (editor) => editor?.chain().focus().setTextAlign('center').run(),
      isActive: (editor) => editor?.isActive({ textAlign: 'center' }) ?? false,
   },
   {
      name: 'ALIGN_RIGHT',
      icon: AlignRight,
      command: (editor) => editor?.chain().focus().setTextAlign('right').run(),
      isActive: (editor) => editor?.isActive({ textAlign: 'right' }) ?? false,
   },
   {
      name: 'ALIGN_JUSTIFY',
      icon: AlignJustify,
      command: (editor) => editor?.chain().focus().setTextAlign('justify').run(),
      isActive: (editor) => editor?.isActive({ textAlign: 'justify' }) ?? false,
   },
];


interface AlignmentSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

/**
 * AlignmentSelector component for selecting text alignment in the editor.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the selector popover is open.
 * @param onOpenChange - Callback fired when the selector is opened or closed.
 */

export const AlignmentSelector = ({ editor, open, onOpenChange }: AlignmentSelectorProps) => {
   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={alignmentItems}
         showText={false}
         width="w-40"
      />
   );
};
