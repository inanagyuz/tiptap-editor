import * as React from 'react';
import { FloatingMenu } from '@tiptap/react/menus';
import { type Editor } from '@tiptap/react';

export const FooMenuSelector = ({ editor }: { editor: Editor }) => {
   return (
      <FloatingMenu
         editor={editor}
         className="floating-menu"
         shouldShow={({ editor }) => {
            // Eğer içerik boşsa veya `/` karakteri yazılmışsa menüyü göster
            const { state } = editor;
            const { $from } = state.selection;
            const textBefore = $from.nodeBefore?.text || '';
            return textBefore.endsWith('/');
         }}
      >
         <button className="menu-button">Option 1</button>
         <button className="menu-button">Option 2</button>
      </FloatingMenu>
   );
};
