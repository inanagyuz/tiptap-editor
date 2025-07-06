import { type Editor } from '@tiptap/react';
import { BaseSelector, type SelectorItem } from './base-selector';

const listItems: SelectorItem[] = [
   {
      name: 'Inter',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('Inter').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'Inter' }),
      description: 'Inter font family',
   },
   {
      name: 'Comic Sans MS',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('Comic Sans MS').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'Comic Sans MS' }),
      description: 'Comic Sans MS font family',
   },
   {
      name: 'Serif',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('serif').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'serif' }),
      description: 'Serif font family',
   },
   {
      name: 'Monospace',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('monospace').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'monospace' }),
      description: 'Monospace font family',
   },
   {
      name: 'Cursive',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('cursive').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'cursive' }),
      description: 'Cursive font family',
   },
   {
      name: 'Exo 2',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('Exo 2').run(),
      isActive: (editor: Editor) => editor.isActive('fontFamily', { fontFamily: 'Exo 2' }),
      description: 'Exo 2 font family',
   },
   {
      name: 'isCssVariable',
      icon: undefined,
      command: (editor: Editor) => editor.chain().focus().setFontFamily('isCssVariable').run(),
      isActive: (editor: Editor) =>
         editor.isActive('textStyle', { fontFamily: 'var(--title-font-family)' }),
      description: 'isCssVariable font family',
   },
   {
      name: 'UNSETFONTFAMILY',
      icon: undefined,
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

export const FontFamilySelector = ({ editor, open, onOpenChange }: FontFamilySelectorProps) => {
   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={listItems}
         showText={true}
         width="w-56"
      />
   );
};
