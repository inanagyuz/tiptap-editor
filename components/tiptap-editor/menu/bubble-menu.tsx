import { BubbleMenu } from '@tiptap/react/menus';
import { type Editor } from '@tiptap/react';
import { Selector } from '../selector/selector';
import { useSelectors } from '../selector/useSelectors';
import { MathSelector } from '../selector/math-selector';

export const BubbleMenuSelector = ({ editor }: { editor: Editor }) => {
   const selectors = useSelectors();

   return (
      <BubbleMenu
         editor={editor}
         options={{ placement: 'bottom', offset: 8 }}
         shouldShow={({ editor, state }) => {
            const { from, to } = state.selection;

            // Matematik düğümü aktif mi kontrol et
            const mathTypes = ['math', 'inlineMath', 'blockMath'];
            const isActiveMath = mathTypes.some((type) => editor.isActive(type));

            if (isActiveMath) {
               return true;
            }

            // Seçili metin varsa menüyü göster
            const selectedText = state.doc.textBetween(from, to);
            return !!selectedText.trim();
         }}
         className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
      >
         <Selector editor={editor} {...selectors.selector} />
         <MathSelector editor={editor} />
      </BubbleMenu>
   );
};
