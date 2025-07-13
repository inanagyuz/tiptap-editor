/**
 * @module FontFamilySelector
 *
 * This module provides the FontFamilySelector React component for selecting font family in the Tiptap editor.
 * It displays a list of font family options and allows users to set or unset the font family for selected text.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor's setFontFamily and unsetFontFamily commands.
 * - Highlights the active font family option.
 * - Uses BaseSelector for rendering the selector UI.
 * - Includes support for custom CSS variable font families.
 *
 * @example
 * ```tsx
 * <FontFamilySelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */
import { type Editor } from '@tiptap/react';
import { BaseSelector, type SelectorItem } from './base-selector';
import { CaseUpper, CircleSlash } from 'lucide-react';

const listItems: SelectorItem[] = [
   {
      name: 'Inter',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('Inter').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'Inter' }),
      description: 'Inter font family',
   },
   {
      name: 'Comic Sans MS',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('Comic Sans MS').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'Comic Sans MS' }),
      description: 'Comic Sans MS font family',
   },
   {
      name: 'Serif',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('serif').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'serif' }),
      description: 'Serif font family',
   },
   {
      name: 'Monospace',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('monospace').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'monospace' }),
      description: 'Monospace font family',
   },
   {
      name: 'Cursive',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('cursive').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'cursive' }),
      description: 'Cursive font family',
   },
   {
      name: 'Exo 2',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('Exo 2').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'Exo 2' }),
      description: 'Exo 2 font family',
   },
   {
      name: 'isCssVariable',
      icon: CaseUpper,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('isCssVariable').run(),
      isActive: (editor: Editor) =>
         editor.isActive('textStyle', { fontFamily: 'var(--title-font-family)' }),
      description: 'isCssVariable font family',
   },
   {
      name: 'UNSETFONTFAMILY',
      icon: CircleSlash,
      command: (editor: Editor) => editor.chain().focus().unsetFontFamily().run(),
      isActive: (editor: Editor) => !editor.isActive('fontFamily'),
      description: 'Unset font family',
   },
];

interface FontFamilySelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

/**
 * FontFamilySelector component for selecting font family in the editor.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the selector popover is open.
 * @param onOpenChange - Callback fired when the selector is opened or closed.
 */

export const FontFamilySelector = ({ editor, open, onOpenChange }: FontFamilySelectorProps) => {
   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={listItems}
         showText={true}
         width="w-42"
      />
   );
};
