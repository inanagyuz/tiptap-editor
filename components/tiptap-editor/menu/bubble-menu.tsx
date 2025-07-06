import { BubbleMenu } from '@tiptap/react/menus';
import { type Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import {
   useSelectors,
   Selector,
   AlignmentSelector,
   FontFamilySelector,
   FontSizeSelector,
   ColorSelector,
   LineHeightSelector,
   MathSelector,
   UndoRedoSelector,
   LinkSelector,
   ImageSelector,
} from '../selector';

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
         <div className="flex flex-col p-1">
            {/* ✅ İlk satır: Temel formatlar */}
            <div className="flex items-center gap-1 p-1 h-8 mb-1">
               <Selector editor={editor} {...selectors.selector} />
               <Separator orientation="vertical" />
               <AlignmentSelector editor={editor} {...selectors.alignment} />
               <Separator orientation="vertical" />
               <FontSizeSelector editor={editor} {...selectors.fontSize} />

               <Separator orientation="vertical" />
               <LineHeightSelector editor={editor} {...selectors.lineHeight} />
               <Separator orientation="vertical" />
               <UndoRedoSelector editor={editor} />
            </div>
            {/* ✅ İkinci satır: İçerik elemanları */}
            <div className="flex items-center gap-1 p-1 h-8 mb-1">
               <Separator orientation="vertical" />
               <LinkSelector editor={editor} {...selectors.link} />
               <Separator orientation="vertical" />
               <MathSelector editor={editor} />
               <Separator orientation="vertical" />
               <ColorSelector editor={editor} {...selectors.color} />
               <Separator orientation="vertical" />
               <FontFamilySelector editor={editor} {...selectors.fontFamily} />
               <Separator orientation="vertical" />
               <ImageSelector editor={editor} {...selectors.image} />
            </div>
         </div>
      </BubbleMenu>
   );
};
