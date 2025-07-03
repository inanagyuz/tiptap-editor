import {
   List,
   ListOrdered,
   CheckSquare,
   Text,
   Bold,
   Italic,
   Underline,
   Strikethrough,
   Code,
   Subscript,
   Superscript,
   TextQuote,
   Trash2,
   Minus,
} from 'lucide-react';
import { type Editor } from '@tiptap/react';
import { BaseSelector, type SelectorItem } from './base-selector';

const listItems: SelectorItem[] = [
   {
      name: 'TEXT',
      icon: Text,
      description: 'Normal text',
      command: (editor) => editor?.chain().focus().clearNodes().run(),
      isActive: (editor) => {
         if (!editor) return false;
         return (
            editor.isActive('paragraph') &&
            !editor.isActive('bold') &&
            !editor.isActive('italic') &&
            !editor.isActive('underline') &&
            !editor.isActive('strike') &&
            !editor.isActive('code') &&
            !editor.isActive('subscript') &&
            !editor.isActive('superscript') &&
            !editor.isActive('bulletList') &&
            !editor.isActive('orderedList') &&
            !editor.isActive('taskList')
         );
      },
   },
   {
      name: 'BOLD',
      command: (editor) => editor.chain().focus().toggleBold().run(),
      isActive: (editor) => editor.isActive('bold'),
      icon: Bold,
      shortcut: 'Ctrl+B',
   },
   {
      name: 'ITALIC',
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (editor) => editor.isActive('italic'),
      icon: Italic,
      shortcut: 'Ctrl+I',
   },
   {
      name: 'UNDERLINE',
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      isActive: (editor) => editor.isActive('underline'),
      icon: Underline,
      shortcut: 'Ctrl+U',
   },
   {
      name: 'STRIKETHROUGH',
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (editor) => editor.isActive('strike'),
      icon: Strikethrough,
      shortcut: 'Ctrl+Shift+S',
   },
   {
      name: 'BLOCK_QUOTE',
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive('blockquote'),
      icon: TextQuote,
      description: 'Insert a block quote',
      shortcut: 'Ctrl+Shift+Q',
   },
   {
      name: 'CODE',
      command: (editor) => editor.chain().focus().toggleCode().run(),
      isActive: (editor) => editor.isActive('code'),
      icon: Code,
      shortcut: 'Ctrl+E',
   },
   {
      name: 'INLINE_CODE',
      command: (editor) => editor.chain().focus().setCodeBlock().run(),
      isActive: (editor) => editor.isActive('codeBlock'),
      icon: Code,
      description: 'Insert inline code block',
      shortcut: 'Ctrl+Shift+C',
   },
   {
      name: 'SUBSCRIPT',
      command: (editor) => editor.chain().focus().toggleSubscript().run(),
      isActive: (editor) => editor.isActive('subscript'),
      icon: Subscript,
      shortcut: 'Ctrl+,',
   },
   {
      name: 'SUPERSCRIPT',
      command: (editor) => editor.chain().focus().toggleSuperscript().run(),
      isActive: (editor) => editor.isActive('superscript'),
      icon: Superscript,
      shortcut: 'Ctrl+.',
   },
   {
      name: 'BULLET_LIST',
      icon: List,
      description: 'Unordered list with bullet points',
      command: (editor) => editor?.chain().focus().toggleBulletList().run(),
      isActive: (editor) => editor?.isActive('bulletList') ?? false,
   },
   {
      name: 'NUMBERED_LIST',
      icon: ListOrdered,
      description: 'Ordered list with numbers',
      command: (editor) => editor?.chain().focus().toggleOrderedList().run(),
      isActive: (editor) => editor?.isActive('orderedList') ?? false,
   },
   {
      name: 'TASK_LIST',
      icon: CheckSquare,
      description: 'Interactive task list with checkboxes',
      command: (editor) => editor?.chain().focus().toggleTaskList().run(),
      isActive: (editor) => editor?.isActive('taskList') ?? false,
   },
   {
      name: 'HORIZONTAL_RULE',
      command: (editor) => editor.chain().focus().setHorizontalRule().run(),
      isActive: (editor) => editor.isActive('horizontalRule'),
      icon: Minus,
      description: 'Insert a horizontal rule',
      shortcut: 'Ctrl+Shift+H',
   },
   {
      name: 'CLEAR_FORMATTING',
      command: (editor) => {
         // ✅ Hem marks hem de nodes temizle
         editor
            .chain()
            .focus()
            .clearNodes() // Block formatları temizle
            .unsetAllMarks() // Inline formatları temizle
            .run();
      },
      isActive: (editor) => {
         if (!editor) return false;

         // ✅ Temizlenecek format var mı kontrol et
         const hasMarks =
            editor.isActive('bold') ||
            editor.isActive('italic') ||
            editor.isActive('underline') ||
            editor.isActive('strike') ||
            editor.isActive('code') ||
            editor.isActive('subscript') ||
            editor.isActive('superscript') ||
            editor.isActive('link');

         const hasBlocks =
            editor.isActive('heading') ||
            editor.isActive('blockquote') ||
            editor.isActive('codeBlock') ||
            editor.isActive('bulletList') ||
            editor.isActive('orderedList') ||
            editor.isActive('taskList');

         // ✅ Temizlenecek format varsa aktif göster
         return hasMarks || hasBlocks;
      },
      icon: Trash2,
      shortcut: 'Ctrl+Shift+X',
      description: 'Clear all formatting',
   },
];

interface SelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const Selector = ({ editor, open, onOpenChange }: SelectorProps) => {
   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={listItems}
         showText={false}
         showDescription={true}
      />
   );
};
